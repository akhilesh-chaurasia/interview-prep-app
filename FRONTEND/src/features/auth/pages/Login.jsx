import React, { useState } from "react"
import { useNavigate, Link } from "react-router"
import "../auth.form.scss"
import { useAuth } from "../hooks/useAuth"
import { toast } from "react-hot-toast" // ✅ Toast notification import kiya

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            return toast.error("All fields are required ⚠️") // ✅ alert ki jagah toast
        }

        try {
            await handleLogin({ email, password })
            toast.success("Welcome back! Login Successful 🎉") // ✅ Success message
            navigate("/")
        } catch (err) {
            console.log(err)
            // ✅ Catch block me toast lagaya taaki bad credentials par error dikhe
            const errorMessage = err?.response?.data?.message || "Invalid email or password ❌";
            toast.error(errorMessage)
        }
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Loading......</h1>
            </main>
        )
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
            </div>
        </main>
    )
}

export default Login