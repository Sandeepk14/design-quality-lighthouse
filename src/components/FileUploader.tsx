
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from '@/components/animations/Motion';
import { toast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number; // Supporting up to 50MB
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesAdded,
  accept = { 'application/pdf': ['.pdf'] },
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB default
  className,
}) => {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        if (errors[0]?.code === 'file-too-large') {
          toast({
            title: 'File too large',
            description: `"${file.name}" exceeds the ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit.`,
            variant: 'destructive',
          });
        } else if (errors[0]?.code === 'file-invalid-type') {
          toast({
            title: 'Invalid file type',
            description: `"${file.name}" is not a PDF file.`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'File error',
            description: errors[0]?.message || 'There was an error with the file.',
            variant: 'destructive',
          });
        }
      });
    }

    if (acceptedFiles.length > 0) {
      onFilesAdded(acceptedFiles);
    }
  }, [onFilesAdded, maxSize]);

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ 
    onDrop,
    accept,
    maxFiles,
    maxSize
  });

  return (
    <motion.div 
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center transition-all",
        isDragActive && "border-amber-500 bg-amber-500/5",
        isDragAccept && "border-green-500 bg-green-50",
        isDragReject && "border-red-500 bg-red-50",
        !isDragActive && "border-gray-200 hover:border-amber-500",
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center gap-3 py-4">
        <div className="p-4 bg-amber-500/10 rounded-full">
          <UploadIcon className="h-8 w-8 text-amber-500" />
        </div>
        
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium">
            {isDragActive 
              ? isDragAccept 
                ? "Drop the files here..." 
                : "This file type is not accepted"
              : "Drag & drop PDF files here"
            }
          </p>
          <p className="text-xs text-gray-500">
            or click to select files
          </p>
        </div>

        <div className="text-xs text-gray-400 mt-2">
          PDF files only, up to {maxFiles} files, max {(maxSize / (1024 * 1024)).toFixed(0)}MB each
        </div>
      </div>
    </motion.div>
  );
};

export default FileUploader;
