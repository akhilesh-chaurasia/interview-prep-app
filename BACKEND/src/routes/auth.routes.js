const { Router } = require('express');
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateRequest = require("../middlewares/validateMiddleware");
const { 
    registerSchema, 
    loginSchema, 
    verifyEmailSchema, 
    forgotPasswordSchema, 
    resetPasswordSchema 
} = require("../schemas/authSchemas");

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", validateRequest(registerSchema), authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", validateRequest(loginSchema), authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController);

/**
 * @route POST /api/auth/verify-email
 * @description Verify user email
 * @access Public
 */
authRouter.post("/verify-email", validateRequest(verifyEmailSchema), authController.verifyEmailController);

/**
 * @route POST /api/auth/resend-verification
 * @description Resend verification email
 * @access Private
 */
authRouter.post("/resend-verification", authMiddleware.authUser, authController.resendVerificationController);

/**
 * @route POST /api/auth/forgot-password
 * @description Send password reset email
 * @access Public
 */
authRouter.post("/forgot-password", validateRequest(forgotPasswordSchema), authController.forgotPasswordController);

/**
 * @route POST /api/auth/reset-password
 * @description Reset user password
 * @access Public
 */
authRouter.post("/reset-password", validateRequest(resetPasswordSchema), authController.resetPasswordController);

module.exports = authRouter;