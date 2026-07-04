import React, { useState } from "react"
import { useNavigate, Link } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { toast } from "react-hot-toast"
import AuthLayout from "../components/AuthLayout"
import AuthInput from "../components/AuthInput"
import AuthButton from "../components/AuthButton"
import PasswordStrength from "../components/PasswordStrength"
import "./Register.scss"

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [errors, setErrors] = useState({})

    const { loading, handleRegister } = useAuth()

    const validateForm = () => {
        const newErrors = {}
        
        if (!username) {
            newErrors.username = "Username is required"
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters"
        }
        
        if (!email) {
            newErrors.email = "Email is required"
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = "Please enter a valid email"
        }
        
        if (!password) {
            newErrors.password = "Password is required"
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        }
        
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }
        
        if (!agreeTerms) {
            newErrors.terms = "You must agree to the terms"
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
            await handleRegister({ username, email, password })
            toast.success("Account created successfully! Welcome 🎉")
            navigate("/")
        } catch (err) {
            console.log(err)
            const errorMessage = err?.response?.data?.message || "Registration failed. Try again"
            toast.error(errorMessage)
        }
    }

    if (loading) {
        return (
            <AuthLayout title="Create Account">
                <div className="auth-loading">
                    <div className="auth-loading__spinner"></div>
                    <p>Creating your account...</p>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout 
            title="Create Account"
            subtitle="Join thousands of professionals preparing for their dream jobs"
        >
            <form onSubmit={handleSubmit} className="auth-form">
                <AuthInput
                    label="Username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={errors.username}
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    }
                    autoComplete="username"
                    required
                />

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
                    placeholder="Create a password"
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
                    autoComplete="new-password"
                    required
                />

                {password && <PasswordStrength password={password} />}

                <AuthInput
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    showPasswordToggle
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    }
                    autoComplete="new-password"
                    required
                />

                <label className={`auth-form__checkbox ${errors.terms ? 'auth-form__checkbox--error' : ''}`}>
                    <input 
                        type="checkbox" 
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span>I agree to the <Link to="/terms" className="auth-form__link">Terms of Service</Link> and <Link to="/privacy" className="auth-form__link">Privacy Policy</Link></span>
                </label>
                {errors.terms && <span className="auth-form__error">{errors.terms}</span>}
                
                <AuthButton 
                    type="submit" 
                    loading={loading}
                    fullWidth
                    size="large"
                >
                    Create Account
                </AuthButton>
            </form>

            <p className="auth-form__switch">
                Already have an account?{' '}
                <Link to="/login" className="auth-form__link">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    )
}

export default Register