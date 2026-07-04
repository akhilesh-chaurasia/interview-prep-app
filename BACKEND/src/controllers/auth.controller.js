const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const tokenBlacklistModel = require("../models/blacklist.model")
const env = require("../config/env")
const { sendVerificationEmail, sendPasswordResetEmail } = require("../services/email.service")

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            });
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await userModel.create({
            username,
            email,
            password: hash,
            verificationToken,
            verificationTokenExpires: Date.now() + 3600000, // 1 hour
        });

        // Send verification email
        await sendVerificationEmail(email, verificationToken, username);

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json({
            message: "User registered successfully! Please check your email to verify your account.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

     console.log("BODY:", req.body)

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        })

        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            message: "Error during logout"
        })
    }
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            role: user.role
        }
    });
}

/**
 * @name verifyEmailController
 * @description Verify user email using token
 * @access Public
 */
async function verifyEmailController(req, res) {
    try {
        const { token } = req.body;
        
        const user = await userModel.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
        console.error("Verify email error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @name resendVerificationController
 * @description Resend verification email
 * @access Private
 */
async function resendVerificationController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        
        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        await sendVerificationEmail(user.email, verificationToken, user.username);
        
        res.status(200).json({ message: "Verification email resent successfully!" });
    } catch (error) {
        console.error("Resend verification error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @name forgotPasswordController
 * @description Send password reset email
 * @access Public
 */
async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        
        if (!user) {
            // Always return 200 even if user not found to prevent email enumeration
            return res.status(200).json({ message: "If that email exists, a password reset link has been sent" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        await sendPasswordResetEmail(user.email, resetToken, user.username);
        
        res.status(200).json({ message: "If that email exists, a password reset link has been sent" });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @name resetPasswordController
 * @description Reset password using token
 * @access Public
 */
async function resetPasswordController(req, res) {
    try {
        const { token, newPassword } = req.body;
        
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired password reset token" });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully! You can now login with your new password" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    verifyEmailController,
    resendVerificationController,
    forgotPasswordController,
    resetPasswordController
}