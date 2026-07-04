import React, { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { forgotPassword } from "../services/auth.api";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        if (!email) {
            setError("Email is required");
            return false;
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setError("Please enter a valid email");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email);
            setEmailSent(true);
            toast.success("Password reset email sent! Please check your inbox.");
        } catch (err) {
            toast.error(err?.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Forgot Password"
            subtitle="Enter your email address and we'll send you a password reset link"
            showBackLink={!emailSent}
            backLinkText="Back to Login"
            backLinkTo="/login"
        >
            {!emailSent ? (
                <form onSubmit={handleSubmit} className="auth-form">
                    <AuthInput
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) validateEmail(e.target.value);
                        }}
                        error={error}
                        icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        }
                        autoComplete="email"
                        required
                    />
                    
                    <AuthButton 
                        type="submit" 
                        loading={loading}
                        fullWidth
                        size="large"
                    >
                        Send Reset Link
                    </AuthButton>
                </form>
            ) : (
                <div className="auth-success">
                    <div className="auth-success__icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h3 className="auth-success__title">Check Your Email</h3>
                    <p className="auth-success__message">
                        We've sent a password reset link to <strong>{email}</strong>. 
                        Please check your inbox and follow the instructions.
                    </p>
                    <p className="auth-success__hint">
                        Didn't receive the email? Check your spam folder or try again.
                    </p>
                    <AuthButton 
                        variant="secondary"
                        onClick={() => {
                            setEmailSent(false);
                            setEmail("");
                        }}
                        fullWidth
                    >
                        Try Again
                    </AuthButton>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
