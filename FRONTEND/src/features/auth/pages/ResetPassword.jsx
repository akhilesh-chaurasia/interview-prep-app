import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { resetPassword } from "../services/auth.api";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import PasswordStrength from "../components/PasswordStrength";
import "./ResetPassword.scss";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);
    const [errors, setErrors] = useState({});
    const token = searchParams.get("token");

    const validateForm = () => {
        const newErrors = {};
        
        if (!token) {
            newErrors.token = "Invalid reset link";
        }
        
        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        }
        
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ token, newPassword });
            setPasswordReset(true);
            toast.success("Password reset successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            toast.error(err?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <AuthLayout title="Invalid Link" subtitle="This password reset link is invalid or has expired">
                <div className="auth-error">
                    <div className="auth-error__icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h3 className="auth-error__title">Invalid Reset Link</h3>
                    <p className="auth-error__message">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link to="/forgot-password">
                        <AuthButton variant="secondary" fullWidth>
                            Request New Link
                        </AuthButton>
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout 
            title="Reset Password"
            subtitle="Create a new secure password for your account"
            showBackLink={!passwordReset}
            backLinkText="Back to Login"
            backLinkTo="/login"
        >
            {!passwordReset ? (
                <form onSubmit={handleSubmit} className="auth-form">
                    <AuthInput
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={errors.newPassword}
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

                    {newPassword && <PasswordStrength password={newPassword} />}

                    <AuthInput
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm new password"
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
                    
                    <AuthButton 
                        type="submit" 
                        loading={loading}
                        fullWidth
                        size="large"
                    >
                        Reset Password
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
                    <h3 className="auth-success__title">Password Reset Successful</h3>
                    <p className="auth-success__message">
                        Your password has been successfully reset. You can now login with your new password.
                    </p>
                    <p className="auth-success__hint">
                        Redirecting to login page...
                    </p>
                </div>
            )}
        </AuthLayout>
    );
};

export default ResetPassword;
