'use client';

import type React from 'react';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Check,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { TestPreview } from '@/components/test-preview';
import { Checkbox } from '@/components/ui/checkbox';
import {
  initSocket,
  getSocket,
  emitEvent,
  onEvent,
  GENERATE_TEST_EVENTS,
  ONLINE_TEST_EVENTS,
} from '@/lib/socket';
import { useLanguage } from '@/contexts/language-context';

// Interface for the payload expected by the backend
interface TestParamsDto {
  subject: string;
  gradeLevel: string;
  sectionTypes: string[];
  questionsPerSection: number;
  topic: string;
  prompt?: string;
}

// Form schema with proper validation
const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  sectionTypes: z
    .array(z.string())
    .min(1, 'At least one section type is required'),
  questionsPerSection: z.number().min(1).max(50),
  topic: z.string().min(1, 'Topic is required'),
  prompt: z.string().optional(),
});

// Section type options
const sectionTypeOptions = [
  { value: 'multiple-choice', label: 'section.multiple-choice' },
  { value: 'true-false', label: 'section.true-false' },
  { value: 'short-answer', label: 'section.short-answer' },
  { value: 'essay', label: 'section.essay' },
  { value: 'matching', label: 'section.matching' },
  { value: 'fill-in-blank', label: 'section.fill-in-blank' },
];

// Grade level options
const gradeLevelOptions = [
  { value: 'elementary', label: 'grade.elementary' },
  { value: 'middle', label: 'grade.middle' },
  { value: 'high', label: 'grade.high' },
  { value: 'college', label: 'grade.college' },
  { value: 'graduate', label: 'grade.graduate' },
  { value: 'professional', label: 'grade.professional' },
];

