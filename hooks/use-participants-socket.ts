"use client"

import { useState, useEffect, useCallback } from "react"
import { ONLINE_TEST_EVENTS } from "@/lib/socket-service"
import { useOnlineTestSocket } from "@/hooks/use-socket"

// Update the Participant interface to include clientId
export interface Participant {
  clientId: string
  firstName?: string
  lastName?: string
  email?: string
  status: "joining" | "active" | "ready"
  progress?: number
  joinedAt: Date
}

interface UseParticipantsSocketProps {
  testId: string | null
  tempCode: string | null
}

interface UseParticipantsSocketResult {
  participants: Participant[]
  isLoading: boolean
  error: Error | null
}

export function useParticipantsSocket({ testId, tempCode }: UseParticipantsSocketProps): UseParticipantsSocketResult {
  // Get socket instance and connection status from the base hook
  const { isConnected, on, emit, error } = useOnlineTestSocket()

  // State for participants
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [joinedRoom, setJoinedRoom] = useState(false)

  // Update the isParticipantDataComplete function to check for firstName, lastName, and email
  const isParticipantDataComplete = useCallback((participant: any): boolean => {
    return !!(participant.firstName && participant.lastName && participant.email)
  }, [])

  // Join the test room
  const joinTestRoom = useCallback(() => {
    if (!isConnected || !tempCode) return

    setIsLoading(true)
    console.log("Emitting JOIN_ONLINE_TEST with code:", tempCode)
    emit(ONLINE_TEST_EVENTS.JOIN_ONLINE_TEST, {
      code: Number(tempCode),
    })

    setJoinedRoom(true)
  }, [isConnected, emit, tempCode])

  // Initialize socket events when connected and test code is available
  useEffect(() => {
    if (!isConnected || !tempCode || joinedRoom) return

    joinTestRoom()
  }, [isConnected, tempCode, joinTestRoom, joinedRoom])

  // Set up event listeners for socket events
  useEffect(() => {
    if (!isConnected) return

    // Clean up function for all listeners
    const cleanupFunctions: Array<() => void> = []

    // Handler for JOIN_ONLINE_TEST event - optimistically add participants
    const joinHandler = on(ONLINE_TEST_EVENTS.JOIN_ONLINE_TEST, (data: any) => {
      console.log("JOIN_ONLINE_TEST event received:", data)

      if (data.onlineUsers && Array.isArray(data.onlineUsers)) {
        // Process all users in the array - optimistically add with 'joining' status
        const newParticipants = data.onlineUsers.map((user: any) => ({
          clientId: user.clientId || user.id || Math.random().toString(36).substring(2, 9),
          // Don't set firstName, lastName, email yet - will show as loading
          status: "joining",
          progress: 0,
          joinedAt: new Date(user.joinedAt || Date.now()),
        }))

        setParticipants(newParticipants)
        setIsLoading(false) // We're showing loading state in the UI for each participant
      }
    })
    cleanupFunctions.push(joinHandler)

    // Update the CHANGE_USER_DATA event handler to properly handle the data structure
    const changeUserDataHandler = on(ONLINE_TEST_EVENTS.CHANGE_USER_DATA, (data: any) => {
      console.log("CHANGE_USER_DATA event received:", data)

      if (data.onlineUsers && Array.isArray(data.onlineUsers)) {
        // Update participants with complete data
        setParticipants((prevParticipants) => {
          return data.onlineUsers.map((user: any) => {
            // Find existing participant to preserve joinedAt time
            const existingParticipant = prevParticipants.find((p) => p.clientId === user.clientId)

            // Determine status based on data completeness
            let status = user.status || "joining"
            if (status === "pending") {
              status = "joining"
            } else if (isParticipantDataComplete(user)) {
              status = "active"
            }

            return {
              clientId: user.clientId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              status,
              progress: user.progress || 0,
              // Preserve original join time if available
              joinedAt: existingParticipant?.joinedAt || new Date(user.joinedAt || Date.now()),
            }
          })
        })
      }
    })
    cleanupFunctions.push(changeUserDataHandler)

    // Clean up all event listeners when component unmounts or dependencies change
    return () => {
      cleanupFunctions.forEach((fn) => fn())
    }
  }, [isConnected, on, isParticipantDataComplete])

  return {
    participants,
    isLoading,
    error,
  }
}
