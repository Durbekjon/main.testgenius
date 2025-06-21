"use client";

import { useState, useEffect, useCallback } from "react";
import { ONLINE_TEST_EVENTS } from "@/lib/socket-service";
import { useOnlineTestSocket } from "@/hooks/use-socket";

export interface ParticipantBase {
  id: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  status: "joining" | "active" | "idle" | "left" | "suspicious";
  progress: number;
  joinedAt: Date;
  userId?: string | number; // Backend sometimes uses userId instead of id
  clientId?: string; // Add clientId field
}

export interface Participant extends ParticipantBase {
  name: string; // Computed property for display
}

interface UseMonitorSocketProps {
  testId: string | null;
  tempCode: string | null;
}

interface UseMonitorSocketResult {
  isConnected: boolean;
  participants: Participant[];
  isLoading: boolean;
  error: Error | null;
  testStarted: boolean;
  testEnded: boolean;
  joinTestRoom: (code: string) => void;
  startTest: (duration: number) => void;
  pauseTest: () => void;
  resumeTest: () => void;
  removeParticipant: (participantId: string | number) => void;
  on: (event: string, callback: (data: any) => void) => void;
}

export function useMonitorSocket({
  testId,
  tempCode,
}: UseMonitorSocketProps): UseMonitorSocketResult {
  const { isConnected, on, emit, error } = useOnlineTestSocket();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatParticipant = useCallback((data: any): Participant => {
    const id =
      data.id ||
      data.userId ||
      data.clientId ||
      Math.random().toString(36).substring(2, 9);
    const firstName = data.firstName || "";
    const lastName = data.lastName || "";
    const name =
      `${firstName} ${lastName}`.trim() || `Participant ${id.substring(0, 6)}`;

    let status = data.status || "joining";
    if (status === "pending") {
      status = "joining";
    }

    return {
      id,
      userId: data.userId || id,
      clientId: data.clientId || id,
      firstName,
      lastName,
      name,
      email: data.email || "",
      status,
      progress: data.progress || 0,
      joinedAt: new Date(data.joinedAt || Date.now()),
    };
  }, []);

  // Update participants when new data comes in
  const updateParticipants = useCallback(
    (newParticipants: ParticipantBase[]): void => {
      setParticipants((prev) => {
        // Map all new participants to the correct format
        const formattedNew = newParticipants.map(formatParticipant);

        // Create a map of existing participants for quick lookup
        const existingMap = new Map(prev.map((p) => [p.id.toString(), p]));

        // Merge existing with new participants, overriding with new data
        const merged = formattedNew.map((newP) => {
          const existingP = existingMap.get(newP.id.toString());
          if (existingP) {
            return {
              ...existingP,
              ...newP,
              // Preserve joinedAt date from existing participant
              joinedAt: existingP.joinedAt,
            };
          }
          return newP;
        });

        return merged;
      });
    },
    [formatParticipant]
  );

  // Join the test room
  const joinTestRoom = useCallback(
    (code: string) => {
      if (!isConnected) return;

      setIsLoading(true); // Set loading state when joining
      console.log("Emitting JOIN_ONLINE_TEST with code:", code);
      emit(ONLINE_TEST_EVENTS.JOIN_ONLINE_TEST, {
        code: Number(code),
      });

      setJoinedRoom(true);
    },
    [isConnected, emit]
  );

  // Initialize socket events when connected and test code is available
  useEffect(() => {
    if (!isConnected || !tempCode || joinedRoom) return;

    joinTestRoom(tempCode);
  }, [isConnected, tempCode, joinTestRoom, joinedRoom]);

  // Set up event listeners for socket events
  useEffect(() => {
    if (!isConnected) return;

    // Clean up function for all listeners
    const cleanupFunctions: Array<() => void> = [];

    // Handler for JOIN_ONLINE_TEST event
    const joinHandler = on(ONLINE_TEST_EVENTS.JOIN_ONLINE_TEST, (data: any) => {
      console.log("JOIN_ONLINE_TEST event received:", data);
      setIsLoading(false); // Clear loading state when data is received

      if (data.onlineUsers && Array.isArray(data.onlineUsers)) {
        // If server sends a full array of users
        const newParticipants = data.onlineUsers.map((user: any) => ({
          id: user.userId || user.id,
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: user.status,
          progress: user.progress || 0,
          joinedAt: new Date(user.joinedAt || Date.now()),
        }));

        updateParticipants(newParticipants);
      } else if (data.userId) {
        const newParticipant = {
          id: data.userId,
          userId: data.userId,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          status: "joining",
          progress: 0,
          joinedAt: new Date(),
        };

        setParticipants((prev) => {
          const exists = prev.some(
            (p) => p.id.toString() === newParticipant.id.toString()
          );
          if (exists) return prev;
          return [...prev, formatParticipant(newParticipant)];
        });
      }
    });
    cleanupFunctions.push(joinHandler);

    const changeUserDataHandler = on(
      ONLINE_TEST_EVENTS.CHANGE_USER_DATA,
      (data: any) => {
        try {
          console.log("CHANGE_USER_DATA event received:", data);

          let onlineUsers: any[] = [];

          if (data.onlineUsers) {
            if (typeof data.onlineUsers === "string") {
              onlineUsers = JSON.parse(data.onlineUsers);
            } else if (Array.isArray(data.onlineUsers)) {
              onlineUsers = data.onlineUsers;
            }
          } else {
            onlineUsers = [];
          }

          if (onlineUsers.length > 0) {
            const validUsers = onlineUsers.filter(
              (user) => user && (user.userId || user.id || user.clientId)
            );

            updateParticipants(validUsers);
          } else if (data.userId || data.clientId) {
            const userId = data.userId || data.clientId;

            setParticipants((prev) =>
              prev.map((p) => {
                if (
                  p.id.toString() === userId.toString() ||
                  p.clientId === userId
                ) {
                  const updatedParticipant = formatParticipant({
                    ...data,
                    status:
                      data.status ||
                      (p.status === "joining" ? "active" : p.status),
                  });

                  return {
                    ...p,
                    ...updatedParticipant,
                    joinedAt: p.joinedAt,
                  };
                }
                return p;
              })
            );
          }
        } catch (error) {
          console.error("Error processing CHANGE_USER_DATA event:", error);
        }
      }
    );
    cleanupFunctions.push(changeUserDataHandler);

    const userJoinedHandler = on(
      ONLINE_TEST_EVENTS.JOIN_ONLINE_TEST,
      (data: any) => {
        console.log("USER_JOINED event received:", data);
      }
    );
    cleanupFunctions.push(userJoinedHandler);

    const userLeftHandler = on(ONLINE_TEST_EVENTS.USER_LEFT, (data: any) => {
      console.log("USER_LEFT event received:", data);

      if (!data.userId) return;

      setParticipants((prev) =>
        prev.map((p) =>
          p.id.toString() === data.userId.toString()
            ? { ...p, status: "left" }
            : p
        )
      );
    });
    cleanupFunctions.push(userLeftHandler);

    const progressHandler = on(
      ONLINE_TEST_EVENTS.PROGRESS_UPDATED,
      (data: any) => {
        console.log("PROGRESS_UPDATED event received:", data);

        if (!data.userId || typeof data.progress !== "number") return;

        setParticipants((prev) =>
          prev.map((p) =>
            p.id.toString() === data.userId.toString()
              ? { ...p, progress: data.progress }
              : p
          )
        );
      }
    );
    cleanupFunctions.push(progressHandler);

    const testStartedHandler = on(
      ONLINE_TEST_EVENTS.START_ONLINE_TEST,
      (data: any) => {
        console.log("ONLINE_TEST_STARTED event received:", data);
        setTestStarted(true);
      }
    );
    cleanupFunctions.push(testStartedHandler);

    const testEndedHandler = on(
      ONLINE_TEST_EVENTS.ONLINE_TEST_ENDED,
      (data: any) => {
        console.log("ONLINE_TEST_ENDED event received:", data);
        setTestEnded(true);
      }
    );
    cleanupFunctions.push(testEndedHandler);

    // Clean up all event listeners when component unmounts or dependencies change
    return () => {
      cleanupFunctions.forEach((fn) => fn());
    };
  }, [isConnected, on, updateParticipants, formatParticipant]);

  // Function to start the test
  const startTest = useCallback(
    (duration: number) => {
      if (!isConnected || !tempCode) return;
      console.log("Starting test with duration:", duration);
      emit(ONLINE_TEST_EVENTS.START_ONLINE_TEST, {
        code: tempCode,
        durationInMinutes: duration,
      });
    },
    [isConnected, emit, tempCode]
  );

  // Function to pause the test
  const pauseTest = useCallback(() => {
    if (!isConnected || !testId) return;

    emit("pause:test", {
      testId,
    });
  }, [isConnected, emit, testId]);

  // Function to resume the test
  const resumeTest = useCallback(() => {
    if (!isConnected || !testId) return;

    emit("resume:test", {
      testId,
    });
  }, [isConnected, emit, testId]);

  // Function to remove a participant
  const removeParticipant = useCallback(
    (participantId: string | number) => {
      if (!isConnected || !testId) return;

      emit("remove:participant", {
        testId,
        userId: participantId,
      });

      // Also update locally for immediate feedback
      setParticipants((prev) =>
        prev.filter((p) => p.id.toString() !== participantId.toString())
      );
    },
    [isConnected, emit, testId]
  );

  return {
    isConnected,
    participants,
    isLoading,
    error,
    testStarted,
    testEnded,
    joinTestRoom,
    startTest,
    pauseTest,
    resumeTest,
    removeParticipant,
    on,
  };
}
