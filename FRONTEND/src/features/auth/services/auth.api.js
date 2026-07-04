import api from "../../../api/client"

export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", {
            username, email, password
        })
        return response.data
    } catch (err) {
        throw err.response?.data || err.message
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        })
        return response.data
    } catch (err) {
        throw err.response?.data || err.message
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        return response.data
    } catch (err) {
        throw err.response?.data || err.message
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me")
        return response.data
    } catch (err) {
        throw err.response?.data || err.message
    }
}

export async function verifyEmail(token) {
    try {
        const response = await api.post("/api/auth/verify-email", { token })
        return response.data
    } catch (err) {
        throw err.response?.data || err.message
    }
}

export async function resendVerification() {
    try {
        const response = await api.post("/api/auth/resend-verification")
        return response.data
    } catch (err) {
        throw err.response?.data || err.message
    }
}

export async function forgotPassword(email) {
    try {
        const response = await api.post("/api/auth/forgot-password", { email })
        return response.data
    } catch (err) {
        throw err.response?.data || err.message
    }
}

export async function resetPassword({ token, newPassword }) {
    try {
        const response = await api.post("/api/auth/reset-password", { token, newPassword })
        return response.data
    } catch (err) {
        throw err.response?.data || err.message
    }
}