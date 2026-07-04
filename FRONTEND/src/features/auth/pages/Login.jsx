import React, { useState } from "react"
import { useNavigate, Link } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { toast } from "react-hot-toast"
import AuthLayout from "../components/AuthLayout"
import AuthInput from "../components/AuthInput"
import AuthButton from "../components/AuthButton"
import "./Login.scss"

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}
        
        if (!email) {
            newErrors.email = "Email is required"
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = "Please enter a valid email"
        }
        
        if (!password) {
            newErrors.password = "Password is required"
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            await handleLogin({ email, password })
            toast.success("Welcome back! Login Successful 🎉")
            navigate("/")
        } catch (err) {
            console.log(err)
            const errorMessage = err?.response?.data?.message || "Invalid email or password"
            toast.error(errorMessage)
        }
    }

    if (loading) {
        return (
            <AuthLayout title="Welcome Back">
                <div className="auth-loading">
                    <div className="auth-loading__spinner"></div>
                    <p>Signing you in...</p>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout 
            title="Welcome Back"
            subtitle="Enter your credentials to access your account"
        >
            <form onSubmit={handleSubmit} className="auth-form">
                <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    }
                    autoComplete="email"
                    required
                />

                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    showPasswordToggle
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    }
                    autoComplete="current-password"
                    required
                />

                <div className="auth-form__actions">
                    <label className="auth-form__checkbox">
                        <input 
                            type="checkbox" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Remember me</span>
                    </label>
                    
                    <Link to="/forgot-password" className="auth-form__forgot">
                        Forgot password?
                    </Link>
                </div>
                
                <AuthButton 
                    type="submit" 
                    loading={loading}
                    fullWidth
                    size="large"
                >
                    Sign In
                </AuthButton>
            </form>

            <p className="auth-form__switch">
                Don't have an account?{' '}
                <Link to="/register" className="auth-form__link">
                    Create account
                </Link>
            </p>
        </AuthLayout>
    )
}

export default Login