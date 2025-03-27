
import { toast } from '@/hooks/use-toast';
import { Report, saveReport } from './mongoService';
import { useAuth } from '@/context/AuthContext';

interface ValidationResponse {
  fileName: string;
  generated_json: any;
  validation_result: {
    validation_report: Array<{
      field: string;
      json_value: any;
      pdf_value: any;
      valid: boolean;
    }>;
  };
  quality_report: {
    overall_score: number;
    status: 'success' | 'partial' | 'failed';
    page_results: Array<{
      pageNumber: number;
      status: 'pass' | 'warning' | 'fail';
      issues: string[];
      score: number;
    }>;
  };
}

export const uploadPDFFile = async (file: File, userId: string): Promise<Report | null> => {
  const formData = new FormData();
  formData.append('pdf_file', file);

  try {
    const response = await fetch('http://127.0.0.1:5000/validate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: ValidationResponse = await response.json();
    
    // Calculate the total number of invalid fields to determine issue count
    const invalidFields = data.validation_result.validation_report.filter(item => !item.valid).length;
    
    // Convert API response to our Report format
    const reportData: Omit<Report, 'id' | 'createdAt' | 'score'> = {
      userId: userId,
      fileName: data.fileName,
      status: data.quality_report.status,
      pageResults: data.quality_report.page_results.map(page => ({
        pageNumber: page.pageNumber,
        status: page.status,
        issues: page.issues
      }))
    };

    // Save to MongoDB service
    const savedReport = await saveReport(reportData);
    
    toast({
      title: "PDF Evaluation Complete",
      description: `Score: ${data.quality_report.overall_score}%. ${invalidFields} issues found.`,
    });

    return savedReport;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    toast({
      title: "Failed to process PDF",
      description: "Make sure the Flask API is running at http://127.0.0.1:5000",
      variant: "destructive"
    });
    return null;
  }
};

export const downloadReport = async (reportId: string): Promise<void> => {
  // In a real implementation, this would call an API endpoint that generates a PDF report
  // For now, we'll simulate it with a toast notification
  toast({
    title: "Report Download",
    description: `Report ${reportId} would be downloaded here`,
  });
};
