"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type RemoveParticipantDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  participantName: string
}

export function RemoveParticipantDialog({
  open,
  onOpenChange,
  onConfirm,
  participantName,
}: RemoveParticipantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10"
          >
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </motion.div>
          <DialogTitle className="text-center">Remove Participant</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to remove <span className="font-medium">{participantName}</span> from this test? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Remove Participant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
