import React, { useState } from "react"
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from "../hooks/useAuth"
import { toast } from "react-hot-toast" // ✅ Toast Notification Import Kiya

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // ✅ Frontend Validation Check lagaya
        if (!username || !email || !password) {
            return toast.error("All fields are required ⚠️")
        }

        try {
            await handleRegister({ username, email, password })
            toast.success("Account created successfully! Welcome 🎉") // ✅ Success Toast
            navigate("/")
        } catch (err) {
            console.log(err)
            // ✅ Empty catch block ko fix kiya taaki backend error screen par dikhe
            const errorMessage = err?.response?.data?.message || "Registration failed. Try again ❌"
            toast.error(errorMessage)
        }
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Loading.....</h1>
            </main>
        )
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter username"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter password"
                        />
                    </div>
                    
                    <button disabled={loading} className="button primary-button">
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p>Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register