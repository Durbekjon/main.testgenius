"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Brain, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TeamSection } from "./home-team-section"
import { StructuredData, FAQStructuredData } from "@/components/structured-data"

export default function HomePage() {
  // Create refs for each section
  const featuresRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const pricingRef = useRef<HTMLElement>(null)
  const teamRef = useRef<HTMLElement>(null)

  // Smooth scroll function
  const scrollToSection = (elementRef: React.RefObject<HTMLElement | null>) => {
    if (elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop - 80, // Offset for header
        behavior: "smooth",
      })
    }
  }

  // Handle hash changes for direct links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === "#features" && featuresRef.current) {
        scrollToSection(featuresRef)
      } else if (hash === "#how-it-works" && howItWorksRef.current) {
        scrollToSection(howItWorksRef)
      } else if (hash === "#pricing" && pricingRef.current) {
        scrollToSection(pricingRef)
      } else if (hash === "#team" && teamRef.current && teamRef.current !== null) {
        scrollToSection(teamRef)
      }
    }

    // Check hash on initial load
    handleHashChange()

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Clean up
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  // FAQ data for structured data
  const faqs = [
    {
      question: "What is TestGenius AI?",
      answer: "TestGenius AI is an advanced AI-powered platform that helps educators and businesses create professional, customized tests and assessments in seconds. It supports multiple question types and provides comprehensive analytics."
    },
    {
      question: "How does AI test generation work?",
      answer: "Our AI analyzes your subject, topic, and requirements to generate relevant questions. It creates multiple question types including multiple choice, true/false, essay, matching, and fill-in-the-blank questions."
    },
    {
      question: "What question types are supported?",
      answer: "TestGenius AI supports multiple choice, true/false, short answer, essay, matching, and fill-in-the-blank questions. You can mix and match these types in a single test."
    },
    {
      question: "Can I monitor tests in real-time?",
      answer: "Yes! Our platform provides real-time monitoring capabilities, allowing you to track participant progress, detect suspicious activity, and view live analytics during test sessions."
    },
    {
      question: "Is there a free plan available?",
      answer: "Yes, we offer a free plan that allows you to create up to 5 tests per month. This is perfect for individuals just getting started with AI-powered test generation."
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Structured Data for SEO */}
      <StructuredData type="website" data={{}} />
      <StructuredData type="software" data={{}} />
      <FAQStructuredData faqs={faqs} />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Brain className="h-6 w-6 text-primary" />
            <span>TestGenius AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection(featuresRef)}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection(howItWorksRef)}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection(pricingRef)}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection(teamRef)}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Team
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:py-32 mt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background/80 animate-gradient-slow" />
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div className="absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-secondary/20 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 h-36 w-36 rounded-full bg-accent/20 blur-3xl animate-blob animation-delay-4000" />
        </div>
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Effortless AI-Powered <span className="text-primary">Test Generation</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Create professional, customized tests in seconds with our advanced AI technology. Save time and deliver
              better assessments for your students or employees.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard/create">
                <Button size="lg" className="group">
                  Create a Test Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => scrollToSection(howItWorksRef)}>
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} id="how-it-works" className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-8">
              {stepsData.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Pricing Plans</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose the plan that best fits your testing needs. All plans include our core AI test generation features.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold">Free</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="ml-1 text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">For individuals just getting started</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Up to 5 tests per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Basic question types</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Up to 30 participants</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Basic analytics</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6">
                  Get Started
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-card rounded-xl overflow-hidden border border-primary shadow-md hover:shadow-lg transition-all relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                Most Popular
              </div>
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold">Pro</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">$19</span>
                  <span className="ml-1 text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">For professionals and small teams</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Unlimited tests</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>All question types</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Up to 100 participants</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Export to PDF/Excel</span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Get Started</Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">$49</span>
                  <span className="ml-1 text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">For organizations with advanced needs</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Unlimited participants</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} id="team" className="py-20">
        <TeamSection />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Test Creation Process?</h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of educators and HR professionals who save hours every week with TestGenius AI.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="group">
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 font-bold mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span>TestGenius AI</span>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TestGenius AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "AI-Powered Generation",
    description:
      "Create comprehensive tests in seconds with our advanced AI that understands context and curriculum requirements.",
    icon: Sparkles,
  },
  {
    title: "Customizable Templates",
    description: "Choose from a variety of test formats and customize them to match your specific needs and branding.",
    icon: CheckCircle,
  },
  {
    title: "Detailed Analytics",
    description: "Track performance metrics and gain insights into test effectiveness and student progress.",
    icon: Brain,
  },
]

const stepsData = [
  {
    title: "Select Your Parameters",
    description: "Choose the subject, topic, difficulty level, and number of questions for your test.",
  },
  {
    title: "Generate with AI",
    description: "Our AI creates a comprehensive test based on your specifications in seconds.",
  },
  {
    title: "Review and Edit",
    description: "Fine-tune the generated test, add or remove questions, and customize formatting.",
  },
  {
    title: "Export and Share",
    description: "Download your test in multiple formats or share directly with participants.",
  },
]
