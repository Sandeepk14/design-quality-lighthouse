
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PageReportProps {
  fileName: string;
  pageNumber: number;
  status: 'pass' | 'fail' | 'warning';
  issues?: string[];
  onDownload: (pageNumber: number) => void;
}

const PageReport: React.FC<PageReportProps> = ({
  fileName,
  pageNumber,
  status,
  issues = [],
  onDownload
}) => {
  const getStatusIcon = () => {
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

  const getStatusColor = () => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className={`border ${getStatusColor()} shadow-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span>Page {pageNumber}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDownload(pageNumber)}
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {issues && issues.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium">Issues detected:</p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              {issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-gray-600">No issues detected</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PageReport;
