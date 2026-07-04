const z = require("zod");

// Schema for generating an interview report
const generateReportSchema = z.object({
    jobDescription: z.string().min(1, "Job description is required"),
    selfDescription: z.string().optional()
    // resumeFile is handled by multer, not in req.body
});

// Schema for starting an interview session
const startSessionSchema = z.object({
    interviewReportId: z.string().min(1, "Interview report ID is required"),
    track: z.enum(["DSA", "MERN", "CORE"]).optional().default("MERN")
});

// Schema for submitting an answer
const submitAnswerSchema = z.object({
    sessionId: z.string().min(1, "Session ID is required"),
    answer: z.string().min(1, "Answer is required")
});

module.exports = {
    generateReportSchema,
    startSessionSchema,
    submitAnswerSchema
};