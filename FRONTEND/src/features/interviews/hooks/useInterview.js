import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf
} from "../services/interview.api"

import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = (interviewId) => {

    const context = useContext(InterviewContext)

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
        error,           // NEW
        setError         // NEW
    } = context

    // =========================
    // Generate Interview Report
    // =========================
    const generateReport = async (data) => {
        setLoading(true)
        setError(null)   // NEW
        try {
            const res = await generateInterviewReport(data)

            if (res?.interviewReport) {
                setReport(res.interviewReport)
                return res.interviewReport
            }

        } catch (e) {
            console.log("generateReport error:", e)
            setError(e)  // NEW
        } finally {
            setLoading(false)
        }
    }

    // =========================
    // Get Report By ID
    // =========================
    const getReportById = async (id) => {
        setLoading(true)
        setError(null)   // NEW
        try {
            const res = await getInterviewReportById(id)

            if (res?.interviewReport) {
                setReport(res.interviewReport)
            }

        } catch (e) {
            console.log("getReportById error:", e)
            setError(e)  // NEW
        } finally {
            setLoading(false)
        }
    }

    // =========================
    // Get All Reports
    // =========================
    const getReports = async () => {
        setLoading(true)
        setError(null)   // NEW
        try {
            const res = await getAllInterviewReports()

            if (res?.interviewReports) {
                setReports(res.interviewReports)
            }

        } catch (e) {
            console.log("getReports error:", e)
            setError(e)  // NEW
        } finally {
            setLoading(false)
        }
    }

    // =========================
    // Download Resume PDF
    // =========================
    const getResumePdf = async (interviewReportId) => {
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
    }

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
        }

        loadData()

    }, [interviewId])

    return {
        loading,
        report,
        reports,
        error,           
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }
}