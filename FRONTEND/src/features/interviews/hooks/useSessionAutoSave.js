import { useEffect, useCallback } from 'react'

const KEY = (sessionId) => `prepwise_session_${sessionId}`

export const useSessionAutoSave = (sessionId, { answer, timer, currentStep, completed }) => {

    // Auto-save on answer or step change (skips if completed)
    useEffect(() => {
        if (!sessionId || completed) return
        try {
            localStorage.setItem(KEY(sessionId), JSON.stringify({
                answer,
                timer,
                currentStep,
                savedAt: Date.now()
            }))
        } catch (_) {}
    }, [answer, currentStep])

    // Clear on completion
    useEffect(() => {
        if (completed && sessionId) {
            try { localStorage.removeItem(KEY(sessionId)) } catch (_) {}
        }
    }, [completed])

    const getSaved = useCallback(() => {
        if (!sessionId) return null
        try {
            const raw = localStorage.getItem(KEY(sessionId))
            return raw ? JSON.parse(raw) : null
        } catch (_) { return null }
    }, [sessionId])

    const clearSaved = useCallback(() => {
        if (!sessionId) return
        try { localStorage.removeItem(KEY(sessionId)) } catch (_) {}
    }, [sessionId])

    return { getSaved, clearSaved }
}