const express = require("express")

const authMiddleware = require("../middlewares/auth.middleware")
const validateRequest = require("../middlewares/validateMiddleware")
const { startSessionSchema, submitAnswerSchema } = require("../schemas/interviewSchemas")

const {
    startInterviewSessionController,
    submitAnswerController,
    updateSessionProgressController,
    getSessionController,
    getAllSessionsController
} = require("../controllers/interviewSession.controller")

const interviewSessionRouter = express.Router()

// START SESSION
interviewSessionRouter.post(
    "/start",
    authMiddleware.authUser,
    validateRequest(startSessionSchema),
    startInterviewSessionController
)

// SUBMIT ANSWER
interviewSessionRouter.post(
    "/submit-answer",
    authMiddleware.authUser,
    validateRequest(submitAnswerSchema),
    submitAnswerController
)

// UPDATE SESSION PROGRESS
interviewSessionRouter.post(
    "/update-progress",
    authMiddleware.authUser,
    updateSessionProgressController
)

// GET ALL SESSIONS
interviewSessionRouter.get(
    "/",
    authMiddleware.authUser,
    getAllSessionsController
)

// GET SESSION
interviewSessionRouter.get(
    "/:sessionId",
    authMiddleware.authUser,
    getSessionController
)

module.exports = interviewSessionRouter