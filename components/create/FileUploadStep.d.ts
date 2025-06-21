import { z } from 'zod';

export interface FileUploadStepProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isGenerating: boolean;
  generatingProgress: number;
}

declare const FileUploadStep: React.FC<FileUploadStepProps>;
export default FileUploadStep; 