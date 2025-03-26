
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { useAuth } from '@/context/AuthContext';
import { saveReport, Report } from '@/services/mongoService';
import { toast } from '@/hooks/use-toast';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  FileText,
  LogOut,
  Loader
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface PageResult {
  pageNumber: number;
  status: 'pass' | 'fail' | 'warning';
  issues?: string[];
}

interface FileUploadResult {
  fileName: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  results?: PageResult[];
  error?: string;
}

const DesignQualityAssurance: React.FC = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadResults, setUploadResults] = useState<FileUploadResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = (newFiles: File[]) => {
    if (isProcessing) return;
    
    setFiles((prevFiles) => {
      // Filter out duplicates (files with the same name)
      const existingFileNames = prevFiles.map(f => f.name);
      const uniqueNewFiles = newFiles.filter(f => !existingFileNames.includes(f.name));
      
      return [...prevFiles, ...uniqueNewFiles];
    });
    
    // Initialize upload results
    setUploadResults((prev) => {
      const newResults = newFiles.map(file => ({
        fileName: file.name,
        status: 'processing' as const,
        progress: 0
      }));
      
      return [...prev, ...newResults];
    });
  };

  const processFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files to process",
        description: "Please upload PDF files first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update progress
      setUploadResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(result => result.fileName === file.name);
        if (index !== -1) {
          updated[index] = { ...updated[index], progress: 10 };
        }
        return updated;
      });
      
      // Simulate file processing (in a real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update progress to 50%
      setUploadResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(result => result.fileName === file.name);
        if (index !== -1) {
          updated[index] = { ...updated[index], progress: 50 };
        }
        return updated;
      });
      
      // Simulate more processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock results
      const pageCount = Math.floor(Math.random() * 10) + 3; // 3-12 pages
      const mockResults: PageResult[] = Array.from({ length: pageCount }).map((_, index) => {
        const statuses: ('pass' | 'fail' | 'warning')[] = ['pass', 'fail', 'warning'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        const issues = randomStatus === 'pass' 
          ? [] 
          : [
              'Inconsistent dimensions',
              'Missing electrical labels',
              'Inadequate clearance',
              'Improper conduit routing',
              'Incorrect setback distances'
            ].slice(0, Math.floor(Math.random() * 3) + 1);
        
        return {
          pageNumber: index + 1,
          status: randomStatus,
          issues: issues.length > 0 ? issues : undefined
        };
      });
      
      // Update to completed with results
      setUploadResults(prev => {
        const updated = [...prev];
        const index = updated.findIndex(result => result.fileName === file.name);
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: 'completed',
            progress: 100,
            results: mockResults
          };
        }
        return updated;
      });
      
      // Save report to MongoDB (mock)
      if (user) {
        const overallStatus = mockResults.every(r => r.status === 'pass') 
          ? 'success' 
          : mockResults.some(r => r.status === 'fail') 
            ? 'failed' 
            : 'partial';
            
        await saveReport({
          userId: user.id,
          fileName: file.name,
          status: overallStatus,
          pageResults: mockResults,
          downloadUrl: '#' // This would be a real URL in a production app
        });
      }
    }
    
    toast({
      title: "Processing complete",
      description: `Successfully processed ${files.length} files.`,
    });
    
    setIsProcessing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const handleReset = () => {
    setFiles([]);
    setUploadResults([]);
  };

  const downloadReport = (fileName: string) => {
    toast({
      title: "Report downloaded",
      description: `Report for ${fileName} has been downloaded.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/57f90501-54a2-4a12-8bcb-788643b36715.png" 
              alt="Wattmonk Logo" 
              className="h-8" 
            />
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{user?.email || 'Account'}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[200px] p-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Design Quality Assurance</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Upload Files</h2>
            
            <FileUploader 
              onFilesAdded={handleFilesAdded}
              maxSize={50 * 1024 * 1024} // 50MB
            />
            
            <div className="mt-6 flex flex-wrap gap-4">
              <Button 
                onClick={processFiles}
                disabled={files.length === 0 || isProcessing}
                className="bg-amber-500 hover:bg-amber-600"
              >
                {isProcessing ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Analyze Documents'
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleReset}
                disabled={files.length === 0 || isProcessing}
              >
                Reset
              </Button>
            </div>
          </div>
          
          {/* File List */}
          {uploadResults.length > 0 && (
            <div className="border-t">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Uploaded Files</h2>
                
                <div className="space-y-6">
                  {uploadResults.map((result, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium">{result.fileName}</span>
                        </div>
                        
                        {result.status === 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadReport(result.fileName)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </Button>
                        )}
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div 
                          className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${result.progress}%` }}
                        ></div>
                      </div>
                      
                      {/* Status */}
                      <div className="text-sm text-gray-500">
                        {result.status === 'processing' ? (
                          <span>Processing... {result.progress}%</span>
                        ) : result.status === 'completed' ? (
                          <span className="text-green-500">Completed</span>
                        ) : (
                          <span className="text-red-500">Failed: {result.error}</span>
                        )}
                      </div>
                      
                      {/* Results */}
                      {result.results && result.results.length > 0 && (
                        <div className="mt-4">
                          <h3 className="font-medium mb-2">Page Analysis</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {result.results.map((pageResult, pageIndex) => (
                              <div 
                                key={pageIndex} 
                                className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">Page {pageResult.pageNumber}</span>
                                  {getStatusIcon(pageResult.status)}
                                </div>
                                
                                {pageResult.issues && pageResult.issues.length > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    <p className="font-medium">Issues:</p>
                                    <ul className="list-disc list-inside">
                                      {pageResult.issues.map((issue, i) => (
                                        <li key={i}>{issue}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DesignQualityAssurance;
