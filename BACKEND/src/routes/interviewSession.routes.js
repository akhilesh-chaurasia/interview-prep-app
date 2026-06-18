const express = require("express")

const authMiddleware = require("../middlewares/auth.middleware")

const {
    startInterviewSessionController,
    submitAnswerController,
    getSessionController
} = require("../controllers/interviewSession.controller")

const interviewSessionRouter = express.Router()

// START SESSION
interviewSessionRouter.post(
    "/start",
    authMiddleware.authUser,
    startInterviewSessionController
)

// SUBMIT ANSWER
interviewSessionRouter.post(
    "/submit-answer",
    authMiddleware.authUser,
    submitAnswerController
)

// GET SESSION
interviewSessionRouter.get(
    "/:sessionId",
    authMiddleware.authUser,
    getSessionController
)

module.exports = interviewSessionRouter