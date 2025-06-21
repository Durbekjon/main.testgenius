"use client"

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Upload,
  Save,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { t } = useLanguage()

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("profile.title")}</h2>
        <p className="text-muted-foreground">{t("profile.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("profile.personalInformations")}</CardTitle>
            <CardDescription>{t("profile.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={user?.logo} alt={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User Avatar' : 'User Avatar'} />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : ''}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    {t("profile.changePhoto")}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first-name">{t("profile.name")}</Label>
                <Input id="first-name" defaultValue={user?.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">{t("profile.lastName")}</Label>
                <Input id="last-name" defaultValue={user?.lastName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("profile.email")}</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              {/*
              <div className="space-y-2">
                <Label htmlFor="phone">{t("profile.phone")}</Label>
                <Input id="phone" type="tel" defaultValue={user?.phone} />
              </div>
              */}
              <div className="space-y-2">
                <Label htmlFor="location">{t("profile.location")}</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input id="location" defaultValue="New York, NY" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">{t("profile.occupation")}</Label>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {/* <Input id="occupation" defaultValue={user?.occupation} /> */}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t("profile.bio")}</Label>
              <textarea
                id="bio"
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us about yourself"
                defaultValue="I'm a high school teacher specializing in mathematics and computer science. I've been using TestGenius AI to create engaging assessments for my students."
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("profile.socialProfiles")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">{t("profile.website")}</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input id="website" placeholder="https://yourwebsite.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">{t("profile.github")}</Label>
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <Input id="github" placeholder="github.com/username" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">{t("profile.twitter")}</Label>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                    <Input id="twitter" placeholder="twitter.com/username" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">{t("profile.linkedin")}</Label>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <Input id="linkedin" placeholder="linkedin.com/in/username" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">{t("common.cancel")}</Button>
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t("common.save_changes")}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.overview")}</CardTitle>
              <CardDescription>{t("profile.overviewDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={user?.logo} alt={user?.firstName} />
                  <AvatarFallback className="text-xl">
                    {user?.firstName?.[0] || ''}
                    {user?.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">Teacher at Acme High School</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">New York, NY</span>
                </div>
                <div className="flex gap-1 mt-3">
                  <Badge variant="secondary">Mathematics</Badge>
                  <Badge variant="secondary">Computer Science</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined at {user?.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">142 Tests Created</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("profile.activityStats")}</CardTitle>
              <CardDescription>{t("profile.activityStatsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("profile.testsCreated")}</span>
                  <span className="font-medium">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("profile.activeStudents")}</span>
                  <span className="font-medium">2,853</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("profile.completionRate")}</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("profile.averageScore")}</span>
                  <span className="font-medium">78%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile.recentActivity")}</CardTitle>
          <CardDescription>{t("profile.recentActivityDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tests" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tests">{t("profile.tests")}</TabsTrigger>
              <TabsTrigger value="students">{t("profile.students")}</TabsTrigger>
              <TabsTrigger value="results">{t("profile.results")}</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                  <div className="col-span-5">{t("profile.testsName")}</div>
                  <div className="col-span-2">{t("profile.testsSubject")}</div>
                  <div className="col-span-2">{t("profile.testsQuestions")}</div>
                  <div className="col-span-3">{t("profile.testsCreated")}</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      name: "Algebra Fundamentals",
                      subject: "Mathematics",
                      questions: 15,
                      date: "Mar 15, 2023",
                    },
                    {
                      name: "Cell Biology Basics",
                      subject: "Science",
                      questions: 20,
                      date: "Apr 10, 2023",
                    },
                    {
                      name: "Grammar and Punctuation",
                      subject: "English",
                      questions: 25,
                      date: "May 5, 2023",
                    },
                    {
                      name: "World War II Overview",
                      subject: "History",
                      questions: 18,
                      date: "Jun 20, 2023",
                    },
                    {
                      name: "JavaScript Fundamentals",
                      subject: "Programming",
                      questions: 30,
                      date: "Jul 15, 2023",
                    },
                  ].map((test, index) => (
                    <div key={index} className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/30">
                      <div className="col-span-5 font-medium">{test.name}</div>
                      <div className="col-span-2">{test.subject}</div>
                      <div className="col-span-2">{test.questions}</div>
                      <div className="col-span-3 text-muted-foreground">{test.date}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="sm">
                  View All Tests
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                  <div className="col-span-4">{t("profile.studentsName")}</div>
                  <div className="col-span-4">{t("profile.studentsEmail")}</div>
                  <div className="col-span-2">{t("profile.studentsTests")}</div>
                  <div className="col-span-2">{t("profile.studentsScore")}</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      name: "Alice Johnson",
                      email: "alice.j@example.com",
                      tests: 12,
                      score: "85%",
                    },
                    {
                      name: "Bob Smith",
                      email: "bob.s@example.com",
                      tests: 8,
                      score: "72%",
                    },
                    {
                      name: "Carol Williams",
                      email: "carol.w@example.com",
                      tests: 15,
                      score: "91%",
                    },
                    {
                      name: "David Brown",
                      email: "david.b@example.com",
                      tests: 10,
                      score: "68%",
                    },
                    {
                      name: "Eve Davis",
                      email: "eve.d@example.com",
                      tests: 7,
                      score: "79%",
                    },
                  ].map((student, index) => (
                    <div key={index} className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/30">
                      <div className="col-span-4 font-medium">{student.name}</div>
                      <div className="col-span-4 text-muted-foreground">{student.email}</div>
                      <div className="col-span-2">{student.tests}</div>
                      <div className="col-span-2">{student.score}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="sm">
                  {t("profile.viewAllStudents")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                  <div className="col-span-3">{t("profile.resultsTestName")}</div>
                  <div className="col-span-3">{t("profile.resultsStudent")}</div>
                  <div className="col-span-2">{t("profile.resultsScore")}</div>
                  <div className="col-span-2">{t("profile.resultsTimeSpent")}</div>
                  <div className="col-span-2">{t("profile.resultsDate")}</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      test: "Algebra Fundamentals",
                      student: "Alice Johnson",
                      score: "92%",
                      time: "45m",
                      date: "Mar 18, 2023",
                    },
                    {
                      test: "Cell Biology Basics",
                      student: "Bob Smith",
                      score: "78%",
                      time: "38m",
                      date: "Apr 12, 2023",
                    },
                    {
                      test: "Grammar and Punctuation",
                      student: "Carol Williams",
                      score: "85%",
                      time: "52m",
                      date: "May 8, 2023",
                    },
                    {
                      test: "World War II Overview",
                      student: "David Brown",
                      score: "71%",
                      time: "41m",
                      date: "Jun 22, 2023",
                    },
                    {
                      test: "JavaScript Fundamentals",
                      student: "Eve Davis",
                      score: "89%",
                      time: "60m",
                      date: "Jul 18, 2023",
                    },
                  ].map((result, index) => (
                    <div key={index} className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/30">
                      <div className="col-span-3 font-medium">{result.test}</div>
                      <div className="col-span-3">{result.student}</div>
                      <div className="col-span-2">{result.score}</div>
                      <div className="col-span-2">{result.time}</div>
                      <div className="col-span-2 text-muted-foreground">{result.date}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="sm">
                  {t("profile.viewAllResults")}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
