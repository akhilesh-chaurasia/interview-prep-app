require("dotenv").config() 
const http = require("http")
const app = require("./src/app") 
const connectToDB = require("./src/config/database")
const env = require("./src/config/env")
const { Server } = require("socket.io")

// Store active rooms (in-memory, for simple use case)
const rooms = new Map()

const start = async () => {
     try { 
        await connectToDB() 

        // Create HTTP server for socket.io
        const server = http.createServer(app)

        // Set up Socket.IO server
        const io = new Server(server, {
          cors: {
            origin: "*",
            methods: ["GET", "POST"]
          }
        })

        // Handle Socket.IO connections
        io.on("connection", (socket) => {
          console.log("New user connected:", socket.id)

          // Create a room
          socket.on("create-room", (data) => {
            const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
            rooms.set(roomCode, {
              host: data.username,
              hostId: socket.id,
              participants: [data.username],
              messages: []
            })
            socket.join(roomCode)
            socket.emit("room-created", { roomCode })
            console.log(`Room created: ${roomCode} by ${data.username}`)
          })

          // Join a room
          socket.on("join-room", (data) => {
            const room = rooms.get(data.roomCode)
            if (room) {
              if (!room.participants.includes(data.username)) {
                room.participants.push(data.username)
              }
              socket.join(data.roomCode)
              io.to(data.roomCode).emit("user-joined", { 
                username: data.username, 
                participants: room.participants 
              })
              socket.emit("room-joined", { room })
              console.log(`${data.username} joined room ${data.roomCode}`)
            } else {
              socket.emit("room-error", { message: "Room not found!" })
            }
          })

          // Send message
          socket.on("send-message", (data) => {
            const room = rooms.get(data.roomCode)
            if (room) {
              const message = {
                username: data.username,
                text: data.text,
                timestamp: new Date()
              }
              room.messages.push(message)
              io.to(data.roomCode).emit("new-message", message)
            }
          })

          // Disconnect
          socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id)
          })
        })

        server.listen(env.PORT, () => { 
          console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`) 
        }) 
}
  catch (err) { 
    console.error("Failed to start server:", err)
    process.exit(1)
} 
}
 start()