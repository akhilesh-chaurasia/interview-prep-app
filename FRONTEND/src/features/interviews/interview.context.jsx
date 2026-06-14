import { createContext, useState, useContext } from 'react'

export const InterviewContext = createContext()

export const useInterviewContext = () => {
    const context = useContext(InterviewContext)
    if (!context) {
        throw new Error("useInterviewContext must be used inside InterviewProvider")
    }
    return context
}

export const InterviewProvider = ({ children }) => {

    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    const resetInterview = () => {
        setReport(null)
        setReports([])
        setLoading(false)
    }

    const value = {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        resetInterview
    }

    return (
        <InterviewContext.Provider value={value}>
            {children}
        </InterviewContext.Provider>
    )
}