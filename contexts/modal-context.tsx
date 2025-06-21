"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type ModalContextType = {
  isPricingModalOpen: boolean
  setIsPricingModalOpen: (open: boolean) => void
}

const ModalContext = createContext<ModalContextType>({
  isPricingModalOpen: false,
  setIsPricingModalOpen: () => {},
})

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)

  return <ModalContext.Provider value={{ isPricingModalOpen, setIsPricingModalOpen }}>{children}</ModalContext.Provider>
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}
