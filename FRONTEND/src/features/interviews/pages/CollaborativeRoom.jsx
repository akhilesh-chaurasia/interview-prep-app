import { useState } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"
import { useAuth } from "../../auth/hooks/useAuth"
import "./style/collaborative.scss"

export const CollaborativeRoom = () => {
  const [createUsername, setCreateUsername] = useState("")
  const [joinUsername, setJoinUsername] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const navigate = useNavigate()
  const { user } = useAuth()

  // Initialize with user's name from auth
  const defaultName = user?.name || user?.username || ""

  const handleCreateRoom = (e) => {
    e.preventDefault()
    const nameToUse = createUsername.trim() || defaultName
    if (!nameToUse) {
      toast.error("Please enter a username!")
      return
    }
    navigate(`/collaborative/session?username=${encodeURIComponent(nameToUse)}&action=create`)
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    const nameToUse = joinUsername.trim() || defaultName
    if (!nameToUse || !roomCode.trim()) {
      toast.error("Please enter both username and room code!")
      return
    }
    navigate(`/collaborative/session?username=${encodeURIComponent(nameToUse)}&roomCode=${roomCode.trim().toUpperCase()}&action=join`)
  }

  return (
    <div className="collaborative-room-container">
      <div className="collaborative-room-card">
        <h1>🎯 Collaborative Interview Practice</h1>
        <p>Practice interviews with friends in real-time! Ask questions, give feedback, and learn together!</p>
        
        <div className="instructions">
          <div className="instruction-item">
            <span className="instruction-number">1</span>
            <div>
              <strong>Create a room</strong> if you're starting
            </div>
          </div>
          <div className="instruction-item">
            <span className="instruction-number">2</span>
            <div>
              <strong>Share the room code</strong> with your friend
            </div>
          </div>
          <div className="instruction-item">
            <span className="instruction-number">3</span>
            <div>
              <strong>Practice together!</strong> Select questions and chat in real-time
            </div>
          </div>
        </div>
        
        <div className="room-actions">
          <div className="create-room-section">
            <h2>✨ Create New Room</h2>
            <form onSubmit={handleCreateRoom}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={createUsername}
                  placeholder={defaultName || "Enter your name"}
                  onChange={(e) => setCreateUsername(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary">Create Room</button>
            </form>
          </div>

          <div className="join-room-section">
            <h2>🤝 Join Existing Room</h2>
            <form onSubmit={handleJoinRoom}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={joinUsername}
                  placeholder={defaultName || "Enter your name"}
                  onChange={(e) => setJoinUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Room Code</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                />
              </div>
              <button type="submit" className="btn-secondary">Join Room</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}