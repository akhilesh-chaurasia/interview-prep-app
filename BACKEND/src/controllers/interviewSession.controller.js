const interviewSession = require("../models/interviewSession.model")
const interviewReportModel = require("../models/interviewReport.model")
const {generateInterviewQuestion , evaluateAnswer} = require("../services/ai.service")

// start session 
async function startInterviewSessionController(req, res) {
    try {
        // 1. req.body se track ko bhi destructure karo
        const { interviewReportId, track } = req.body

        if (!interviewReportId) {
            return res.status(400).json({
                message: "Interview report id is required"
            })
        }

        const report = await interviewReportModel.findById(interviewReportId)

        if (!report) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        // 2. generateInterviewQuestion helper ko track bhi pass karo
        const aiQuestion = await generateInterviewQuestion({
            jobDescription: report.jobDescription,
            track: track || "MERN" // Agar kisi wajah se track na aaye, toh safe side ke liye default MERN
        })

        const session = await interviewSession.create({
            user: req.user.id,
            interviewReportId,
            track, // 3. Schema me tracking ke liye save karna chaho toh kar sakte ho

            questions: [
                {
                    question: aiQuestion.question
                }
            ],

            currentStep: 0,
            completed: false
        })

        return res.status(201).json({
            message: "Interview session started",
            session
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

// submit answer controller

async function submitAnswerController(req, res) {
    try {

        const { sessionId, answer } = req.body

        if (!sessionId || !answer) {
            return res.status(400).json({
                message: "sessionId and answer are required"
            })
        }

        const session = await interviewSession.findById(sessionId)

        if (!session) {
            return res.status(404).json({
                message: "session not found"
            })
        }

        const currentQuestionObj =
            session.questions[session.currentStep]

        if (!currentQuestionObj) {
            return res.status(400).json({
                message: "no current question found"
            })
        }

        const question = currentQuestionObj.question

        currentQuestionObj.answer = answer

        const evaluation = await evaluateAnswer({
            question,
            answer
        })

        const MAX_QUESTIONS = 5

         currentQuestionObj.feedback = evaluation.feedback

         currentQuestionObj.idealAnswer = evaluation.idealAnswer

         currentQuestionObj.missingPoints = evaluation.missingPoints || []

        if (session.currentStep >= MAX_QUESTIONS - 1) {
          session.completed = true
            await session.save()
 
            return res.status(200).json({
               message: "Interview completed",
               session
           })
         }

        const report = await interviewReportModel.findById(
            session.interviewReportId
        )

        const nextQuestion = await generateInterviewQuestion({
            jobDescription: report.jobDescription
        })

        session.questions.push({
            question: nextQuestion.question
        })

        session.currentStep += 1

        await session.save()

        return res.status(200).json({
            message: "Answer submitted",
            session
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

async function getSessionController(req, res) {

    try {

        const { sessionId } = req.params

        const session = await interviewSession.findById(sessionId)

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            })
        }

        return res.status(200).json({
            session
        })

    } catch (err) {

        console.log(err)

        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {startInterviewSessionController ,
                   submitAnswerController ,
                   getSessionController
                }