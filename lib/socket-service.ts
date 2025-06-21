import { io, type Socket } from "socket.io-client"
import { getAuthToken } from "./socket-core"
import { COMMON_EVENTS } from "./socket-core"

// Socket namespaces
export const SOCKET_NAMESPACES = {
  GENERATE_TEST: "generate-test",
  ONLINE_TEST: "online-test",
}

// Socket events
export const GENERATE_TEST_EVENTS = {
  GENERATE_TEST_BY_FORM: "generate:test:form",
  GENERATE_TEST_BY_BOOK: "generate:test:book",
  GENERATE_TEST_SUCCESS: "generate:test:success",
  GENERATE_TEST_ERROR: "generate:test:error",
  TEST_PROGRESS: "test_progress",
  TEST_CREATED: "test_created",
}

export const ONLINE_TEST_EVENTS = {
  START_TEST: "start:test",
  TEST_STARTED: "test:started",
  START_ONLINE_TEST: "start:online:test",
  ONLINE_TEST_STARTED: "online:test:started",
  FINISH_ONLINE_TEST: "finish:online:test",
  ONLINE_TEST_ENDED: "online:test:ended",
  JOIN_ONLINE_TEST: "join:online:test",
  LEAVE_ONLINE_TEST: "leave:online:test",
  CHANGE_USER_DATA: "change:user:data",
  USER_JOINED: "user:joined",
  USER_LEFT: "user:left",
  PROGRESS_UPDATED: "progress:updated",
  ERROR: "error",
}

// Singleton socket instances
class SocketService {
  private sockets: Map<string, Socket> = new Map()
  private listeners: Map<string, Map<string, Set<Function>>> = new Map()

  // Get or create a socket for a specific namespace
  getSocket(namespace: string): Socket | null {
    if (this.sockets.has(namespace)) {
      return this.sockets.get(namespace) || null
    }

    return this.createSocket(namespace)
  }

  // Create a new socket connection
  private createSocket(namespace: string): Socket | null {
    try {
      const accessToken = getAuthToken()
      console.log(`Creating ${namespace} socket with token:`, accessToken ? "Token exists" : "No token")

      const socketUrl = process.env.NEXT_PUBLIC_API_URL
      const socket = io(`${socketUrl}/${namespace}`, {
        auth: { accessToken },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      // Setup default listeners
      socket.on(COMMON_EVENTS.CONNECT, () => {
        console.log(`${namespace} socket connected successfully`)
        this.notifyListeners(namespace, COMMON_EVENTS.CONNECT, null)
      })

      socket.on(COMMON_EVENTS.DISCONNECT, (reason) => {
        console.log(`${namespace} socket disconnected: ${reason}`)
        this.notifyListeners(namespace, COMMON_EVENTS.DISCONNECT, reason)
      })

      // socket.on(COMMON_EVENTS.CONNECT_ERROR, (error) => {
      //   console.error(`${namespace} socket connection error:`, error)
      //   this.notifyListeners(namespace, COMMON_EVENTS.CONNECT_ERROR, error)
      // })

      this.sockets.set(namespace, socket)
      this.listeners.set(namespace, new Map())

      return socket
    } catch (error) {
      console.error(`Failed to initialize ${namespace} socket:`, error)
      return null
    }
  }

  // Add event listener
  on<T = any>(namespace: string, event: string, callback: (data: T) => void): () => void {
    const socket = this.getSocket(namespace)
    if (!socket) {
      console.error(`Cannot listen to event ${event}: Socket for ${namespace} not initialized`)
      return () => {}
    }

    // Store the listener for future reference
    if (!this.listeners.has(namespace)) {
      this.listeners.set(namespace, new Map())
    }

    const namespaceListeners = this.listeners.get(namespace)!
    if (!namespaceListeners.has(event)) {
      namespaceListeners.set(event, new Set())
    }

    const eventListeners = namespaceListeners.get(event)!
    eventListeners.add(callback)

    // Add the actual socket.io listener
    socket.on(event, callback)

    // Return cleanup function
    return () => {
      socket.off(event, callback)
      eventListeners.delete(callback)
    }
  }

  // Emit event
  emit(namespace: string, event: string, data: any): boolean {
    const socket = this.getSocket(namespace)
    if (!socket) {
      console.error(`Cannot emit event ${event}: Socket for ${namespace} not initialized`)
      return false
    }

    socket.emit(event, data)
    return true
  }

  // Notify all listeners for an event
  private notifyListeners(namespace: string, event: string, data: any): void {
    if (!this.listeners.has(namespace)) return

    const namespaceListeners = this.listeners.get(namespace)!
    if (!namespaceListeners.has(event)) return

    const eventListeners = namespaceListeners.get(event)!
    eventListeners.forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in ${namespace}/${event} listener:`, error)
      }
    })
  }

  // Close a specific socket
  closeSocket(namespace: string): void {
    const socket = this.sockets.get(namespace)
    if (socket) {
      socket.disconnect()
      this.sockets.delete(namespace)
      this.listeners.delete(namespace)
    }
  }

  // Close all sockets
  closeAllSockets(): void {
    for (const namespace of this.sockets.keys()) {
      this.closeSocket(namespace)
    }
  }
}

// Export singleton instance
export const socketService = new SocketService()
