
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  FileText,
  BarChart3,
  List
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Report } from '@/services/mongoService';

interface ReportDetailViewProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (reportId: string) => void;
}

const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  isOpen,
  onClose,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!report) return null;

  const getStatusIcon = (status: 'success' | 'failed' | 'partial' | 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'success':
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'partial':
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: 'success' | 'failed' | 'partial' | 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'success':
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'partial':
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusDescription = (status: 'success' | 'failed' | 'partial') => {
    switch (status) {
      case 'success':
        return 'This design meets quality standards and is ready for submission.';
      case 'failed':
        return 'This design has significant issues that must be addressed before submission.';
      case 'partial':
        return 'This design has some issues that should be addressed before submission.';
      default:
        return '';
    }
  };

  // Calculate issue statistics
  const totalIssues = report.pageResults.reduce((acc, page) => 
    acc + (page.issues?.length || 0), 0);
  
  const passedPages = report.pageResults.filter(p => p.status === 'pass').length;
  const warningPages = report.pageResults.filter(p => p.status === 'warning').length;
  const failedPages = report.pageResults.filter(p => p.status === 'fail').length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {report.fileName}
            </span>
            <Badge className={getStatusColor(report.status)}>
              {getStatusIcon(report.status)}
              <span className="ml-1">{report.score}%</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {getStatusDescription(report.status)}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Page Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 p-2">
            <div className="flex justify-between items-center mt-2 mb-6">
              <h3 className="text-lg font-medium">Quality Analysis</h3>
              <Button 
                onClick={() => report.id && onDownload(report.id)}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Full Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report.score}%</div>
                  <Progress 
                    value={report.score} 
                    className="h-2 mt-2" 
                    indicatorClassName={
                      report.score > 85 ? "bg-green-500" : 
                      report.score > 60 ? "bg-amber-500" : 
                      "bg-red-500"
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Total Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalIssues}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Across {report.pageResults.length} pages
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Page Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-green-100 text-green-800">
                      {passedPages} Passed
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-800">
                      {warningPages} Warnings
                    </Badge>
                    <Badge className="bg-red-100 text-red-800">
                      {failedPages} Failed
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Issue Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {totalIssues > 0 ? (
                  <div className="space-y-4">
                    {report.pageResults
                      .filter(page => page.issues && page.issues.length > 0)
                      .slice(0, 5)
                      .map((page, idx) => (
                        <div key={idx} className="border-b pb-3 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium">Page {page.pageNumber}</h4>
                            <Badge className={getStatusColor(page.status)}>
                              {page.status}
                            </Badge>
                          </div>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {page.issues?.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    
                    {report.pageResults.filter(p => p.issues && p.issues.length > 0).length > 5 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActiveTab('pages')}
                        className="w-full"
                      >
                        View All Issues
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                    <h3 className="text-xl font-medium">No Issues Found!</h3>
                    <p className="text-gray-500 max-w-md">
                      This design passed all quality checks and is ready for submission.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="p-2">
            <div className="space-y-4">
              {report.pageResults.map((page, idx) => (
                <Card key={idx} className={`border ${
                  page.status === 'pass' ? 'border-green-200' : 
                  page.status === 'warning' ? 'border-amber-200' : 
                  'border-red-200'
                }`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex justify-between items-center">
                      <span>Page {page.pageNumber}</span>
                      <Badge className={getStatusColor(page.status)}>
                        {page.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {page.issues && page.issues.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Issues:</h4>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                          {page.issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No issues found on this page.</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailView;
