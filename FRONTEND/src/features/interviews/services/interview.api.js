import api from "../../../api/client"


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData)

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}


/**
 * @description Service to start a new mock interview session for a given interview report and track.
 */
export const startInterviewSession = async ({ interviewReportId, track }) => {
    
    const response = await api.post("/api/interview/session/start", {
        interviewReportId,
        track
    })

    return response.data
}


/**
 * @description Service to get an interview session by sessionId.
 */
export const getInterviewSession = async (sessionId) => {
    const response = await api.get(`/api/interview/session/${sessionId}`)

    return response.data
}


/**
 * @description Service to submit an answer for the current question in an interview session.
 */
export const submitInterviewAnswer = async ({ sessionId, answer }) => {
    const response = await api.post("/api/interview/session/submit-answer", {
        sessionId,
        answer
    })

    return response.data
}

/**
 * @description Service to update the current question step in an interview session.
 */
export const updateInterviewSessionProgress = async ({ sessionId, currentStep }) => {
    const response = await api.post("/api/interview/session/update-progress", {
        sessionId,
        currentStep
    })

    return response.data
}

/**
 * @description Service to get all interview sessions for the logged in user.
 */
export const getAllInterviewSessions = async () => {
    const response = await api.get("/api/interview/session/")
    return response.data
}