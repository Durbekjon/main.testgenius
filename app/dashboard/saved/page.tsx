"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar,
  Download,
  List,
  MoreHorizontal,
  Search,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";
import { useTests } from "@/lib/hooks/use-tests";
import type { Test } from "@/lib/services/test-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { FixedSizeGrid as WindowGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import type { CSSProperties, ReactNode } from "react";
import { TestPreview } from "@/components/test-preview";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Move handler functions outside the component
function getFetchParams(
  searchQuery: string,
  order: string,
  pageNum: number = 1
) {
  return {
    page: pageNum,
    search: searchQuery,
    order,
  };
}

function useDebouncedUpdate(updateTest: any) {
  const timeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const debouncedUpdate = useCallback(
    (testId: string, updates: Partial<Test>) => {
      if (timeouts.current[testId]) clearTimeout(timeouts.current[testId]);
      timeouts.current[testId] = setTimeout(() => {
        updateTest(testId, updates);
        delete timeouts.current[testId];
      }, 1000);
    },
    [updateTest]
  );
  return debouncedUpdate;
}

export default function SavedTestsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [testToDelete, setTestToDelete] = useState<Test | null>(null);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { t } = useLanguage();
  const {
    tests,
    loading,
    page,
    totalPages,
    downloading,
    fetchTests,
    updateTest,
    deleteTest,
    downloadTest,
  } = useTests();
  const [previewTest, setPreviewTest] = useState<Test | null>(null);
  const previewDialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (previewTest && previewDialogRef.current) {
      previewDialogRef.current.scrollTop = 0;
    }
  }, [previewTest]);

  // Memoize the fetch parameters to prevent unnecessary re-renders
  const fetchParams = useCallback(
    (pageNum: number = 1) => ({
      page: pageNum,
      search: searchQuery,
      order,
    }),
    [searchQuery, order]
  );

  // Initial load and order change
  useEffect(() => {
    fetchTests(fetchParams());
  }, [fetchTests, fetchParams]);

  // Search debounce
  useEffect(() => {
    if (searchQuery === "") return; // Skip if search is empty

    const debounceTimer = setTimeout(() => {
      fetchTests(fetchParams(1)); // Reset to page 1 on search
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, fetchTests, fetchParams]);

  const debouncedUpdate = useDebouncedUpdate(updateTest);

  // Handler functions
  const handleTogglePublic = useCallback(
    async (test: Test) => {
      await updateTest(test.id, { isPublic: !test.isPublic });
    },
    [updateTest]
  );

  const handleDeleteClick = useCallback((test: Test) => {
    setTestToDelete(test);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (testToDelete) {
      await deleteTest(testToDelete.id);
      setTestToDelete(null);
    }
  }, [testToDelete, deleteTest]);

  const handleOrderToggle = useCallback(() => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const handleFieldChange = useCallback(
    (test: Test, field: keyof Test, value: string) => {
      const updatedTest = { ...test, [field]: value };
      setEditingTest(updatedTest);
      debouncedUpdate(test.id, { [field]: value });
    },
    [debouncedUpdate]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchTests(fetchParams(newPage));
    },
    [fetchTests, fetchParams]
  );

  // Virtualized grid cell renderer with proper types
  interface CellProps {
    columnIndex: number;
    rowIndex: number;
    style: CSSProperties;
    data: {
      tests: Test[];
      handleFieldChange: typeof handleFieldChange;
      editingTest: Test | null;
      handleTogglePublic: typeof handleTogglePublic;
      handleDeleteClick: typeof handleDeleteClick;
      downloading: string | null;
      downloadTest: (id: string, format: "pdf" | "docx") => Promise<void>;
    };
  }

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
    data,
  }: CellProps): ReactNode => {
    const {
      tests,
      handleFieldChange,
      editingTest,
      handleTogglePublic,
      handleDeleteClick,
      downloading,
      downloadTest,
    } = data;
    const index = rowIndex * 3 + columnIndex;
    if (index >= tests.length) return null;
    const test = tests[index];
    return (
      <div style={style}>
        <Card key={test.id} className="transition-all hover:shadow-md m-2">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <Input
                value={
                  editingTest?.id === test.id ? editingTest.title : test.title
                }
                onChange={(e) =>
                  handleFieldChange(test, "title", e.target.value)
                }
                className="line-clamp-1 text-lg font-semibold border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Untitled Test"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleTogglePublic(test)}>
                    {test.isPublic ? "Make it private" : "Make it public"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPreviewTest(test)}>
                    Open in Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDeleteClick(test)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-0.5">
                <Input
                  value={
                    editingTest?.id === test.id
                      ? editingTest.subject
                      : test.subject
                  }
                  onChange={(e) =>
                    handleFieldChange(test, "subject", e.target.value)
                  }
                  className="h-5 w-20 border-none bg-transparent p-0 text-xs shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Subject"
                />
              </Badge>
              <Badge variant="outline" className="px-2 py-0.5">
                <Input
                  value={
                    editingTest?.id === test.id
                      ? editingTest.gradeLevel
                      : test.gradeLevel
                  }
                  onChange={(e) =>
                    handleFieldChange(test, "gradeLevel", e.target.value)
                  }
                  className="h-5 w-20 border-none bg-transparent p-0 text-xs shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Grade"
                />
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{test.sectionCount} sections</span>
            </div>
            <Textarea
              value={
                editingTest?.id === test.id
                  ? editingTest.description
                  : test.description
              }
              onChange={(e) =>
                handleFieldChange(test, "description", e.target.value)
              }
              className="mt-2 min-h-[60px] resize-none border-none bg-transparent p-0 text-sm text-muted-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 line-clamp-2"
              placeholder="Add a description..."
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {test.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                Modified {format(new Date(test.updatedAt), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={downloading === test.id}
                  >
                    <Download className="h-3 w-3" />
                    <span className="sr-only">Download</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => downloadTest(test.id, "pdf")}
                  >
                    Download as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => downloadTest(test.id, "docx")}
                  >
                    Download as DOCX
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleDeleteClick(test)}
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <AlertDialog
        open={!!testToDelete}
        onOpenChange={() => setTestToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("saved.delete_test_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("saved.delete_test_confirm_description")}
              {testToDelete?.title ? ` "${testToDelete.title}"` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("saved.delete_test_confirm_cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("saved.delete_test_confirm_button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!previewTest} onOpenChange={() => setPreviewTest(null)}>
        <DialogContent
          ref={previewDialogRef}
          className="max-w-4xl w-full flex justify-center items-center p-0 pt-6"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          <DialogTitle className="sr-only">Test Preview</DialogTitle>
          {previewTest && <TestPreview testData={previewTest as any} />}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("saved.title")}
          </h2>
          <p className="text-muted-foreground">{t("saved.subtitle")}</p>
        </div>
        <Button
          className="w-full md:w-auto"
          onClick={() => (window.location.href = "/dashboard/create")}
        >
          {t("dashboard.create")}
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleOrderToggle}
            title={order === "asc" ? "Sort ascending" : "Sort descending"}
          >
            {order === "asc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle sort order</span>
          </Button>
          <div className="flex items-center rounded-md border bg-background p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          {/* Skeleton loader */}
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : tests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-semibold">No tests found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "No tests match your search criteria. Try adjusting your search."
              : "You haven't created any tests yet."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div style={{ width: "100%", height: 600 }}>
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => (
              <WindowGrid
                columnCount={3}
                columnWidth={width / 3}
                height={height}
                rowCount={Math.ceil(tests.length / 3)}
                rowHeight={320}
                width={width}
                itemData={{
                  tests,
                  handleFieldChange,
                  editingTest,
                  handleTogglePublic,
                  handleDeleteClick,
                  downloading,
                  downloadTest,
                }}
              >
                {Cell}
              </WindowGrid>
            )}
          </AutoSizer>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-muted/50 px-6 py-3 text-sm font-medium">
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Subject</div>
            <div className="col-span-2">Grade Level</div>
            <div className="col-span-2">Sections</div>
            <div className="col-span-2">Modified</div>
          </div>
          {tests.map((test) => (
            <div
              key={test.id}
              className="grid grid-cols-12 items-center border-b px-6 py-3 text-sm hover:bg-muted/50"
            >
              <div className="col-span-4">
                <Input
                  value={
                    editingTest?.id === test.id ? editingTest.title : test.title
                  }
                  onChange={(e) =>
                    handleFieldChange(test, "title", e.target.value)
                  }
                  className="h-8 border-none bg-transparent p-0 font-medium shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Untitled Test"
                />
              </div>
              <div className="col-span-2">
                <Input
                  value={
                    editingTest?.id === test.id
                      ? editingTest.subject
                      : test.subject
                  }
                  onChange={(e) =>
                    handleFieldChange(test, "subject", e.target.value)
                  }
                  className="h-8 border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Subject"
                />
              </div>
              <div className="col-span-2">
                <Input
                  value={
                    editingTest?.id === test.id
                      ? editingTest.gradeLevel
                      : test.gradeLevel
                  }
                  onChange={(e) =>
                    handleFieldChange(test, "gradeLevel", e.target.value)
                  }
                  className="h-8 border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Grade"
                />
              </div>
              <div className="col-span-2">{test.sectionCount}</div>
              <div className="col-span-2">
                {format(new Date(test.updatedAt), "MMM d, yyyy")}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
