import { api, API_ENDPOINTS } from "./api"

// Token key names for consistency
export const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
}

// User data interface
export interface UserData {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
  avatar?: string
  logo?: string
  coins?: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Parse JWT token without external libraries
 */
function parseJwt(token: string) {
  try {
    // Split the token and get the payload part (second part)
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error parsing JWT token:", error)
    return null
  }
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
  if (!token) return false

  try {
    const decoded = parseJwt(token)
    if (!decoded || !decoded.exp) return false

    const currentTime = Date.now() / 1000

    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Token is expired
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

/**
 * Verify token with backend
 */
export async function verifyToken(): Promise<boolean> {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
  if (!token) return false

  try {
    const response = await api.get(API_ENDPOINTS.AUTH.VERIFY_TOKEN)
    return response.status === 200
  } catch (error) {
    console.error("Error verifying token:", error)
    return false
  }
}

/**
 * Refresh the access token
 */
export async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
  if (!refreshToken) return false

  try {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })

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

/**
 * Logout the user
 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)

  // Redirect to login page
  window.location.href = "/auth/signin"
}
