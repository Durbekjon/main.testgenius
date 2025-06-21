import type { Socket } from "socket.io-client"
import { createSocketConnection, getAuthToken, createEventListener, COMMON_EVENTS } from "./socket-core"

// Generate test socket events
export const GENERATE_TEST_EVENTS = {
  GENERATE_TEST_BY_FORM: "generate:test:form",
  GENERATE_TEST_BY_BOOK: "generate:test:book",
  GENERATE_TEST_SUCCESS: "generate:test:success",
  GENERATE_TEST_ERROR: "generate:test:error",
  TEST_PROGRESS: "test_progress",
  TEST_CREATED: "test_created",
}

// Socket instance
let generateTestSocket: Socket | null = null

// Update the initGenerateTestSocket function to handle the mock socket
export function initGenerateTestSocket(): Socket | any | null {
  if (generateTestSocket) return generateTestSocket

  const accessToken = getAuthToken()
  generateTestSocket = createSocketConnection("generate-test", { accessToken })

  return generateTestSocket
}

export function getGenerateTestSocket(): Socket | null {
  return generateTestSocket
}

/**
 * Emit event to generate test socket
 */
export function emitGenerateTestEvent(event: string, data: any): boolean {
  if (!generateTestSocket) {
    console.error("Generate test socket not initialized")
    return false
  }

  generateTestSocket.emit(event, data)
  return true
}

/**
 * Listen for event from generate test socket
 */
export function onGenerateTestEvent<T>(event: string, callback: (data: T) => void): () => void {
  return createEventListener<T>(generateTestSocket, event, callback)
}

/**
 * Close generate test socket connection
 */
export function closeGenerateTestSocket(): void {
  if (generateTestSocket) {
    generateTestSocket.disconnect()
    generateTestSocket = null
  }
}

// Setup connection status listeners
export function setupGenerateTestConnectionListeners(
  onConnect?: () => void,
  onDisconnect?: () => void,
  onError?: (err: any) => void,
): () => void {
  const socket = initGenerateTestSocket()

  if (!socket) return () => {}

  const connectCleanup = onConnect ? createEventListener(socket, COMMON_EVENTS.CONNECT, onConnect) : () => {}
  const disconnectCleanup = onDisconnect
    ? createEventListener(socket, COMMON_EVENTS.DISCONNECT, onDisconnect)
    : () => {}
  const errorCleanup = onError ? createEventListener(socket, COMMON_EVENTS.ERROR, onError) : () => {}

  return () => {
    connectCleanup()
    disconnectCleanup()
    errorCleanup()
  }
}
