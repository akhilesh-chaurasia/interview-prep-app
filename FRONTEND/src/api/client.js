import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})

// Endpoints that are allowed to return 401 without triggering a redirect
const AUTH_CHECK_URLS = ["/api/auth/get-me", "/api/auth/login"]

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url || ""
        const is401 = error.response?.status === 401
        const isAuthCheck = AUTH_CHECK_URLS.some(url => requestUrl.includes(url))

        if (is401 && !isAuthCheck) {
            // JWT expired mid-session — redirect to login
            window.location.href = "/login"
        }

        return Promise.reject(error)
    }
)

export default api