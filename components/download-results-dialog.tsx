"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileSpreadsheet, FileText } from "lucide-react"

type DownloadResultsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DownloadResultsDialog({ open, onOpenChange }: DownloadResultsDialogProps) {
  const [fileFormat, setFileFormat] = useState<"excel" | "pdf">("excel")
  const [includeDetails, setIncludeDetails] = useState({
    participantInfo: true,
    scoreBreakdown: true,
    questionDetails: false,
    timeSpent: true,
    cheatingAttempts: true,
  })

  const handleDownload = () => {
    // In a real app, this would trigger the actual download
    console.log("Downloading results:", { fileFormat, includeDetails })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Download Test Results</DialogTitle>
          <DialogDescription>
            Choose your preferred format and customize the information to include in the exported file.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <Label className="text-sm font-medium">File Format</Label>
            <RadioGroup
              value={fileFormat}
              onValueChange={(value) => setFileFormat(value as "excel" | "pdf")}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="excel"
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                  fileFormat === "excel" ? "border-primary bg-primary/5" : ""
                }`}
              >
                <RadioGroupItem value="excel" id="excel" className="sr-only" />
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
                <div className="text-sm font-medium">Excel (.xlsx)</div>
              </Label>
              <Label
                htmlFor="pdf"
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                  fileFormat === "pdf" ? "border-primary bg-primary/5" : ""
                }`}
              >
                <RadioGroupItem value="pdf" id="pdf" className="sr-only" />
                <FileText className="h-6 w-6 text-red-600" />
                <div className="text-sm font-medium">PDF (.pdf)</div>
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Include in Report</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="participant-info"
                  checked={includeDetails.participantInfo}
                  onCheckedChange={(checked) => setIncludeDetails((prev) => ({ ...prev, participantInfo: !!checked }))}
                />
                <Label htmlFor="participant-info" className="text-sm">
                  Participant Information (Name, Email)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="score-breakdown"
                  checked={includeDetails.scoreBreakdown}
                  onCheckedChange={(checked) => setIncludeDetails((prev) => ({ ...prev, scoreBreakdown: !!checked }))}
                />
                <Label htmlFor="score-breakdown" className="text-sm">
                  Score Breakdown (Total, Percentage)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="question-details"
                  checked={includeDetails.questionDetails}
                  onCheckedChange={(checked) => setIncludeDetails((prev) => ({ ...prev, questionDetails: !!checked }))}
                />
                <Label htmlFor="question-details" className="text-sm">
                  Question-by-Question Details
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="time-spent"
                  checked={includeDetails.timeSpent}
                  onCheckedChange={(checked) => setIncludeDetails((prev) => ({ ...prev, timeSpent: !!checked }))}
                />
                <Label htmlFor="time-spent" className="text-sm">
                  Time Spent on Test
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cheating-attempts"
                  checked={includeDetails.cheatingAttempts}
                  onCheckedChange={(checked) => setIncludeDetails((prev) => ({ ...prev, cheatingAttempts: !!checked }))}
                />
                <Label htmlFor="cheating-attempts" className="text-sm">
                  Cheating Attempt Flags
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Report Preview</Label>
            <div className="rounded-md border p-4">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-bold">Test Results Report</h3>
                <p className="text-sm text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-4">
                {includeDetails.participantInfo && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Participant Information</h4>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-2 border-b bg-muted/50 px-3 py-1 text-xs font-medium">
                        <div>Name</div>
                        <div>Email</div>
                      </div>
                      <div className="px-3 py-1 text-xs">
                        <div className="grid grid-cols-2">
                          <div>John Smith</div>
                          <div>john.smith@example.com</div>
                        </div>
                      </div>
                      <div className="border-t px-3 py-1 text-xs">
                        <div className="grid grid-cols-2">
                          <div>Emily Johnson</div>
                          <div>emily.j@example.com</div>
                        </div>
                      </div>
                      <div className="border-t px-3 py-1 text-xs">
                        <div className="grid grid-cols-2">
                          <div>Michael Brown</div>
                          <div>michael.b@example.com</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {includeDetails.scoreBreakdown && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Score Breakdown</h4>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 border-b bg-muted/50 px-3 py-1 text-xs font-medium">
                        <div>Name</div>
                        <div>Score</div>
                        <div>Correct</div>
                        <div>Incorrect</div>
                      </div>
                      <div className="px-3 py-1 text-xs">
                        <div className="grid grid-cols-4">
                          <div>John Smith</div>
                          <div>85%</div>
                          <div>17/20</div>
                          <div>3/20</div>
                        </div>
                      </div>
                      <div className="border-t px-3 py-1 text-xs">
                        <div className="grid grid-cols-4">
                          <div>Emily Johnson</div>
                          <div>92%</div>
                          <div>18/20</div>
                          <div>2/20</div>
                        </div>
                      </div>
                      <div className="border-t px-3 py-1 text-xs">
                        <div className="grid grid-cols-4">
                          <div>Michael Brown</div>
                          <div>67%</div>
                          <div>13/20</div>
                          <div>7/20</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {includeDetails.cheatingAttempts && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Cheating Attempt Flags</h4>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-3 border-b bg-muted/50 px-3 py-1 text-xs font-medium">
                        <div>Name</div>
                        <div>Suspicious Activities</div>
                        <div>Timestamp</div>
                      </div>
                      <div className="px-3 py-1 text-xs">
                        <div className="grid grid-cols-3">
                          <div>Michael Brown</div>
                          <div>Tab switching (2 times)</div>
                          <div>10:15 AM, 10:32 AM</div>
                        </div>
                      </div>
                      <div className="border-t px-3 py-1 text-xs">
                        <div className="grid grid-cols-3">
                          <div>Sarah Davis</div>
                          <div>Copy attempt</div>
                          <div>10:45 AM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
