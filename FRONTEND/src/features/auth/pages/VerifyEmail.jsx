import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { verifyEmail } from "../services/auth.api";
import AuthLayout from "../components/AuthLayout";
import AuthButton from "../components/AuthButton";
import "./VerifyEmail.scss";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // loading, success, error
    const token = searchParams.get("token");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus("error");
                return;
            }

            try {
                await verifyEmail(token);
                setStatus("success");
                toast.success("Email verified successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } catch (err) {
                setStatus("error");
                toast.error(err?.message || "Failed to verify email");
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <AuthLayout 
            title={status === "loading" ? "Verifying Email" : status === "success" ? "Email Verified" : "Verification Failed"}
            subtitle={status === "loading" ? "Please wait while we verify your email address" : ""}
        >
            {status === "loading" && (
                <div className="auth-loading">
                    <div className="auth-loading__spinner"></div>
                    <p>Verifying your email address...</p>
                </div>
            )}
            
            {status === "success" && (
                <div className="auth-success">
                    <div className="auth-success__icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h3 className="auth-success__title">Email Verified Successfully</h3>
                    <p className="auth-success__message">
                        Your email has been verified. You can now login to your account.
                    </p>
                    <p className="auth-success__hint">
                        Redirecting to login page...
                    </p>
                    <Link to="/login">
                        <AuthButton variant="secondary" fullWidth>
                            Go to Login
                        </AuthButton>
                    </Link>
                </div>
            )}
            
            {status === "error" && (
                <div className="auth-error">
                    <div className="auth-error__icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h3 className="auth-error__title">Verification Failed</h3>
                    <p className="auth-error__message">
                        This verification link is invalid or has expired. Please register again to get a new verification email.
                    </p>
                    <Link to="/register">
                        <AuthButton variant="secondary" fullWidth>
                            Go to Register
                        </AuthButton>
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
};

export default VerifyEmail;
