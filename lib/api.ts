// API utilities and endpoints
import axios from "axios"
import { TOKEN_KEYS } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
// Create an axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshed = await refreshToken()

        if (refreshed) {
          // Update the Authorization header with the new token
          const newToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
          originalRequest.headers.Authorization = `Bearer ${newToken}`

          // Retry the original request
          return api(originalRequest)
        } else {
          // Redirect to login if refresh failed
          window.location.href = "/auth/signin"
          return Promise.reject(new Error("Authentication failed. Please log in again."))
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        window.location.href = "/auth/signin"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/api/v1/auth/login`,
    REGISTER: `/api/v1/auth/register`,
    VERIFY: `/api/v1/auth/verify`,
    REFRESH: `/api/v1/auth/refresh`,
    FORGOT_PASSWORD: `/api/v1/auth/forgot-password`,
    RESET_PASSWORD: `/api/v1/auth/reset-password`,
    VERIFY_TOKEN: `/api/v1/auth/verify-token`,
    WHOAMI: `/api/v1/auth/whoami`,
  },
  TESTS: {
    CREATE: `/api/v1/tests`,
    GET_ALL: `/api/v1/tests`,
    GET_BY_ID: (id: string) => `/api/v1/tests/${id}`,
    UPDATE: (id: string) => `/api/v1/tests/${id}`,
    DELETE: (id: string) => `/api/v1/tests/${id}`,
    SUBMIT: (id: string) => `/api/v1/tests/${id}/submit`,
  },
  USERS: {
    PROFILE: `/api/v1/users/profile`,
    UPDATE_PROFILE: `/api/v1/users/profile`,
    CHANGE_PASSWORD: `/api/v1/users/change-password`,
  },
  ANALYTICS: {
    DASHBOARD: `/api/v1/analytics/dashboard-stats`,
    TEST_RESULTS: (id: string) => `/api/v1/analytics/tests/${id}`,
  },
}

/**
 * Refresh the access token
 */
async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
  if (!refreshToken) return false

  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
    )

    if (response.data.accessToken) {
      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, response.data.accessToken)
      return true
    }

    return false
  } catch (error) {
    console.error("Error refreshing token:", error)
    return false
  }
}
