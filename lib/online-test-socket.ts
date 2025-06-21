// This file is now deprecated - use socket-service.ts and hooks/use-socket.ts instead
// We're keeping this file for backward compatibility with existing code
import type { Socket } from "socket.io-client"
import { socketService, SOCKET_NAMESPACES, ONLINE_TEST_EVENTS } from "./socket-service"
import { COMMON_EVENTS } from "./socket-core"

// Re-export events for backward compatibility
export { ONLINE_TEST_EVENTS }

/**
 * Initialize online test socket connection
 */
export function initOnlineTestSocket(): Socket | null {
  return socketService.getSocket(SOCKET_NAMESPACES.ONLINE_TEST)
}

/**
 * Get online test socket instance
 */
export function getOnlineTestSocket(): Socket | null {
  return socketService.getSocket(SOCKET_NAMESPACES.ONLINE_TEST)
}

/**
 * Emit event to online test socket
 */
export function emitOnlineTestEvent(event: string, data: any): boolean {
  return socketService.emit(SOCKET_NAMESPACES.ONLINE_TEST, event, data)
}

/**
 * Listen for event from online test socket
 */
export function onOnlineTestEvent<T>(event: string, callback: (data: T) => void): () => void {
  return socketService.on<T>(SOCKET_NAMESPACES.ONLINE_TEST, event, callback)
}

/**
 * Close online test socket connection
 */
export function closeOnlineTestSocket(): void {
  socketService.closeSocket(SOCKET_NAMESPACES.ONLINE_TEST)
}

// Setup connection status listeners
export function setupOnlineTestConnectionListeners(
  onConnect?: () => void,
  onDisconnect?: () => void,
  onError?: (err: any) => void,
): () => void {
  const socket = initOnlineTestSocket()
  if (!socket) return () => {}

  const connectCleanup = onConnect
    ? socketService.on(SOCKET_NAMESPACES.ONLINE_TEST, COMMON_EVENTS.CONNECT, onConnect)
    : () => {}

  const disconnectCleanup = onDisconnect
    ? socketService.on(SOCKET_NAMESPACES.ONLINE_TEST, COMMON_EVENTS.DISCONNECT, onDisconnect)
    : () => {}

  const errorCleanup = onError
    ? socketService.on(SOCKET_NAMESPACES.ONLINE_TEST, COMMON_EVENTS.CONNECT_ERROR, onError)
    : () => {}

  return () => {
    connectCleanup()
    disconnectCleanup()
    errorCleanup()
  }
}
