import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
    getAllInterviewSessions
} from "../services/interview.api"

import { useContext, useEffect, useRef, useCallback } from "react"
import { InterviewContext } from "../interview.context"

// Cache for sessions to prevent repeated API calls
const sessionsCache = {
    data: null,
    timestamp: 0,
    expiry: 5 * 60 * 1000 // 5 minutes cache
}

export const useInterview = (interviewId) => {

    const context = useContext(InterviewContext)
    const hasFetchedSessions = useRef(false)

    if (!context) {
        throw new Error("useInterview must be used within InterviewProvider")
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        sessions,
        setSessions,
        error,
        setError
    } = context

    // =========================
    // Generate Interview Report
    // =========================
    const generateReport = useCallback(async (data) => {
        setLoading(true)
        setError(null)
        try {
            const res = await generateInterviewReport(data)

            if (res?.interviewReport) {
                setReport(res.interviewReport)
                return res.interviewReport
            }

        } catch (e) {
            console.log("generateReport error:", e)
            setError(e)
        } finally {
            setLoading(false)
        }
    }, [setLoading, setError, setReport])

    // =========================
    // Get Report By ID
    // =========================
    const getReportById = useCallback(async (id) => {
        setLoading(true)
        setError(null)
        try {
            const res = await getInterviewReportById(id)

            if (res?.interviewReport) {
                setReport(res.interviewReport)
            }

        } catch (e) {
            console.log("getReportById error:", e)
            setError(e)
        } finally {
            setLoading(false)
        }
    }, [setLoading, setError, setReport])

    // =========================
    // Get All Reports
    // =========================
    const getReports = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getAllInterviewReports()

            if (res?.interviewReports) {
                setReports(res.interviewReports)
            }

        } catch (e) {
            console.log("getReports error:", e)
            setError(e)
        } finally {
            setLoading(false)
        }
    }, [setLoading, setError, setReports])

    // =========================
    // Download Resume PDF
    // =========================
    const getResumePdf = useCallback(async (interviewReportId) => {
        setLoading(true)

        try {
            const response = await generateResumePdf({ interviewReportId })

            const blob = new Blob([response], { type: "application/pdf" })
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement("a")
            link.href = url
            link.download = `resume_${interviewReportId}.pdf`

            document.body.appendChild(link)
            link.click()

            link.remove()
            window.URL.revokeObjectURL(url)

        } catch (error) {
            console.log("PDF error:", error)
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    // =========================
    // Get All Interview Sessions (with caching)
    // =========================
    const getSessions = useCallback(async (forceRefresh = false) => {
        // Check cache first
        const now = Date.now()
        if (!forceRefresh && sessionsCache.data && (now - sessionsCache.timestamp) < sessionsCache.expiry) {
            setSessions(sessionsCache.data)
            return
        }

        setLoading(true)
        setError(null)
        try {
            const res = await getAllInterviewSessions()
            if (res?.sessions) {
                setSessions(res.sessions)
                // Update cache
                sessionsCache.data = res.sessions
                sessionsCache.timestamp = now
            }
        } catch (e) {
            console.log("getSessions error:", e)
            setError(e)
        } finally {
            setLoading(false)
        }
    }, [setLoading, setError, setSessions])

    // =========================
    // Auto Fetch Logic
    // =========================
    useEffect(() => {

        const loadData = async () => {

            // Single report page
            if (interviewId) {
                if (!report || report._id !== interviewId) {
                    await getReportById(interviewId)
                }
            }

            // Home page (all reports)
            else {
                if (!reports || reports.length === 0) {
                    await getReports()
                }
            }

            // Fetch sessions only once per component mount
            if (!hasFetchedSessions.current) {
                hasFetchedSessions.current = true
                await getSessions()
            }
        }

        loadData()

    }, [interviewId, report?._id, reports?.length])

    return {
        loading,
        report,
        reports,
        sessions,
        error,
        generateReport,
        getReportById,
        getReports,
        getResumePdf,
        getSessions
    }
}