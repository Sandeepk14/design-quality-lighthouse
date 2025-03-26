
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from '@/components/animations/Motion';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesAdded,
  accept,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

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
        isDragActive && "border-watt-gold bg-watt-gold/5",
        isDragAccept && "border-green-500 bg-green-50",
        isDragReject && "border-red-500 bg-red-50",
        !isDragActive && "border-gray-200 hover:border-watt-gold",
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center gap-3 py-4">
        <div className="p-4 bg-watt-gold/10 rounded-full">
          <UploadIcon className="h-8 w-8 text-watt-gold" />
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
