"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Clock } from "lucide-react"

type TestDurationSliderProps = {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function TestDurationSlider({ value, onChange, disabled = false }: TestDurationSliderProps) {
  const [sliderValue, setSliderValue] = useState(value)

  // Update internal state when prop changes
  useEffect(() => {
    setSliderValue(value)
  }, [value])

  const handleSliderChange = (newValue: number[]) => {
    const value = newValue[0]
    setSliderValue(value)
    onChange(value)
  }

  // Format duration for display
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
  }

  // Calculate color based on duration
  const getDurationColor = (minutes: number) => {
    if (disabled) return "text-muted-foreground"
    if (minutes <= 30) return "text-green-500"
    if (minutes <= 60) return "text-blue-500"
    if (minutes <= 90) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className={`space-y-4 ${disabled ? "opacity-70" : ""}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor="test-duration" className="text-sm font-medium">
          Test Duration
        </Label>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <motion.span
            key={sliderValue}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-mono text-sm font-medium ${getDurationColor(sliderValue)}`}
          >
            {formatDuration(sliderValue)}
          </motion.span>
        </div>
      </div>

      <div className="px-1">
        <Slider
          id="test-duration"
          disabled={disabled}
          value={[sliderValue]}
          min={15}
          max={180}
          step={5}
          onValueChange={handleSliderChange}
          className={disabled ? "cursor-not-allowed" : ""}
        />

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>15m</span>
          <span>1h</span>
          <span>2h</span>
          <span>3h</span>
        </div>
      </div>
      {disabled && (
        <p className="text-xs text-muted-foreground italic">
          Test duration cannot be changed after the test has started.
        </p>
      )}
    </div>
  )
}
