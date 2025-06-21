import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Check, Loader2, X } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';
import { useState, useCallback, memo } from 'react';

const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  sectionTypes: z.array(z.string()).min(1, 'At least one section type is required'),
  questionsPerSection: z.number().min(1).max(50),
  tags: z.array(z.string()).optional(),
  sectionCount: z.number().min(1).max(10).optional(),
  topic: z.string().optional(),
});

export interface FileUploadStepProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isGenerating: boolean;
  generatingProgress: number;
}

function FileUploadStepComponent({ onSubmit, isGenerating, generatingProgress }: FileUploadStepProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [questionsFile, setQuestionsFile] = useState<File | null>(null);
  const [answersFile, setAnswersFile] = useState<File | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      gradeLevel: 'high',
      title: '',
      description: '',
      sectionTypes: ['multiple-choice'],
      questionsPerSection: 5,
      tags: [],
      sectionCount: 1,
      topic: '',
    },
  });

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, type: 'questions' | 'answers') => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const fileType = droppedFile.type;

      if (
        fileType === 'application/pdf' ||
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'text/plain'
      ) {
        if (type === 'questions') {
          setQuestionsFile(droppedFile);
        } else {
          setAnswersFile(droppedFile);
        }
      } else {
        alert('Please upload a PDF, DOCX, or TXT file');
      }
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'questions' | 'answers') => {
    if (e.target.files && e.target.files.length > 0) {
      if (type === 'questions') {
        setQuestionsFile(e.target.files[0]);
      } else {
        setAnswersFile(e.target.files[0]);
      }
    }
  }, []);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!questionsFile) {
      alert('Please upload a questions file');
      return;
    }
    
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic');
      return;
    }

    onSubmit({
      ...values,
      topic: selectedTopics.join(', '),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-medium mb-4'>{t('create.upload_questions_file')}</h3>
          <div className='space-y-4'>
            <div
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${
                isDragging ? 'border-primary bg-primary/5' : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => handleDrop(e, 'questions')}
            >
              {questionsFile ? (
                <div className='text-center'>
                  <Check className='mx-auto mb-2 h-8 w-8 text-green-500' />
                  <p className='mb-1 font-medium'>{questionsFile.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {(questionsFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant='outline'
                    size='sm'
                    className='mt-2'
                    onClick={() => setQuestionsFile(null)}
                  >
                    {t('create.remove')}
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className='mb-4 h-12 w-12 text-muted-foreground' />
                  <h3 className='mb-2 text-lg font-medium'>{t('create.drag_drop')}</h3>
                  <p className='mb-4 text-sm text-muted-foreground'>{t('create.drag_drop_desc')}</p>
                  <div className='flex items-center space-x-2'>
                    <label htmlFor='file-upload'>
                      <div className='flex cursor-pointer items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'>
                        {t('create.browse')}
                      </div>
                      <input
                        id='file-upload'
                        type='file'
                        className='hidden'
                        accept='.pdf,.docx,.txt'
                        onChange={(e) => handleFileChange(e, 'questions')}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-medium mb-4'>{t('create.upload_answers_file')}</h3>
          <div className='space-y-4'>
            <div
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${
                isDragging ? 'border-primary bg-primary/5' : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => handleDrop(e, 'answers')}
            >
              {answersFile ? (
                <div className='text-center'>
                  <Check className='mx-auto mb-2 h-8 w-8 text-green-500' />
                  <p className='mb-1 font-medium'>{answersFile.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {(answersFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant='outline'
                    size='sm'
                    className='mt-2'
                    onClick={() => setAnswersFile(null)}
                  >
                    {t('create.remove')}
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className='mb-4 h-12 w-12 text-muted-foreground' />
                  <h3 className='mb-2 text-lg font-medium'>{t('create.drag_drop')}</h3>
                  <p className='mb-4 text-sm text-muted-foreground'>{t('create.drag_drop_desc')}</p>
                  <div className='flex items-center space-x-2'>
                    <label htmlFor='answers-file-upload'>
                      <div className='flex cursor-pointer items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'>
                        {t('create.browse')}
                      </div>
                      <input
                        id='answers-file-upload'
                        type='file'
                        className='hidden'
                        accept='.pdf,.docx,.txt'
                        onChange={(e) => handleFileChange(e, 'answers')}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Button type='submit' disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              {t('create.generating')}
            </>
          ) : (
            t('create.generate_ai')
          )}
        </Button>

        {isGenerating && (
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>{t('create.generating_test')}</span>
              <span>{generatingProgress.toFixed(1)}%</span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
              <div
                className='h-full bg-primary transition-all duration-300 ease-in-out'
                style={{ width: `${generatingProgress}%` }}
              />
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}

export default memo(FileUploadStepComponent); 