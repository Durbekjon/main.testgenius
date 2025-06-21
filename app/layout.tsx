import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { ColorThemeProvider } from "@/contexts/color-theme-context"
import { ModalProvider } from "@/contexts/modal-context"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <ColorThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <ModalProvider>{children}</ModalProvider>
              </AuthProvider>
            </LanguageProvider>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  metadataBase: new URL('https://testgenius.uz'),
  title: {
    default: "TestGenius AI - Create AI-Powered Tests in Seconds",
    template: "%s | TestGenius AI"
  },
  description: "Transform your teaching with AI-powered test generation. Create professional assessments in seconds with multiple question types, real-time analytics, and comprehensive reporting.",
  keywords: [
    "AI test generation",
    "online assessment platform",
    "educational testing software",
    "quiz maker",
    "test creation tool",
    "multiple choice questions",
    "essay questions",
    "true false questions",
    "matching questions",
    "fill in the blank",
    "short answer questions",
    "test analytics",
    "student assessment",
    "teacher tools",
    "educational technology",
    "test monitoring",
    "real-time testing",
    "test results",
    "performance analytics",
    "custom test creation",
    "AI test generator",
    "online quiz maker",
    "educational assessment tool",
    "teacher test creation",
    "multiple choice test maker",
    "essay question generator",
    "true false quiz creator",
    "matching questions tool",
    "fill in the blank generator",
    "short answer test maker",
    "student assessment platform",
    "test analytics dashboard",
    "real-time test monitoring",
    "classroom assessment tools"
  ],
  authors: [{ name: "TestGenius AI Team" }],
  creator: "TestGenius AI",
  publisher: "TestGenius AI",
  generator: "Next.js",
  
  // Add meta tags that were previously in the manual <head>
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://testgenius.uz",
    siteName: "TestGenius AI",
    title: "TestGenius AI - Create AI-Powered Tests in Seconds",
    description: "Transform your teaching with AI-powered test generation. Create professional assessments in seconds with multiple question types, real-time analytics, and comprehensive reporting.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TestGenius AI - AI-Powered Test Generation",
      },
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "TestGenius AI - AI-Powered Test Generation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TestGenius AI - Create AI-Powered Tests in Seconds",
    description: "Transform your teaching with AI-powered test generation. Create professional assessments in seconds.",
    images: ["/og-image.png", "/og-home.png"],
    creator: "@testgeniusai",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://testgenius.uz",
    languages: {
      "en-US": "https://testgenius.uz",
      "ru-RU": "https://testgenius.uz/ru",
      "uz-UZ": "https://testgenius.uz/uz",
    },
  },
}

export const viewport = {
  themeColor: "#000000",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}
