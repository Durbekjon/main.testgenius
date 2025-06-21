"use client"

// Add support for custom className prop to allow styling from parent components
export function TestTimer({ seconds, className = "" }: { seconds: number; className?: string }) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return (
    <div className={`font-mono ${className}`}>
      {hours > 0 && (
        <>
          <span>{hours.toString().padStart(2, "0")}</span>
          <span>:</span>
        </>
      )}
      <span>{minutes.toString().padStart(2, "0")}</span>
      <span>:</span>
      <span>{remainingSeconds.toString().padStart(2, "0")}</span>
    </div>
  )
}
