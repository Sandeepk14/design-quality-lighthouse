
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download,
  FileText,
  BarChart,
  ExternalLink
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PDFReportProps {
  id: string;
  fileName: string;
  status: 'success' | 'failed' | 'partial';
  score: number;
  createdAt: Date;
  pageCount: number;
  issueCount: number;
  onViewDetails: (reportId: string) => void;
  onDownload: (reportId: string) => void;
}

const PDFReport: React.FC<PDFReportProps> = ({
  id,
  fileName,
  status,
  score,
  createdAt,
  pageCount,
  issueCount,
  onViewDetails,
  onDownload
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'partial':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Pass';
      case 'failed':
        return 'Failed';
      case 'partial':
        return 'Needs Review';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'partial':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <div className="flex items-center gap-2 truncate max-w-[70%]" title={fileName}>
            <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{fileName}</span>
          </div>
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-1">{score}%</span>
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium">{getStatusText()}</p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-medium">{formatDate(createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-500">Pages</p>
            <p className="font-medium">{pageCount}</p>
          </div>
          <div>
            <p className="text-gray-500">Issues</p>
            <p className="font-medium">{issueCount}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(id)}
          className="flex gap-1 items-center"
        >
          <BarChart className="h-4 w-4" />
          View Details
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDownload(id)}
          className="flex gap-1 items-center"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PDFReport;
