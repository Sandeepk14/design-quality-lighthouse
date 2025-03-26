
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { useAuth } from '@/context/AuthContext';
import { 
  saveReport, 
  getReportsByUser, 
  getReportsByDate,
  generateMockReport,
  Report 
} from '@/services/mongoService';
import { toast } from '@/hooks/use-toast';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  FileText,
  LogOut,
  Loader,
  Calendar,
  RefreshCw
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageReport from '@/components/PageReport';
import DateSelector from '@/components/DateSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [savedReports, setSavedReports] = useState<Report[]>([]);
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  // Load saved reports on component mount
  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

  // Load reports when filter date changes
  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [filterDate]);

  const loadReports = async () => {
    if (!user) return;
    
    setIsLoadingReports(true);
    try {
      let reports;
      if (filterDate) {
        reports = await getReportsByDate(user.id, filterDate);
      } else {
        reports = await getReportsByUser(user.id);
      }
      setSavedReports(reports);
    } catch (error) {
      console.error("Error loading reports:", error);
      toast({
        title: "Error",
        description: "Failed to load saved reports",
        variant: "destructive"
      });
    } finally {
      setIsLoadingReports(false);
    }
  };

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
      const mockResults = generateMockReport(file.name, pageCount);
      
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
    
    // Refresh the reports list
    loadReports();
    setIsProcessing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
      case 'partial':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const handleReset = () => {
    setFiles([]);
    setUploadResults([]);
  };

  const downloadFullReport = (fileName: string) => {
    toast({
      title: "Report downloaded",
      description: `Full report for ${fileName} has been downloaded.`,
    });
  };

  const downloadPageReport = (fileName: string, pageNumber: number) => {
    toast({
      title: "Page report downloaded",
      description: `Report for ${fileName} - Page ${pageNumber} has been downloaded.`,
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="reports">View Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
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
                                onClick={() => downloadFullReport(result.fileName)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Full Report
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
                                {result.results.map((pageResult) => (
                                  <PageReport
                                    key={pageResult.pageNumber}
                                    fileName={result.fileName}
                                    pageNumber={pageResult.pageNumber}
                                    status={pageResult.status}
                                    issues={pageResult.issues}
                                    onDownload={(pageNumber) => downloadPageReport(result.fileName, pageNumber)}
                                  />
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
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h2 className="text-lg font-medium">Saved Reports</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                    <div className="w-full sm:w-48">
                      <DateSelector 
                        date={filterDate} 
                        onDateChange={setFilterDate} 
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setFilterDate(undefined);
                      }}
                      className="whitespace-nowrap"
                    >
                      Clear Filter
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={loadReports}
                      disabled={isLoadingReports}
                      className="w-10 h-10 p-0 rounded-full"
                    >
                      <RefreshCw className={`h-5 w-5 ${isLoadingReports ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
                
                {savedReports.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pages</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.fileName}</TableCell>
                          <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(report.status)}
                              <span>
                                {report.status === 'success' 
                                  ? 'Passed' 
                                  : report.status === 'failed' 
                                    ? 'Failed' 
                                    : 'Needs Review'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{report.pageResults.length}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => downloadFullReport(report.fileName)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    {isLoadingReports ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader className="h-8 w-8 animate-spin text-amber-500" />
                        <p>Loading reports...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-12 w-12 text-gray-300" />
                        <p className="text-lg font-medium">No reports found</p>
                        <p className="text-sm">
                          {filterDate 
                            ? `No reports found for ${filterDate.toLocaleDateString()}` 
                            : "Upload and process files to generate reports"}
                        </p>
                        {filterDate && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setFilterDate(undefined)}
                            className="mt-2"
                          >
                            Clear Filter
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DesignQualityAssurance;
