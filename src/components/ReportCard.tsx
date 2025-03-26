
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircleIcon, AlertCircleIcon, XCircleIcon, DownloadIcon, FileTextIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from '@/components/animations/Motion';

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

interface ReportCardProps {
  result: EvaluationResult;
  onDownload: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ result, onDownload }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const getStatusIcon = () => {
    switch (result.status) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertCircleIcon className="h-6 w-6 text-amber-500" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (result.status) {
      case 'success':
        return 'Pass';
      case 'warning':
        return 'Needs Review';
      case 'error':
        return 'Failed';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="hover-scale"
    >
      <Card className="overflow-hidden shadow-md border border-gray-100">
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileTextIcon className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium text-sm truncate max-w-[180px]" title={result.fileName}>
              {result.fileName}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {result.score}%
            </span>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium">{getStatusText()}</p>
            </div>
            <div>
              <p className="text-gray-500">Pages</p>
              <p className="font-medium">{result.pageCount}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{result.date.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Issues</p>
              <p className="font-medium">
                {result.details.reduce((acc, page) => acc + page.issues.length, 0)}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>{result.fileName} - Quality Report</DialogTitle>
                </DialogHeader>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="pages">Pages</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="p-4">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          {getStatusIcon()}
                          <span>Overall Score: {result.score}%</span>
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {result.status === 'success' 
                            ? 'This design meets quality standards.' 
                            : result.status === 'warning'
                              ? 'This design has some issues that need attention.'
                              : 'This design has significant quality issues.'}
                        </p>
                      </div>
                      <Button 
                        className="bg-watt-gold hover:bg-watt-bronze text-black"
                        onClick={onDownload}
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium mb-3">Summary</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">File Name</p>
                          <p className="font-medium">{result.fileName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total Pages</p>
                          <p className="font-medium">{result.pageCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Evaluation Date</p>
                          <p className="font-medium">{result.date.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total Issues</p>
                          <p className="font-medium">
                            {result.details.reduce((acc, page) => acc + page.issues.length, 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Issue Breakdown</h4>
                      <div className="space-y-2">
                        {['high', 'medium', 'low'].map(severity => {
                          const count = result.details.reduce(
                            (acc, page) => acc + page.issues.filter(issue => issue.severity === severity).length, 
                            0
                          );
                          
                          return count > 0 ? (
                            <div 
                              key={severity} 
                              className="flex justify-between items-center p-2 bg-gray-50 rounded"
                            >
                              <span className="capitalize">{severity} severity</span>
                              <Badge className={getSeverityColor(severity)}>{count}</Badge>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pages" className="space-y-4 p-4">
                    {result.details.map((page) => (
                      <div 
                        key={page.pageNumber} 
                        className="border rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 p-3 flex justify-between items-center">
                          <h4 className="font-medium">Page {page.pageNumber}</h4>
                          <Badge className={
                            page.score > 85 
                              ? 'bg-green-100 text-green-800' 
                              : page.score > 70 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-red-100 text-red-800'
                          }>
                            Score: {page.score}%
                          </Badge>
                        </div>
                        
                        {page.issues.length > 0 ? (
                          <div className="p-3 space-y-2">
                            <h5 className="text-sm font-medium">Issues Found</h5>
                            {page.issues.map((issue, index) => (
                              <div 
                                key={index} 
                                className="text-sm p-2 bg-gray-50 rounded"
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium">{issue.type}</span>
                                  <Badge className={getSeverityColor(issue.severity)}>
                                    {issue.severity}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 mt-1">{issue.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 text-sm text-gray-600">
                            No issues found on this page.
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-gray-600 hover:text-black hover:bg-watt-gold/10"
              onClick={onDownload}
            >
              <DownloadIcon className="h-3.5 w-3.5 mr-1.5" />
              Download Report
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ReportCard;
