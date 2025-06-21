// This file is now deprecated - use socket-service.ts instead
// We're keeping this file for backward compatibility with existing code
import type { Socket } from "socket.io-client"
import { socketService, SOCKET_NAMESPACES, GENERATE_TEST_EVENTS, ONLINE_TEST_EVENTS } from "./socket-service"

// Re-export events for backward compatibility
export { GENERATE_TEST_EVENTS, ONLINE_TEST_EVENTS }

// Get socket instances (legacy methods)
export function initSocket(): Socket | null {
  return socketService.getSocket(SOCKET_NAMESPACES.GENERATE_TEST)
}

export function getSocket(): Socket | null {
  return socketService.getSocket(SOCKET_NAMESPACES.GENERATE_TEST)
}

export function initOnlineTestSocket(): Socket | null {
  return socketService.getSocket(SOCKET_NAMESPACES.ONLINE_TEST)
}

export function getOnlineTestSocket(): Socket | null {
  return socketService.getSocket(SOCKET_NAMESPACES.ONLINE_TEST)
}

// Legacy event methods
export function emitEvent(event: string, data: any): boolean {
  return socketService.emit(SOCKET_NAMESPACES.GENERATE_TEST, event, data)
}

export function onEvent<T = any>(event: string, callback: (data: T) => void): () => void {
  return socketService.on<T>(SOCKET_NAMESPACES.GENERATE_TEST, event, callback)
}

// Close sockets
export function closeSocket(): void {
  socketService.closeAllSockets()
}
