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
    const [error, setError] = useState(null)    // NEW

    const resetInterview = () => {
        setReport(null)
        setReports([])
        setLoading(false)
        setError(null)                          // NEW
    }

    const value = {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        error,                                  // NEW
        setError,                               // NEW
        resetInterview
    }

    return (
        <InterviewContext.Provider value={value}>
            {children}
        </InterviewContext.Provider>
    )
}