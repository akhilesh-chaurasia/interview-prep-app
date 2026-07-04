import { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { io } from "socket.io-client"
import toast from "react-hot-toast"
import "./style/collaborative.scss"

const sampleQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
  },
  {
    id: 2,
    title: "Reverse a Linked List",
    difficulty: "easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list."
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    description: "Given a string s, find the length of the longest substring without repeating characters."
  },
  {
    id: 4,
    title: "Binary Tree Inorder Traversal",
    difficulty: "easy",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values."
  },
  {
    id: 5,
    title: "Merge Intervals",
    difficulty: "medium",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals."
  }
]

export const CollaborativeSession = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const username = searchParams.get("username")
  const roomCodeParam = searchParams.get("roomCode")
  const action = searchParams.get("action")

  const [socket, setSocket] = useState(null)
  const [roomCode, setRoomCode] = useState(roomCodeParam || "")
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!username) {
      navigate("/collaborative")
      return
    }

    const newSocket = io("http://localhost:3000")
    setSocket(newSocket)

    newSocket.on("connect", () => {
      console.log("Connected to server")
      
      if (action === "create") {
        newSocket.emit("create-room", { username })
      } else if (action === "join" && roomCodeParam) {
        newSocket.emit("join-room", { username, roomCode: roomCodeParam })
      }
    })

    newSocket.on("room-created", (data) => {
      setRoomCode(data.roomCode)
      toast.success(`Room created! Code: ${data.roomCode}`)
    })

    newSocket.on("room-joined", (data) => {
      setParticipants(data.room.participants)
      setMessages(data.room.messages)
      toast.success("Joined room successfully!")
    })

    newSocket.on("room-error", (data) => {
      toast.error(data.message)
      navigate("/collaborative")
    })

    newSocket.on("user-joined", (data) => {
      setParticipants(data.participants)
      setMessages(prev => [...prev, {
        username: "System",
        text: `${data.username} joined the room!`,
        timestamp: new Date(),
        isSystem: true
      }])
    })

    newSocket.on("new-message", (message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      newSocket.disconnect()
    }
  }, [username, roomCodeParam, action, navigate])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || !socket) return

    socket.emit("send-message", {
      roomCode,
      username,
      text: inputMessage.trim()
    })
    setInputMessage("")
  }

  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect()
    }
    navigate("/collaborative")
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode)
    toast.success("Room code copied!")
  }

  const selectQuestion = (question) => {
    setCurrentQuestion(question)
  }

  return (
    <div className="collaborative-session-container">
      <div className="collaborative-session-header">
        <div className="header-left">
          <h1>Collaborative Interview Session</h1>
          {roomCode && (
            <div className="room-info">
              <span className="room-code">{roomCode}</span>
              <button className="copy-btn" onClick={handleCopyCode}>Copy</button>
            </div>
          )}
        </div>
        <div className="participants">
          {participants.map((p, i) => (
            <span key={i} className="participant">{p}</span>
          ))}
        </div>
        <button className="leave-btn" onClick={handleLeaveRoom}>Leave Room</button>
      </div>

      <div className="collaborative-session-content">
        <div className="interview-panel">
          <h2>Practice Questions</h2>
          <div className="questions-list">
            {sampleQuestions.map((q) => (
              <div 
                key={q.id} 
                className={`question-card ${currentQuestion?.id === q.id ? 'active' : ''}`}
                onClick={() => selectQuestion(q)}
              >
                <div className="question-title">{q.title}</div>
                <span className={`question-difficulty ${q.difficulty}`}>
                  {q.difficulty}
                </span>
                {currentQuestion?.id === q.id && (
                  <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {q.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-panel">
          <div className="chat-header">
            <h2>Live Chat</h2>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.isSystem ? (
                  <div className="system-message">{msg.text}</div>
                ) : (
                  <div className={`chat-message ${msg.username === username ? 'own' : ''}`}>
                    <div className="message-header">
                      <span className="username">{msg.username}</span>
                      <span className="timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="message-text">{msg.text}</div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={!inputMessage.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}