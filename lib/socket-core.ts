import { io, type Socket } from "socket.io-client"

// Shared socket configuration
export const SOCKET_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
}

// Common socket events
export const COMMON_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",
}

// Helper function to create a socket connection
export function createSocketConnection(namespace: string, options: any = {}): Socket | any {
  try {
    console.log(`Creating socket connection to namespace: ${namespace}`)
    console.log({ options, namespace })

    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      console.log("Server-side rendering detected, cannot create socket")
      return null
    }

    // Create a socket connection
    const socketUrl = namespace ? `${SOCKET_CONFIG.BASE_URL}/${namespace}` : SOCKET_CONFIG.BASE_URL

    console.log(`Initializing socket for namespace: ${namespace || "default"} at URL: ${socketUrl}`)

    console.log("Options:", options)
    const socket = io(socketUrl, {
      auth: options,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
      reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
    })

    console.log(`Socket connection to ${namespace} created successfully`)
    return socket
  } catch (error) {
    console.error(`Error creating socket connection to ${namespace}:`, error)
    throw error
  }
}

// Helper function to get auth token
export function getAuthToken(): string | null {
  return typeof localStorage !== "undefined" ? localStorage.getItem("access_token") : null
}

// Generic event listener with cleanup function
export function createEventListener<T>(socket: Socket | null, event: string, callback: (data: T) => void): () => void {
  if (!socket) {
    console.error(`Cannot listen to event ${event}: Socket not initialized`)
    return () => {}
  }

  socket.on(event, callback)

  return () => {
    if (socket) {
      socket.off(event, callback)
    }
  }
}
