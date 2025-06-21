import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { memo } from 'react';

// Move these from the main component
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

const gradeLevelOptions = [
  { value: 'elementary', label: 'grade.elementary' },
  { value: 'middle', label: 'grade.middle' },
  { value: 'high', label: 'grade.high' },
  { value: 'college', label: 'grade.college' },
  { value: 'graduate', label: 'grade.graduate' },
  { value: 'professional', label: 'grade.professional' },
];

export interface FormStepProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isGenerating: boolean;
  generatingProgress: number;
}

function FormStepComponent({ onSubmit, isGenerating, generatingProgress }: FormStepProps) {
  const { t } = useLanguage();
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-medium mb-4'>{t('create.required_info')}</h3>
          
          <div className='grid gap-6 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='subject'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('create.subject')} <span className='text-red-500'>*</span></FormLabel>
                  <FormControl>
                    <Input placeholder={t('create.subject_placeholder')} {...field} />
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
                  <FormLabel>{t('create.grade_level')} <span className='text-red-500'>*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('create.grade_level')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gradeLevelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
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
                <FormLabel>{t('create.topic')} <span className='text-red-500'>*</span></FormLabel>
                <FormControl>
                  <Input placeholder={t('create.topic_placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-medium mb-4'>{t('create.additional_options')}</h3>
          
          <div className='grid gap-6 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('create.test_title')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('create.test_title_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='sectionCount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('create.number_of_sections')}</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      max={6}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
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
                    max={10}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='mt-4'>
                <FormLabel>{t('create.description')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('create.description_placeholder')}
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

export default memo(FormStepComponent); 