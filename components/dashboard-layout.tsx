"use client"

import type React from "react"

import { LogOut, MenuIcon, Settings, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="flex h-screen antialiased text-foreground">
      <aside className="relative z-20 flex flex-col space-y-2 border-r bg-muted/50 py-4 md:w-64 md:shrink-0 md:transition-transform md:duration-300 lg:translate-x-0">
        <div className="px-4">
          <a className="flex items-center gap-2 font-semibold" href="#">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="16" fill="#725CFF" />
              <path
                d="M16.0007 9.33325L11.3333 22.6666H13.3333L14.6667 18.6666H17.3333L18.6667 22.6666H20.6667L16.0007 9.33325Z"
                fill="white"
              />
            </svg>
            Acme
          </a>
        </div>
        <div className="flex-1">
          <ul className="space-y-1">
            <li>
              <a
                className="group relative flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-foreground"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-70 group-hover:opacity-100"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>{t("nav.dashboard")}</span>
              </a>
            </li>
            <li>
              <a
                className="group relative flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-foreground"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-70 group-hover:opacity-100"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" x2="16" y1="8" y2="12" />
                  <line x1="20" x2="16" y1="16" y2="12" />
                </svg>
                <span>{t("nav.customers")}</span>
              </a>
            </li>
            <li>
              <a
                className="group relative flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-foreground"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-70 group-hover:opacity-100"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                <span>{t("nav.invoices")}</span>
              </a>
            </li>
            <li>
              <a
                className="group relative flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-foreground"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-70 group-hover:opacity-100"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
                </svg>
                <span>{t("nav.reports")}</span>
              </a>
            </li>
            <li>
              <a
                className="group relative flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-foreground"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-70 group-hover:opacity-100"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6" />
                  <path d="M2 3h14l-6 6v4" />
                  <line x1="15" x2="22" y1="13" y2="13" />
                </svg>
                <span>{t("nav.analytics")}</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-auto px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2">
                <User className="h-4 w-4" />
                {t("nav.profile")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{t("nav.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("nav.settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // Clear any authentication tokens or user data
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("auth_token")
                    // Redirect to the login page
                    window.location.href = "/auth/signin"
                  }
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("nav.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute left-4 top-4 md:hidden">
            <MenuIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-xs">
          <SheetHeader className="text-left">
            <SheetTitle>Dashboard Menu</SheetTitle>
          </SheetHeader>
          <div className="flex-1">
            <ul className="space-y-1">
              <li>
                <a
                  className="group relative flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-foreground"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 opacity-70 group-hover:opacity-100"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>{t("nav.dashboard")}</span>
                </a>
              </li>
              <li>
                <a
                  className="group relative flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-foreground"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 opacity-70 group-hover:opacity-100"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" x2="16" y1="8" y2="12" />
                    <line x1="20" x2="16" y1="16" y2="12" />
                  </svg>
                  <span>{t("nav.customers")}</span>
                </a>
              </li>
              <li>
                <a
                  className="group relative flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-foreground"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 opacity-70 group-hover:opacity-100"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  <span>{t("nav.invoices")}</span>
                </a>
              </li>
              <li>
                <a
                  className="group relative flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-foreground"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 opacity-70 group-hover:opacity-100"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
                  </svg>
                  <span>{t("nav.reports")}</span>
                </a>
              </li>
              <li>
                <a
                  className="group relative flex items-center space-x-2 rounded-md px-4 py-2 font-medium hover:bg-secondary hover:text-foreground"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 opacity-70 group-hover:opacity-100"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6" />
                    <path d="M2 3h14l-6 6v4" />
                    <line x1="15" x2="22" y1="13" y2="13" />
                  </svg>
                  <span>{t("nav.analytics")}</span>
                </a>
              </li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
      <main className="flex flex-col flex-1">
        <header className="flex items-center justify-between px-6 py-4">
          <div className="space-y-1">
            <h1 className="font-semibold">{t("dashboard.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-[200px]" />
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  )
}