export default function CreatePage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState<any>(null);
  
  // Refs
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const socketInitializedRef = useRef(false);

  // Form initialization
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      gradeLevel: 'high',
      sectionTypes: ['multiple-choice'],
      questionsPerSection: 5,
      topic: '',
      prompt: '',
    },
  });

  // Progress simulation
  const simulateProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearTimeout(progressIntervalRef.current);
    }

    setGeneratingProgress(0);
    
    const totalSteps = 20;
    const maxProgress = 95;
    let currentStep = 0;

    const updateProgress = () => {
      currentStep++;
      
      const progressPercentage = Math.min(
        maxProgress,
        Math.floor((currentStep / totalSteps) * maxProgress) +
          (Math.random() * 2 - 1)
      );

      setGeneratingProgress(progressPercentage);

      if (currentStep < totalSteps) {
        const nextInterval = 100 + currentStep * 25;
        progressIntervalRef.current = setTimeout(updateProgress, nextInterval);
      }
    };

    progressIntervalRef.current = setTimeout(updateProgress, 100);
  }, []);

  // Clear progress interval
  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearTimeout(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Socket initialization
  useEffect(() => {
    if (socketInitializedRef.current) return;

    const socketInstance = initSocket();

    const handleConnect = () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
      setError(null);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    const handleError = (err: any) => {
      console.error('Socket connection error:', err);
      setError(err.message || 'Connection error');
      setIsConnected(false);
    };

    if (socketInstance) {
      socketInstance.on('connect', handleConnect);
      socketInstance.on('disconnect', handleDisconnect);
      socketInstance.on('connect_error', handleError);

      if ('connected' in socketInstance) {
        setIsConnected(socketInstance.connected);
      } else {
        setIsConnected(true);
      }

      setTimeout(() => {
        if ('connected' in socketInstance) {
          setIsConnected(socketInstance.connected);
        } else {
          setIsConnected(true);
        }
      }, 1000);
    }

    socketInitializedRef.current = true;

    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleError);
      }
    };
  }, []);

  // Event handlers
  useEffect(() => {
    const createdCleanup = onEvent(
      GENERATE_TEST_EVENTS.GENERATE_TEST_SUCCESS,
      (data) => {
        console.log('Test created:', data);
        clearProgressInterval();
        setGeneratingProgress(100);

        setTimeout(() => {
          setTestData(data);
          setIsGenerating(false);
          setCurrentStep(3);
        }, 800);
      }
    );

    const startTestCleanup = onEvent(ONLINE_TEST_EVENTS.START_TEST, (data) => {
      console.log('Test started event received:', data);
      const testId = data?.test_id || data?.test?.id || data?.id;

      if (testId) {
        console.log(`Navigating to monitoring page for test ID: ${testId}`);
        window.location.href = `/dashboard/monitor?testId=${testId}&tempCode=${data?.tempCode.code}`;
      } else {
        console.error('Test ID not found in START_TEST event data:', data);
      }
    });

    const errorCleanup = onEvent(
      GENERATE_TEST_EVENTS.GENERATE_TEST_ERROR,
      (err) => {
        console.error('Server error:', err);
        setError(err.message || 'Server error');
        setIsGenerating(false);
        clearProgressInterval();
      }
    );

    return () => {
      createdCleanup();
      startTestCleanup();
      errorCleanup();
      clearProgressInterval();
    };
  }, [clearProgressInterval]);

  // Form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleGenerate(values);
  };

  // Generate test
  const handleGenerate = async (values: z.infer<typeof formSchema>) => {
    const socket = getSocket();

    if (!socket) {
      setError('Not connected to server');
      return;
    }

    setIsGenerating(true);
    setGeneratingProgress(0);
    simulateProgress();

    const payload: TestParamsDto = {
      subject: values.subject,
      gradeLevel: values.gradeLevel,
      sectionTypes: values.sectionTypes,
      questionsPerSection: values.questionsPerSection,
      topic: values.topic,
      prompt: values.prompt,
    };

    emitEvent(GENERATE_TEST_EVENTS.GENERATE_TEST_BY_FORM, payload);
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const forceNextStep = () => {
    clearProgressInterval();
    setIsGenerating(false);
    setGeneratingProgress(100);
    setCurrentStep(3);
  };

  const handleSaveTest = () => {
    alert(t('create.test_saved'));
  };

  const handleMethodSelect = () => {
    setCurrentStep(2);
  };

  // Function to get question type descriptions
  const getQuestionTypeDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      'multiple-choice': 'section.multiple-choice-desc',
      'true-false': 'section.true-false-desc',
      'short-answer': 'section.short-answer-desc',
      'essay': 'section.essay-desc',
      'matching': 'section.matching-desc',
      'fill-in-blank': 'section.fill-in-blank-desc',
    };
    return t(descriptions[type] || '');
  };

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>{t('create.title')}</h1>
        <p className='text-muted-foreground'>{t('create.subtitle')}</p>
      </div>

      {/* Connection status */}
      <div className='mb-4'>
        <div
          className={`flex items-center gap-2 ${
            isConnected ? 'text-green-500' : 'text-red-500'
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span>
            {isConnected ? t('create.connected') : t('create.not_connected')}
          </span>
        </div>
        {error && <p className='text-red-500 mt-1'>{error}</p>}
      </div>

      {/* Steps indicator */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentStep >= 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              1
            </div>
            <div
              className={`mx-2 h-1 w-10 ${
                currentStep >= 2 ? 'bg-primary' : 'bg-muted'
              }`}
            />
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentStep >= 2
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              2
            </div>
            <div
              className={`mx-2 h-1 w-10 ${
                currentStep >= 3 ? 'bg-primary' : 'bg-muted'
              }`}
            />
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentStep >= 3
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              3
            </div>
          </div>
          <div className='text-sm text-muted-foreground'>
            {currentStep === 1 && t('create.choose_method')}
            {currentStep === 2 && t('create.configure_test')}
            {currentStep === 3 && t('create.preview_test')}
          </div>
        </div>
      </div>

      {/* Step 1: Choose method */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className='grid gap-6 md:grid-cols-1'>
            <div
              className='flex cursor-pointer flex-col items-center justify-center rounded-lg border p-6 text-center hover:border-primary border-primary bg-primary/5'
              onClick={handleMethodSelect}
            >
              <FileText className='mb-4 h-12 w-12 text-primary' />
              <h3 className='mb-2 text-xl font-medium'>{t('create.form_method')}</h3>
              <p className='text-sm text-muted-foreground'>
                {t('create.form_desc')}
              </p>
            </div>
          </div>
          <div className='mt-6 flex justify-end'>
            <Button onClick={nextStep}>
              {t('common.next')}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Configure test */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Required Fields Section */}
              <div className='rounded-lg border p-6'>
                <h3 className='text-lg font-medium mb-4'>
                  {t('create.required_info')}
                </h3>

                <div className='grid gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='subject'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('create.subject')} <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('create.subject_placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='gradeLevel'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('create.grade_level')} <span className='text-red-500'>*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('create.grade_level')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {gradeLevelOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {t(option.label)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='topic'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>
                        {t('create.topic')} <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('create.topic_placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='mt-4'>
                  <FormField
                    control={form.control}
                    name='sectionTypes'
                    render={({ field }) => (
                      <FormItem>
                        <div className='mb-4'>
                          <FormLabel className='text-base font-medium'>
                            {t('create.question_types')}{' '}
                            <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormDescription>
                            {t('create.select_question_types')}
                          </FormDescription>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                          {sectionTypeOptions.map((option) => (
                            <FormField
                              key={option.value}
                              control={form.control}
                              name='sectionTypes'
                              render={({ field }) => {
                                const isSelected = field.value?.includes(option.value);
                                return (
                                  <FormItem
                                    key={option.value}
                                    className='relative'
                                  >
                                    <FormControl>
                                      <div
                                        className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:border-primary/50 ${
                                          isSelected
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:bg-muted/50'
                                        }`}
                                        onClick={() => {
                                          const checked = field.value?.includes(option.value);
                                          if (checked) {
                                            field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option.value
                                              )
                                            );
                                          } else {
                                            field.onChange([...field.value, option.value]);
                                          }
                                        }}
                                      >
                                        <div className='flex items-start space-x-3'>
                                          <div className='flex-shrink-0'>
                                            <Checkbox
                                              checked={isSelected}
                                              onCheckedChange={(checked) => {
                                                if (checked) {
                                                  field.onChange([...field.value, option.value]);
                                                } else {
                                                  field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== option.value
                                                    )
                                                  );
                                                }
                                              }}
                                              className='mt-0.5'
                                            />
                                          </div>
                                          <div className='flex-1 min-w-0'>
                                            <FormLabel className='font-medium text-sm cursor-pointer mb-1 block'>
                                              {t(option.label)}
                                            </FormLabel>
                                            <p className='text-xs text-muted-foreground'>
                                              {getQuestionTypeDescription(option.value)}
                                            </p>
                                          </div>
                                        </div>
                                        {isSelected && (
                                          <div className='absolute top-2 right-2'>
                                            <div className='w-2 h-2 bg-primary rounded-full'></div>
                                          </div>
                                        )}
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* <FormField
                  control={form.control}
                  name='questionsPerSection'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>
                        {t('create.questions_per_section')}: {field.value}
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={50}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name='prompt'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>
                        {t('create.prompt')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('create.prompt_placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex justify-between'>
                <Button type='button' variant='outline' onClick={prevStep}>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  {t('common.back')}
                </Button>
                <div className='flex gap-2'>
                  {isGenerating && (
                    <Button
                      type='button'
                      variant='outline'
                      onClick={forceNextStep}
                    >
                      <RefreshCw className='mr-2 h-4 w-4' />
                      {t('create.skip_loading')}
                    </Button>
                  )}
                  <Button type='submit' disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        {t('create.generating')}
                      </>
                    ) : (
                      <>
                        {t('create.generate_ai')}
                        <span className='flex items-center gap-1'>
                         5<img src="/coin-small.png" alt="small coin" width={20} height={20} />
                        </span>
                        {/* <ArrowRight className='ml-2 h-4 w-4' /> */}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isGenerating && (
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>{t('create.generating_test')}</span>
                    <span>{Math.round(generatingProgress)}%</span>
                  </div>
                  <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                    <div
                      className='h-full bg-primary'
                      style={{ width: `${generatingProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </form>
          </Form>
        </motion.div>
      )}

      {/* Step 3: Preview test */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className='space-y-6'>
            <TestPreview testData={testData} />
            <div className='flex justify-between'>
              <Button variant='outline' onClick={prevStep}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                {t('common.back')}
              </Button>
              <Button onClick={handleSaveTest}>
                {t('create.save_test')}
                <Check className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
