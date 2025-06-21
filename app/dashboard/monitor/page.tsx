"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Eye,
  Play,
  Pause,
  MoreHorizontal,
  UserCheck,
  UserX,
  Download,
  BarChart3,
  PieChart,
  CheckCircle2,
  FileText,
  Users,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RemoveParticipantDialog } from "@/components/remove-participant-dialog";
import { TestTimer } from "@/components/test-timer";
import { TestDurationSlider } from "@/components/test-duration-slider";
import { TestAccessInfo } from "@/components/test-access-info";
import { TestResultsCharts } from "@/components/test-results-charts";
import { DownloadResultsDialog } from "@/components/download-results-dialog";
import { useLanguage } from "@/contexts/language-context";
import { Participant, useMonitorSocket } from "@/hooks/use-monitor-socket";
import { toast } from "@/components/ui/use-toast";
import { SocketDebugPanel } from "@/components/socket-debug-panel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TestMonitorPage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");
  const tempCode = searchParams.get("tempCode");

  const {
    isConnected,
    participants,
    isLoading,
    error: socketError,
    testStarted,
    testEnded,
    startTest,
    pauseTest,
    resumeTest,
    removeParticipant,
  } = useMonitorSocket({ testId, tempCode });

  const [testPaused, setTestPaused] = useState(false);
  const [testDuration, setTestDuration] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(testDuration * 60);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<
    string | number | null
  >(null);
  const [gradingSystem, setGradingSystem] = useState<"percentage" | "points">(
    "percentage"
  );
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const { t } = useLanguage();
  useEffect(() => {
    if (isConnected) {
      setAlertMessage("Connected to test server");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } else if (socketError) {
      setAlertMessage(`Connection error: ${socketError.message}`);
      setShowAlert(true);
    }
  }, [isConnected, socketError]);

  useEffect(() => {
    if (testStarted) {
      console.log("testStarted", testStarted);
    }
  }, [testStarted]);

  // Show test ID alert when loaded
  useEffect(() => {
    if (testId && isConnected) {
      setAlertMessage(`Test loaded: ${testId}`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  }, [testId, isConnected]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (testStarted && !testPaused && timeRemaining > 0) {
      console.log("testStarted", testStarted);
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [testStarted, testPaused, timeRemaining]);

  useEffect(() => {
    const participantCount = participants.length;
    if (participantCount > 0 && isConnected) {
      setAlertMessage(`${participantCount} participants in the test room`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }, [participants.length, isConnected]);

  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(filterText.toLowerCase()))
  );

  const calculateIndividualProgress = (
    participant: (typeof participants)[0]
  ) => {
    return participant.progress;
  };

  const calculateAverageProgress = () => {
    if (participants.length === 0) return 0;

    const activeParticipants = participants.filter(
      (p) => p.status === "active"
    );
    if (activeParticipants.length === 0) return 0;

    const totalProgress = activeParticipants.reduce(
      (sum, p) => sum + p.progress,
      0
    );
    return Math.round(totalProgress / activeParticipants.length);
  };

  const averageProgress = calculateAverageProgress();

  // Sort participants: those with names first, then others
  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    const aHasName = Boolean(a.firstName && a.lastName);
    const bHasName = Boolean(b.firstName && b.lastName);

    if (aHasName && !bHasName) return -1;
    if (!aHasName && bHasName) return 1;
    return 0;
  });

  const handleStartTest = () => {
    setStartLoading(true);
    console.log("testDuration", testDuration);
    startTest(testDuration);

    setTimeout(() => {
      setStartLoading(false);
      setTimeRemaining(testDuration * 60);
    }, 3000);
  };

  const handlePauseResumeTest = () => {
    if (testPaused) {
      resumeTest();
    } else {
      pauseTest();
    }
    setTestPaused(!testPaused);
  };

  const handleRemoveParticipant = (id: string | number) => {
    setSelectedParticipant(id);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveParticipant = () => {
    if (selectedParticipant) {
      removeParticipant(selectedParticipant);
      toast({
        title: "Participant removed",
        description: "The participant has been removed from the test.",
      });
    }
    setRemoveDialogOpen(false);
    setSelectedParticipant(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:bg-green-500/10"
          >
            <UserCheck className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "joining":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/10"
          >
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Joining
          </Badge>
        );
      case "idle":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10"
          >
            <AlertTriangle className="mr-1 h-3 w-3" />
            Idle
          </Badge>
        );
      case "left":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 hover:bg-red-500/10"
          >
            <UserX className="mr-1 h-3 w-3" />
            Left
          </Badge>
        );
      case "suspicious":
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/10"
          >
            <AlertTriangle className="mr-1 h-3 w-3" />
            Suspicious
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getParticipantEmail = (participant: Participant) => {
    if (
      participant.email &&
      participant.email !== "" &&
      participant.status === "active"
    ) {
      return participant.email;
    } else if (participant.status === "joining") {
      return <Skeleton className="h-4 w-32" />;
    } else if (participant.status === "active" && participant.email === "") {
      return "-";
    }
  };

  const getParticipantProgress = (participant: Participant) => {
    if (participant.status === "active") {
      return (
        <div className="flex items-center gap-2">
          <Progress
            value={calculateIndividualProgress(participant)}
            className="h-2"
          />
          <span className="text-xs">
            {calculateIndividualProgress(participant)}%
          </span>
        </div>
      );
    } else if (participant.status === "joining") {
      return <Skeleton className="h-4 w-32" />;
    }
  };

  // Test access information for QR codes and join links
  const testAccessInfo = tempCode
    ? {
        code: tempCode,
        link: `https://app.testgenius.uz/test?joinCode=${tempCode}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://testgenius.uz/test?joinCode=${tempCode}`,
      }
    : null;

  const hasActiveParticipants =
    participants.filter((p) => p.status === "active").length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("monitor.title")}
          </h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {!testStarted ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      onClick={handleStartTest}
                      disabled={
                        startLoading ||
                        participants.length === 0 ||
                        !hasActiveParticipants
                      }
                      className="relative overflow-hidden group w-full sm:w-auto"
                    >
                      {startLoading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t("monitor.starting")}
                        </div>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          {t("monitor.start")}
                          <span className="absolute inset-0 flex h-full w-full items-center justify-center bg-primary opacity-0 transition-opacity group-hover:opacity-10">
                            <Play className="h-12 w-12" />
                          </span>
                        </>
                      )}
                    </Button>
                  </span>
                </TooltipTrigger>
                {(participants.length === 0 || !hasActiveParticipants) && (
                  <TooltipContent>
                    <p>No active participants to start the test</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant={testPaused ? "default" : "outline"}
              onClick={handlePauseResumeTest}
            >
              {testPaused ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {t("monitor.resume")}
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  {t("monitor.pause")}
                </>
              )}
            </Button>
          )}
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            {t("monitor.preview")}
          </Button>
        </div>
      </div>

      {testStarted && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border rounded-lg shadow-sm py-3 px-4 mb-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">Time Remaining:</span>
              <TestTimer
                seconds={timeRemaining}
                className="text-lg font-bold text-primary"
              />
            </div>
            <Badge variant={testPaused ? "outline" : "default"}>
              {testPaused ? "Paused" : "In Progress"}
            </Badge>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div
          className={`flex items-center gap-2 ${
            isConnected ? "text-green-500" : "text-red-500"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span>
            {isConnected ? "Connected to server" : "Not connected to server"}
          </span>
        </div>
      </div>

      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-900/20"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-400">
                {t("monitor.attention")}
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {alertMessage}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
              onClick={() => setShowAlert(false)}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("monitor.time_remaining")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {testStarted ? (
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                  <TestTimer seconds={timeRemaining} />
                </div>
              ) : (
                <TestDurationSlider
                  value={testDuration}
                  onChange={setTestDuration}
                  disabled={testStarted}
                />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("monitor.participants")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ) : participants.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{participants.length}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">
                      {participants.filter((p) => p.status === "active").length}{" "}
                      Active
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-xs text-muted-foreground">
                      {
                        participants.filter((p) => p.status === "joining")
                          .length
                      }{" "}
                      Joining
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-xs text-muted-foreground">
                      {participants.filter((p) => p.status === "idle").length}{" "}
                      Idle
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-xs text-muted-foreground">
                      {participants.filter((p) => p.status === "left").length}{" "}
                      Left
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Users className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm font-medium">
                  {t("monitor.waiting_participants")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("monitor.participants_appear")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        {testStarted ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t("monitor.average_progress")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length > 0 ? (
                <>
                  <div className="text-2xl font-bold">{averageProgress}%</div>
                  <Progress value={averageProgress} className="mt-2" />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("common.no_data")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Test Not Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Play className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Progress will be shown once the test starts
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AnimatePresence>
        {!testStarted && testAccessInfo && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TestAccessInfo
              testCode={String(testAccessInfo.code)}
              testLink={testAccessInfo.link}
              qrCodeUrl={testAccessInfo.qrCode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs
        defaultValue={testEnded ? "results" : "participants"}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="participants"
              className="flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              {t("monitor.participants_tab")}
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!testEnded}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {t("monitor.results_tab")}
            </TabsTrigger>
          </TabsList>

          {testEnded && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="grading-system" className="text-sm">
                  Grading System:
                </Label>
                <Select
                  value={gradingSystem}
                  onValueChange={(value) =>
                    setGradingSystem(value as "percentage" | "points")
                  }
                >
                  <SelectTrigger id="grading-system" className="w-32">
                    <SelectValue placeholder="Grading System" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="points">10-Point Scale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => setDownloadDialogOpen(true)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {t("monitor.export_results")}
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{t("monitor.participants_list")}</CardTitle>
                <Input
                  placeholder={t("common.search")}
                  className="max-w-xs"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 items-center gap-4"
                    >
                      <Skeleton className="col-span-3 h-6" />
                      <Skeleton className="col-span-3 h-6" />
                      <Skeleton className="col-span-2 h-6 w-20" />
                      <Skeleton className="col-span-2 h-4" />
                      <div className="col-span-2 flex justify-end">
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : participants.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Progress</div>
                    <div className="col-span-2 text-right">
                      {t("monitor.participant_actions")}
                    </div>
                  </div>
                  <div className="divide-y">
                    {sortedParticipants.map((participant, i) => {
                      const hasName = Boolean(
                        participant.firstName && participant.lastName
                      );
                      const hasEmail = Boolean(participant.email);

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`grid grid-cols-12 items-center px-4 py-3 text-sm ${
                            hasName ? "bg-muted/10" : ""
                          }`}
                        >
                          <div className="col-span-3 font-medium">
                            {hasName ? (
                              `${participant.firstName} ${participant.lastName}`
                            ) : (
                              <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-32" />
                              </div>
                            )}
                          </div>
                          <div className="col-span-3 text-muted-foreground">
                            {getParticipantEmail(participant)}
                          </div>
                          <div className="col-span-2">
                            {getStatusBadge(participant.status)}
                          </div>
                          <div className="col-span-2">
                            {getParticipantProgress(participant)}
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  {t("monitor.view_details")}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {t("monitor.send_message")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() =>
                                    handleRemoveParticipant(participant.id)
                                  }
                                >
                                  {t("monitor.remove_participant")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-md border py-16 text-center">
                  <UserCheck className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">
                    {t("monitor.waiting_participants")}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("monitor.participants_appear")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {participants.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t("monitor.avg_score")}
                      </CardTitle>
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {gradingSystem === "percentage" ? "78%" : "7.8"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +5% from previous test
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t("monitor.completion_rate")}
                      </CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">
                        +12% from previous test
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t("monitor.avg_time")}
                      </CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">42m</div>
                      <p className="text-xs text-muted-foreground">
                        -8m from previous test
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              <TestResultsCharts gradingSystem={gradingSystem} />

              <Card>
                <CardHeader>
                  <CardTitle>{t("monitor.detailed_results")}</CardTitle>
                  <CardDescription>
                    {t("monitor.detailed_results_desc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                      <div className="col-span-2">Name</div>
                      <div className="col-span-2 text-center">Score</div>
                      <div className="col-span-2 text-center">Correct</div>
                      <div className="col-span-2 text-center">Time Spent</div>
                      <div className="col-span-2 text-center">Status</div>
                      <div className="col-span-2 text-center">Actions</div>
                    </div>
                    <div className="divide-y">
                      {participants.map((participant, index) => {
                        const correctAnswers = Math.floor(
                          participant.progress / 10
                        );
                        const totalQuestions = 10;
                        const score = (correctAnswers / totalQuestions) * 100;
                        const timeSpent = 20 + Math.floor(Math.random() * 40);
                        const cheatingAttempts =
                          Math.random() > 0.8
                            ? Math.floor(Math.random() * 3) + 1
                            : 0;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/30"
                          >
                            <div className="col-span-2 font-medium">
                              {participant.name}
                            </div>
                            <div className="col-span-2 text-center font-medium">
                              {gradingSystem === "percentage"
                                ? `${score.toFixed(0)}%`
                                : (score / 10).toFixed(1)}
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="font-mono text-green-500">
                                {correctAnswers}
                              </span>
                              <span className="text-muted-foreground">/</span>
                              <span className="font-mono">
                                {totalQuestions}
                              </span>
                            </div>
                            <div className="col-span-2 text-center font-mono">
                              {timeSpent}m
                            </div>
                            <div className="col-span-2 text-center">
                              {cheatingAttempts > 0 ? (
                                <Badge
                                  variant="outline"
                                  className="bg-red-500/10 text-red-500"
                                >
                                  {cheatingAttempts} Suspicious
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-green-500/10 text-green-500"
                                >
                                  Clean
                                </Badge>
                              )}
                            </div>
                            <div className="col-span-2 flex justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                              >
                                <Download className="mr-1 h-3 w-3" />
                                Export
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button variant="outline" className="gap-2">
                    <PieChart className="h-4 w-4" />
                    {t("monitor.generate_report")}
                  </Button>
                  <Button
                    onClick={() => setDownloadDialogOpen(true)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {t("monitor.export_results")}
                  </Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border py-24 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">
                {t("monitor.no_results")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("monitor.results_available")}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <RemoveParticipantDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        onConfirm={confirmRemoveParticipant}
        participantName={
          participants.find((p) => p.id === selectedParticipant)?.name || ""
        }
      />

      <DownloadResultsDialog
        open={downloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
      />

      {/* Socket Debug Panel */}
      <SocketDebugPanel />
    </div>
  );
}
