'use client';
import { useState, useEffect } from 'react';
import {
  Pencil,
  Plus,
  Trash,
  Save,
  Download,
  FileText,
  FileSpreadsheet,
  Play,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { ONLINE_TEST_EVENTS, initOnlineTestSocket } from '@/lib/socket';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { set } from 'date-fns';
import { api } from '@/lib/api';

interface ServerAnswer {
  answer: string;
}

interface ServerOption {
  id: string;
  text: string;
}

interface ServerQuestion {
  question_id: string;
  questionText: string;
  options: any[];
  answers: string[];
  explanation: string;
  score: number;
  matchingItems?: { id: string; text: string }[];
  matchingHeadings?: { id: string; text: string }[];
  matchingPairs?: { itemId: string; headingId: string }[];
}

interface ServerTask {
  task_id: string;
  title: string;
  type: string;
  questions: ServerQuestion[];
}

interface ServerSection {
  section_id: string;
  title: string;
  instruction: string;
  type: string;
  tasks: ServerTask[];
}

interface ServerTestData {
  id: string;
  test_id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  description: string;
  tags: string[];
  sections: ServerSection[];
}

interface MatchingPair {
  itemId: string;
  headingId: string;
}

interface TestQuestion {
  id: string;
  text: string;
  type: string;
  options: { id: string; text: string }[];
  correctAnswer: string[] | string;
  correctAnswerId?: string;
  score: number;
  explanation: string;
  matchingItems?: { id: string; text: string }[];
  matchingHeadings?: { id: string; text: string }[];
  matchingPairs?: MatchingPair[];
}

interface TestSection {
  id: string;
  title: string;
  instruction: string;
  questions: TestQuestion[];
}

interface TestData {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  tags: string[];
  sections: TestSection[];
}

interface TestPreviewProps {
  testData?: ServerTestData | null;
}

// Component to render a multiple choice question
const MultipleChoiceQuestion = ({ question }: { question: TestQuestion }) => {
  const correctAnswerId = question.correctAnswer[0].toLocaleLowerCase();

  return (
    <RadioGroup defaultValue={correctAnswerId} className='space-y-2'>
      {question.options.map((option) => {
        const isCorrect = correctAnswerId === option.id.toLocaleLowerCase();

        return (
          <div
            key={`${question.id}-${option.id}`}
            className='flex items-center space-x-2'
          >
            <RadioGroupItem
              value={option.id}
              id={`q${question.id}-${option.id}`}
              checked={isCorrect}
              disabled
            />
            <Label
              htmlFor={`q${question.id}-${option.id}`}
              className={isCorrect ? 'font-medium text-primary' : ''}
            >
              {option.text}
              {isCorrect && ' ✓'}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

// Component to render a fill in the blank question
const FillInTheBlankQuestion = ({ question }: { question: TestQuestion }) => {
  const correctAnswer = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.join(', ')
    : question.correctAnswer;

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <Input
          value={correctAnswer}
          disabled
          className='bg-muted/30 border-primary text-primary font-medium'
        />
        <span className='text-primary'>
          <Check className='h-5 w-5' />
        </span>
      </div>
      {question.explanation && (
        <p className='text-sm text-muted-foreground'>
          <span className='font-medium'>Explanation: </span>
          {question.explanation}
        </p>
      )}
    </div>
  );
};

// Component to render a true/false question
const TrueFalseQuestion = ({ question }: { question: TestQuestion }) => {
  const correctAnswer = Array.isArray(question.correctAnswer)
    ? question.correctAnswer[0]
    : question.correctAnswer;

  const isTrue =
    correctAnswer.toLowerCase() === 'true' || correctAnswer === 't';

  return (
    <RadioGroup defaultValue={isTrue ? 'true' : 'false'} className='flex gap-4'>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem
          value='true'
          id={`q${question.id}-true`}
          checked={isTrue}
          disabled
        />
        <Label
          htmlFor={`q${question.id}-true`}
          className={isTrue ? 'font-medium text-primary' : ''}
        >
          True
          {isTrue && ' ✓'}
        </Label>
      </div>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem
          value='false'
          id={`q${question.id}-false`}
          checked={!isTrue}
          disabled
        />
        <Label
          htmlFor={`q${question.id}-false`}
          className={!isTrue ? 'font-medium text-primary' : ''}
        >
          False
          {!isTrue && ' ✓'}
        </Label>
      </div>
    </RadioGroup>
  );
};

// Component to render a short answer question
const ShortAnswerQuestion = ({ question }: { question: TestQuestion }) => {
  const correctAnswer = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.join(', ')
    : question.correctAnswer;

  return (
    <div className='space-y-3'>
      <div className='rounded-md border border-primary bg-muted/30 p-3'>
        <p className='font-medium text-primary'>{correctAnswer}</p>
      </div>
      {question.explanation && (
        <p className='text-sm text-muted-foreground'>
          <span className='font-medium'>Explanation: </span>
          {question.explanation}
        </p>
      )}
    </div>
  );
};

// Component to render a matching the headings question
const MatchingHeadingsQuestion = ({ question }: { question: TestQuestion }) => {
  if (
    !question.matchingItems ||
    !question.matchingHeadings ||
    !question.matchingPairs
  ) {
    return (
      <div className='text-destructive'>
        Missing matching data for this question.
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Item</TableHead>
            <TableHead>Heading</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {question.matchingPairs.map((pair, index) => {
            const item = question.matchingItems?.find(
              (i) => i.id === pair.itemId
            );
            const heading = question.matchingHeadings?.find(
              (h) => h.id === pair.headingId
            );

            return (
              <TableRow key={index} className='bg-muted/20'>
                <TableCell className='font-medium'>
                  {item?.text || pair.itemId}
                </TableCell>
                <TableCell className='text-primary font-medium'>
                  {heading?.text || pair.headingId}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {question.explanation && (
        <p className='text-sm text-muted-foreground'>
          <span className='font-medium'>Explanation: </span>
          {question.explanation}
        </p>
      )}
    </div>
  );
};

// Generic component for any other question type
const GenericQuestion = ({ question }: { question: TestQuestion }) => {
  const correctAnswer = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.join(', ')
    : question.correctAnswer;

  return (
    <div className='mt-2 p-3 bg-muted/30 rounded-md border'>
      <p className='text-sm font-medium mb-1'>
        <span className='text-muted-foreground'>Correct answer: </span>
        <span className='font-bold text-primary'>{correctAnswer}</span>
      </p>
      {question.explanation && (
        <p className='text-sm text-muted-foreground mt-2'>
          <span className='font-medium'>Explanation: </span>
          {question.explanation}
        </p>
      )}
    </div>
  );
};

// Component to render the appropriate question type
const QuestionRenderer = ({ question }: { question: TestQuestion }) => {
  const normalizedType = question.type.toLowerCase().replace(/-/g, '_');

  switch (normalizedType) {
    case 'multiple_choice':
      return <MultipleChoiceQuestion question={question} />;
    case 'fill_in_the_blank':
      return <FillInTheBlankQuestion question={question} />;
    case 'true_false':
      return <TrueFalseQuestion question={question} />;
    case 'short_answer':
      return <ShortAnswerQuestion question={question} />;
    case 'matching_the_headings':
      return <MatchingHeadingsQuestion question={question} />;
    default:
      return <GenericQuestion question={question} />;
  }
};

// Mock data for a generated test (used as fallback)
const mockTest: TestData = {
  id: 'test-' + Math.random().toString(36).substring(2, 9),
  title: 'English Language Test',
  description:
    'A comprehensive test covering various English language concepts.',
  subject: 'English',
  gradeLevel: 'Advanced',
  tags: ['english', 'grammar', 'assessment'],
  sections: [],
};

export function TestPreview({ testData }: TestPreviewProps) {
  const [test, setTest] = useState<TestData>({
    ...mockTest,
    id:
      testData?.test_id || 'test-' + Math.random().toString(36).substring(2, 9),
  });
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [title, setTitle] = useState(
    testData?.test_id || 'Algebra Fundamentals'
  );
  const [description, setDescription] = useState(
    'A comprehensive test covering basic algebraic concepts and equations.'
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editQuestionOptions, setEditQuestionOptions] = useState<
    { id: string; text: string }[]
  >([]);
  const [editQuestionCorrectAnswer, setEditQuestionCorrectAnswer] =
    useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [questionType, setQuestionType] = useState<string>('multiple_choice');
  const [isChanged, setIsChanged] = useState(false);
  // Update test data when testData prop changes
  useEffect(() => {
    if (testData) {
      console.log('Buuu test',testData);
      try {
        // Convert server data format to component format with proper null checks
        const convertedTest: TestData = {
          id:
            testData.test_id ||
            `test-${Math.random().toString(36).substring(2, 9)}`,
          title: testData.title || testData.test_id || 'Untitled Test',
          description:
            testData.description ||
            'A comprehensive test covering various concepts.',
          subject: testData.subject || '',
          gradeLevel: testData.gradeLevel || '',
          tags: testData.tags || [],
          sections: Array.isArray(testData.sections)
            ? testData.sections.map((section) => ({
                id:
                  section.section_id ||
                  `section-${Math.random().toString(36).substring(2, 9)}`,
                title: section.title || 'Untitled Section',
                instruction: section.instruction || '',
                questions: Array.isArray(section.tasks)
                  ? section.tasks.flatMap((task) =>
                      Array.isArray(task.questions)
                        ? task.questions.map((q) => ({
                            id:
                              q.question_id ||
                              `q-${Math.random().toString(36).substring(2, 9)}`,
                            text: q.questionText || 'Untitled Question',
                            type: task.type || 'fill_in_the_blank',
                            options:
                              Array.isArray(q.options) && q.options.length > 0
                                ? q.options.map((opt, index) => ({
                                    id:
                                      typeof opt === 'object' && opt.id
                                        ? opt.id
                                        : String.fromCharCode(97 + index), // a, b, c, etc.
                                    text:
                                      typeof opt === 'object' && opt.text
                                        ? opt.text
                                        : String(opt),
                                  }))
                                : [],
                            correctAnswer: q.answers || [],
                            score: q.score || 1,
                            explanation: q.explanation || '',
                            matchingItems: q.matchingItems || [],
                            matchingHeadings: q.matchingHeadings || [],
                            matchingPairs: q.matchingPairs || [],
                          }))
                        : []
                    )
                  : [],
              }))
            : [],
        };

        setTest(convertedTest);
        setTitle(convertedTest.title);
        setDescription(convertedTest.description);
      } catch (error) {
        console.error('Error processing test data:', error);
        // Fallback to mock test if there's an error
        setTest(mockTest);
        setTitle(mockTest.title);
        setDescription(mockTest.description);
      }
    }
  }, [testData]);

  const handleSaveTitle = () => {
    setTest({ ...test, title });
    setEditingTitle(false);
  };

  const handleSaveDescription = () => {
    setTest({ ...test, description });
    setEditingDescription(false);
  };

  const handleDeleteQuestion = (id: string) => {
    setIsChanged(true);
    setTest({
      ...test,
      sections: test.sections
        .map((section) => ({
          ...section,
          questions: section.questions.filter((q) => q.id !== id),
        }))
        .filter((section) => section.questions.length > 0),
    });
  };

  const handleAddQuestion = () => {
    setIsChanged(true);
    // If there are no sections, create one
    if (!test.sections || test.sections.length === 0) {
      const newSection = {
        id: 'section-' + Math.random().toString(36).substring(2, 9),
        title: 'New Section',
        instruction: 'Instructions for this section',
        questions: [],
      };

      setTest({
        ...test,
        sections: [newSection],
      });
    }

    const sectionIndex = 0; // Add to the first section by default

    // Create a new question with the selected type
    const newQuestion: TestQuestion = {
      id: 'q-' + Math.random().toString(36).substring(2, 9),
      text: 'New question',
      type: questionType || 'multiple_choice',
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' },
        { id: 'd', text: 'Option D' },
      ],
      correctAnswer: 'a',
      correctAnswerId: 'a',
      score: 1,
      explanation: '',
    };

    // For different question types, adjust the options and correct answer
    if (questionType === 'true_false') {
      newQuestion.options = [
        { id: 'true', text: 'True' },
        { id: 'false', text: 'False' },
      ];
      newQuestion.correctAnswer = 'true';
      newQuestion.correctAnswerId = 'true';
    } else if (
      questionType === 'short_answer' ||
      questionType === 'fill_in_the_blank'
    ) {
      newQuestion.options = [];
      newQuestion.correctAnswer = 'Sample answer';
    } else if (questionType === 'matching_the_headings') {
      newQuestion.matchingItems = [
        { id: 'item1', text: 'Item 1' },
        { id: 'item2', text: 'Item 2' },
        { id: 'item3', text: 'Item 3' },
      ];
      newQuestion.matchingHeadings = [
        { id: 'heading1', text: 'Heading 1' },
        { id: 'heading2', text: 'Heading 2' },
        { id: 'heading3', text: 'Heading 3' },
      ];
      newQuestion.matchingPairs = [
        { itemId: 'item1', headingId: 'heading1' },
        { itemId: 'item2', headingId: 'heading2' },
        { itemId: 'item3', headingId: 'heading3' },
      ];
    }

    // Make sure the sections array exists
    const updatedSections = [...(test.sections || [])];

    // If the first section doesn't exist, create it
    if (!updatedSections[sectionIndex]) {
      updatedSections[sectionIndex] = {
        id: 'section-' + Math.random().toString(36).substring(2, 9),
        title: 'New Section',
        instruction: 'Instructions for this section',
        questions: [],
      };
    }

    // Add the new question to the section
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      questions: [...updatedSections[sectionIndex].questions, newQuestion],
    };

    // Update the test with the new sections
    setTest({
      ...test,
      sections: updatedSections,
    });

    // Open edit dialog for the new question
    openEditDialog(newQuestion);
  };

  const openEditDialog = (question: TestQuestion) => {
    setEditingQuestion(question.id);
    setEditQuestionText(question.text);
    setQuestionType(question.type);

    // Set options based on question type
    if (
      question.type.toLowerCase().includes('multiple_choice') ||
      question.type.toLowerCase().includes('multiple-choice')
    ) {
      setEditQuestionOptions(
        question.options.length > 0
          ? [...question.options]
          : [
              { id: 'a', text: 'Option A' },
              { id: 'b', text: 'Option B' },
            ]
      );
    } else {
      setEditQuestionOptions([]);
    }

    // Extract the option ID from the full answer if needed
    let correctAnswerId = '';
    if (Array.isArray(question.correctAnswer)) {
      correctAnswerId = question.correctAnswerId || question.correctAnswer[0];
    } else if (question.correctAnswerId) {
      correctAnswerId = question.correctAnswerId;
    } else if (typeof question.correctAnswer === 'string') {
      // Try to extract the ID from the full answer text (e.g., "b. Option B" -> "b")
      const match = question.correctAnswer.match(/^([a-z])\.\s/);
      correctAnswerId = match ? match[1] : question.correctAnswer;
    }

    setEditQuestionCorrectAnswer(correctAnswerId);
    setIsEditDialogOpen(true);
  };

  const handleAddOption = () => {
    setIsChanged(true);
    const newOptions = [...editQuestionOptions];
    const nextId = String.fromCharCode(97 + newOptions.length); // a, b, c, etc.
    newOptions.push({ id: nextId, text: `Option ${nextId.toUpperCase()}` });
    setEditQuestionOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    setIsChanged(true);
    if (editQuestionOptions.length <= 2) {
      toast({
        title: 'Cannot remove option',
        description: 'Multiple choice questions must have at least 2 options.',
        variant: 'destructive',
      });
      return;
    }

    const newOptions = [...editQuestionOptions];
    newOptions.splice(index, 1);

    // If the removed option was the correct answer, reset the correct answer
    if (editQuestionOptions[index].id === editQuestionCorrectAnswer) {
      setEditQuestionCorrectAnswer(newOptions[0].id);
    }

    setEditQuestionOptions(newOptions);
  };

  const handleSaveQuestion = () => {
    setIsChanged(true);
    if (editingQuestion === null) return;

    let correctAnswer: string | string[] = editQuestionCorrectAnswer;

    // For multiple choice, format the answer properly
    if (
      questionType.toLowerCase().includes('multiple_choice') ||
      questionType.toLowerCase().includes('multiple-choice')
    ) {
      // Find the selected option to get its full text
      const selectedOption = editQuestionOptions.find(
        (opt) => opt.id === editQuestionCorrectAnswer
      );
      correctAnswer = selectedOption
        ? `${selectedOption.id}. ${selectedOption.text}`
        : editQuestionCorrectAnswer;
    }

    const updatedSections = test.sections.map((section) => ({
      ...section,
      questions: section.questions.map((q) => {
        if (q.id === editingQuestion) {
          return {
            ...q,
            text: editQuestionText,
            options:
              questionType.toLowerCase().includes('multiple_choice') ||
              questionType.toLowerCase().includes('multiple-choice')
                ? [...editQuestionOptions]
                : q.options,
            correctAnswer: correctAnswer,
            correctAnswerId: editQuestionCorrectAnswer, // Keep track of the ID separately
          };
        }
        return q;
      }),
    }));

    setTest({
      ...test,
      sections: updatedSections,
    });

    setIsEditDialogOpen(false);
    setEditingQuestion(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    setIsChanged(true);
    const newOptions = [...editQuestionOptions];
    newOptions[index] = { ...newOptions[index], text: value };
    setEditQuestionOptions(newOptions);
  };

  const handleStartTest = async () => {
    setIsLoading(true);
    console.log('Starting test');

    try {
      // Use the specific online-test-socket module
      const onlineTestSocket = initOnlineTestSocket();

      if (!onlineTestSocket) {
        toast({
          title: 'Connection Error',
          description: 'Could not connect to test server. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      console.log('Socket connected:', onlineTestSocket.connected);

      // Create the payload for the start:test event
      const payload = {
        test: testData,
      };

      console.log('Sending payload:', payload);

      // Set up event listener before emitting the event
      const handleTestStarted = (data: any) => {
        console.log('Test started response received:', data);

        // Extract test ID and temp code from the response
        const testId = data?.test?.id || data?.id || test.id;
        const tempCode = data?.tempCode?.code || '';

        if (testId) {
          console.log(
            `Navigating to monitor page with testId=${testId} and tempCode=${tempCode}`
          );

          // Use window.location.href for a full page navigation to ensure it works
          window.location.href = `/dashboard/monitor?testId=${testId}&tempCode=${tempCode}`;
        } else {
          toast({
            title: 'Error',
            description: 'Could not start test. Test ID not found in response.',
            variant: 'destructive',
          });
          setIsLoading(false);
        }
      };

      // Add the event listener for both possible event names
      onlineTestSocket.on(ONLINE_TEST_EVENTS.START_TEST, handleTestStarted);
      onlineTestSocket.on(ONLINE_TEST_EVENTS.TEST_STARTED, handleTestStarted);

      // Show toast notification
      toast({
        title: 'Starting test',
        description: 'Preparing test environment...',
      });

      // Emit the event
      onlineTestSocket.emit(ONLINE_TEST_EVENTS.START_TEST, payload);

      // Set a timeout to handle cases where the server doesn't respond
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          onlineTestSocket.off(
            ONLINE_TEST_EVENTS.START_TEST,
            handleTestStarted
          );
          onlineTestSocket.off(
            ONLINE_TEST_EVENTS.TEST_STARTED,
            handleTestStarted
          );

          toast({
            title: 'Timeout',
            description: 'Server did not respond in time. Please try again.',
            variant: 'destructive',
          });
        }
      }, 10000); // 10 seconds timeout
    } catch (error) {
      console.error('Error starting test:', error);
      setIsLoading(false);

      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (format:'pdf'|'docx') => {
    try {
      setIsDownloading(true);

      const response = await api.post(
        `/api/v1/test/download?testId=${testData?.id}&type=${format}`,
        {},
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      const disposition = response.headers['content-disposition'];
      const filenameMatch = disposition?.match(/filename="?(.+)"?/);
      const filename = filenameMatch?.[1] || `test.zip`;

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: 'Download complete',
        description: 'ZIP file has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Error downloading ZIP file:', error);
      toast({
        title: 'Download failed',
        description: 'Failed to download the ZIP file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to get question type label
  const getQuestionTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      multiple_choice: 'Multiple Choice',
      fill_in_the_blank: 'Fill in the Blank',
      true_false: 'True/False',
      short_answer: 'Short Answer',
      matching_the_headings: 'Matching',
    };

    const normalizedType = type.toLowerCase().replace(/-/g, '_');
    return typeMap[normalizedType] || type;
  };

  return (
    <div className='space-y-6'>
      {/* Test Title */}
      <div className='space-y-2'>
        {editingTitle ? (
          <div className='space-y-2'>
            <Label htmlFor='test-title'>Test Title</Label>
            <div className='flex gap-2'>
              <Input
                id='test-title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='flex-1'
              />
              <Button onClick={handleSaveTitle}>Save</Button>
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>{test.title}</h2>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setEditingTitle(true)}
            >
              <Pencil className='h-4 w-4' />
              <span className='sr-only'>Edit title</span>
            </Button>
          </div>
        )}
      </div>

      {/* Test Description */}
      <div className='space-y-2'>
        {editingDescription ? (
          <div className='space-y-2'>
            <Label htmlFor='test-description'>Test Description</Label>
            <div className='flex gap-2'>
              <Textarea
                id='test-description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='flex-1'
              />
              <Button onClick={handleSaveDescription}>Save</Button>
            </div>
          </div>
        ) : (
          <div className='flex items-start justify-between rounded-md border bg-muted/50 p-3'>
            <p className='text-sm text-muted-foreground'>{test.description}</p>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => setEditingDescription(true)}
            >
              <Pencil className='h-4 w-4' />
              <span className='sr-only'>Edit description</span>
            </Button>
          </div>
        )}
      </div>

      {/* Sections and Questions */}
      <div className='space-y-6'>
        <AnimatePresence>
          {test.sections?.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
              className='rounded-md border p-4 mb-4'
            >
              <div className='mb-4'>
                <h4 className='font-medium text-lg'>{section.title}</h4>
                {section.instruction && (
                  <p className='text-sm text-muted-foreground mt-1'>
                    {section.instruction}
                  </p>
                )}
              </div>

              <div className='space-y-4'>
                {section.questions.map((question, questionIndex) => (
                  <Card key={question.id} className='overflow-hidden'>
                    <div className='bg-muted/30 p-3 flex items-start justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='flex h-6 w-6 min-w-[1.5rem] min-h-[1.5rem] items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground shrink-0'>
                          {questionIndex + 1}
                        </span>
                        <div>
                          <h5 className='font-medium'>{question.text}</h5>
                          <span className='text-xs text-muted-foreground'>
                            {getQuestionTypeLabel(question.type)} •{' '}
                            {question.score}{' '}
                            {question.score === 1 ? 'point' : 'points'}
                          </span>
                        </div>
                      </div>
                      <div className='flex gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => openEditDialog(question)}
                        >
                          <Pencil className='h-4 w-4' />
                          <span className='sr-only'>Edit question</span>
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-destructive'
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash className='h-4 w-4' />
                          <span className='sr-only'>Delete question</span>
                        </Button>
                      </div>
                    </div>
                    <CardContent className='p-4'>
                      <QuestionRenderer question={question} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button
          variant='outline'
          className='w-full'
          onClick={handleAddQuestion}
        >
          <Plus className='mr-2 h-4 w-4' />
          Add Question
        </Button>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 '>
        <Button variant='outline' onClick={() => console.log('Go Back')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <svg
                    className='mr-2 h-4 w-4 animate-spin'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className='mr-2 h-4 w-4' />
                  Download
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => handleDownload('pdf')}>
              <FileText className='mr-2 h-4 w-4' />
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('docx')}>
              <FileText className='mr-2 h-4 w-4' />
              docx
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => handleDownload('excel')}>
              <FileSpreadsheet className='mr-2 h-4 w-4' />
              Excel
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='flex gap-2'>
          <Button
            variant='default'
            disabled={isStarting || isLoading}
            onClick={handleStartTest}
          >
            {isLoading ? (
              <>
                <svg
                  className='mr-2 h-4 w-4 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Starting...
              </>
            ) : (
              <>
                <Play className='h-4 w-4' />
                Start Test
              </>
            )}
          </Button>
        </div>
        <Button disabled={!isChanged} onClick={() => setIsChanged(false)}>
          <Save className='mr-2 h-4 w-4' />
          Save Test
        </Button>
        {/* Edit Question Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
              <DialogDescription>
                Make changes to the question and its options.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='question-text'>Question</Label>
                <Textarea
                  id='question-text'
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  className='min-h-[80px]'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='question-type'>Question Type</Label>
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger id='question-type'>
                    <SelectValue placeholder='Select question type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='multiple_choice'>
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value='true_false'>True/False</SelectItem>
                    <SelectItem value='short_answer'>Short Answer</SelectItem>
                    <SelectItem value='fill_in_the_blank'>
                      Fill in the Blank
                    </SelectItem>
                    <SelectItem value='matching_the_headings'>
                      Matching
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {questionType.toLowerCase().includes('multiple_choice') ||
              questionType.toLowerCase().includes('multiple-choice') ? (
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <Label>Options</Label>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={handleAddOption}
                      className='h-8 px-2 text-xs'
                    >
                      <Plus className='mr-1 h-3 w-3' /> Add Option
                    </Button>
                  </div>
                  <RadioGroup
                    value={editQuestionCorrectAnswer}
                    onValueChange={setEditQuestionCorrectAnswer}
                  >
                    {editQuestionOptions.map((option, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <RadioGroupItem
                          value={option.id}
                          id={`edit-option-${option.id}`}
                          checked={
                            editQuestionCorrectAnswer.toLocaleLowerCase() ===
                            option.id.toLocaleLowerCase()
                          }
                        />
                        <Input
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          placeholder={`Option ${option.id.toUpperCase()}`}
                          className='flex-1'
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => handleRemoveOption(index)}
                          className='h-8 w-8 text-destructive'
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                  </RadioGroup>
                  <p className='text-sm text-muted-foreground'>
                    Select the radio button for the correct answer.
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
                  <Label htmlFor='correct-answer'>Correct Answer</Label>
                  <Input
                    id='correct-answer'
                    value={editQuestionCorrectAnswer}
                    onChange={(e) =>
                      setEditQuestionCorrectAnswer(e.target.value)
                    }
                    placeholder='Enter the correct answer'
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveQuestion}>
                <Save className='mr-2 h-4 w-4' />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
