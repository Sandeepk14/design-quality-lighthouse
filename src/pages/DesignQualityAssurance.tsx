
import React, { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadIcon, FileTextIcon, CheckCircleIcon, AlertCircleIcon, DownloadIcon, FileIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { FileUploader } from '@/components/FileUploader';
import { ReportCard } from '@/components/ReportCard';
import { PageFadeIn } from '@/components/animations/PageFadeIn';
import { motion } from '@/components/animations/Motion';

interface FileWithPreview extends File {
  id: string;
  preview: string;
}

interface EvaluationResult {
  id: string;
  fileName: string;
  pageCount: number;
  status: 'success' | 'warning' | 'error';
  score: number;
  details: {
    pageNumber: number;
    score: number;
    issues: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
  }[];
  date: Date;
}

const DesignQualityAssurance = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();

  const handleFileDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      ...file,
      id: `${file.name}-${Date.now()}`,
      preview: URL.createObjectURL(file)
    })) as FileWithPreview[];
    
    setFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files added",
      description: `Added ${acceptedFiles.length} file(s) for evaluation`,
      duration: 3000,
    });
  }, [toast]);

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const startEvaluation = () => {
    if (files.length === 0) {
      toast({
        title: "No files",
        description: "Please upload at least one PDF file for evaluation",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    setProgress(0);
    setActiveTab('evaluating');

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 300);

    // Simulate evaluation process
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Generate mock results
      const results: EvaluationResult[] = files.map(file => {
        const pageCount = Math.floor(Math.random() * 10) + 1;
        const score = Math.floor(Math.random() * 30) + 70;
        const status = score > 85 ? 'success' : score > 70 ? 'warning' : 'error';
        
        const details = Array(pageCount).fill(0).map((_, i) => {
          const pageScore = Math.floor(Math.random() * 30) + 70;
          const issueCount = Math.floor(Math.random() * 3) + 1;
          
          return {
            pageNumber: i + 1,
            score: pageScore,
            issues: Array(issueCount).fill(0).map(() => {
              const issueTypes = [
                'Design inconsistency', 
                'Low contrast ratio', 
                'Improper spacing', 
                'Text overflow',
                'Missing alt text',
                'Accessibility issue'
              ];
              const severities = ['low', 'medium', 'high'] as const;
              
              return {
                type: issueTypes[Math.floor(Math.random() * issueTypes.length)],
                description: `Issue found on page ${i + 1}`,
                severity: severities[Math.floor(Math.random() * severities.length)]
              };
            })
          };
        });
        
        return {
          id: file.id,
          fileName: file.name,
          pageCount,
          status,
          score,
          details,
          date: new Date()
        };
      });
      
      setEvaluationResults(results);
      setIsEvaluating(false);
      setActiveTab('results');
      
      toast({
        title: "Evaluation complete",
        description: `Successfully evaluated ${files.length} file(s)`,
      });
    }, 6000);
  };

  const downloadReport = (result: EvaluationResult) => {
    // In a real app, this would generate and download a PDF report
    toast({
      title: "Report downloaded",
      description: `Report for ${result.fileName} has been saved`,
    });
  };

  const saveToDatabase = () => {
    // In a real app, this would save to MongoDB
    toast({
      title: "Reports saved",
      description: "All reports have been stored in the database",
    });
  };

  return (
    <PageFadeIn>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <AnimatedLogo className="h-10 w-10" />
            <motion.h1 
              className="text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Design Quality Assurance
            </motion.h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger 
                value="upload" 
                disabled={isEvaluating}
                className="data-[state=active]:bg-watt-gold data-[state=active]:text-black"
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Files
              </TabsTrigger>
              <TabsTrigger 
                value="evaluating" 
                disabled={!isEvaluating}
                className="data-[state=active]:bg-watt-bronze data-[state=active]:text-black"
              >
                <FileTextIcon className="mr-2 h-4 w-4" />
                Evaluating
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                disabled={evaluationResults.length === 0}
                className="data-[state=active]:bg-watt-orange data-[state=active]:text-black"
              >
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <Card className="p-6 shadow-soft">
                <h2 className="text-xl font-semibold mb-4">Upload PDF Files for Evaluation</h2>
                <p className="text-gray-600 mb-6">
                  Upload one or multiple PDF files to evaluate design quality. 
                  We'll analyze each page and provide detailed feedback.
                </p>
                
                <FileUploader 
                  onFilesAdded={handleFileDrop}
                  accept={{
                    'application/pdf': ['.pdf']
                  }}
                  maxFiles={10}
                  maxSize={10 * 1024 * 1024} // 10MB
                />

                {files.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="font-medium text-gray-700">Uploaded Files ({files.length})</h3>
                    <div className="space-y-3">
                      {files.map(file => (
                        <div 
                          key={file.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className="flex items-center">
                            <FileIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveFile(file.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={startEvaluation} 
                        className="bg-watt-gold hover:bg-watt-bronze text-black"
                        disabled={isEvaluating}
                      >
                        Start Evaluation
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="evaluating" className="space-y-6">
              <Card className="p-8 shadow-soft">
                <div className="text-center">
                  <div className="mb-8">
                    <div className="inline-block p-4 rounded-full bg-watt-gold/10 mb-4">
                      <FileTextIcon className="h-12 w-12 text-watt-bronze animate-pulse" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Evaluating Your Design Files</h2>
                    <p className="text-gray-600">
                      Please wait while we analyze the quality of your design files.
                      This may take a few moments.
                    </p>
                  </div>
                  
                  <div className="max-w-md mx-auto mb-8">
                    <Progress value={progress} className="h-2" />
                    <p className="mt-2 text-sm text-gray-500">{progress}% complete</p>
                  </div>
                  
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div 
                        key={file.id} 
                        className="flex items-center p-2 bg-gray-50 rounded-lg"
                      >
                        <FileIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{file.name}</span>
                        {progress > index * (100 / files.length) && (
                          <CheckCircleIcon className="ml-auto h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <Card className="p-6 shadow-soft">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Evaluation Results</h2>
                  <Button 
                    onClick={saveToDatabase}
                    className="bg-watt-gold hover:bg-watt-bronze text-black"
                  >
                    Save All Reports
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {evaluationResults.map((result) => (
                    <ReportCard 
                      key={result.id} 
                      result={result}
                      onDownload={() => downloadReport(result)}
                    />
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageFadeIn>
  );
};

export default DesignQualityAssurance;
