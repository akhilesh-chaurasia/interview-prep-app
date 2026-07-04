const nodemailer = require("nodemailer");
const env = require("../config/env");

// Create a transporter
const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT),
    secure: env.SMTP_SECURE === "true",
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

// Send verification email
const sendVerificationEmail = async (email, token, username) => {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
        from: env.SMTP_FROM,
        to: email,
        subject: "Verify Your Email - YT-GENAI",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Hello ${username},</h2>
                <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
                <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
                    Verify Email
                </a>
                <p style="margin-top: 24px; color: #64748b; font-size: 14px;">
                    This link will expire in 1 hour. If you didn't sign up for an account, you can safely ignore this email.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (email, token, username) => {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
        from: env.SMTP_FROM,
        to: email,
        subject: "Reset Your Password - YT-GENAI",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Hello ${username},</h2>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
                    Reset Password
                </a>
                <p style="margin-top: 24px; color: #64748b; font-size: 14px;">
                    This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
