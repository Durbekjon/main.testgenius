"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { socketService, SOCKET_NAMESPACES } from "@/lib/socket-service"

export function useSocket(namespace: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const cleanupFunctions = useRef<Array<() => void>>([])

  // Initialize socket connection
  useEffect(() => {
    const socket = socketService.getSocket(namespace)

    // Setup connection listeners
    const connectCleanup = socketService.on(namespace, "connect", () => {
      setIsConnected(true)
      setError(null)
    })

    const disconnectCleanup = socketService.on(namespace, "disconnect", () => {
      setIsConnected(false)
    })

    const errorCleanup = socketService.on(namespace, "connect_error", (err) => {
      setError(err)
      setIsConnected(false)
    })

    cleanupFunctions.current.push(connectCleanup, disconnectCleanup, errorCleanup)

    // Check if already connected
    if (socket?.connected) {
      setIsConnected(true)
    }

    return () => {
      // Clean up connection listeners
      cleanupFunctions.current.forEach((cleanup) => cleanup())
      cleanupFunctions.current = []
    }
  }, [namespace])

  // Add event listener
  const on = useCallback(
    <T = any>(event: string, callback: (data: T) => void) => {
      const cleanup = socketService.on<T>(namespace, event, callback)
      cleanupFunctions.current.push(cleanup)
      return cleanup
    },
    [namespace],
  )

  // Remove event listener
  const off = useCallback(
    (event: string, callback: Function) => {
      const socket = socketService.getSocket(namespace)
      if (socket) {
        socket.off(event, callback as any)
      }
    },
    [namespace],
  )

  // Emit event
  const emit = useCallback(
    (event: string, data: any) => {
      return socketService.emit(namespace, event, data)
    },
    [namespace],
  )

  // Get socket instance
  const getSocket = useCallback(() => socketService.getSocket(namespace), [namespace])

  return {
    isConnected,
    error,
    on,
    off,
    emit,
    getSocket,
  }
}

// Specialized hooks for specific namespaces
export function useOnlineTestSocket() {
  return useSocket(SOCKET_NAMESPACES.ONLINE_TEST)
}

export function useGenerateTestSocket() {
  return useSocket(SOCKET_NAMESPACES.GENERATE_TEST)
}
