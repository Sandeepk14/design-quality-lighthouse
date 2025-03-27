
import { toast } from '@/hooks/use-toast';
import { Report, saveReport } from './mongoService';

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

// Check if the Flask API is running
const checkApiConnection = async (): Promise<boolean> => {
  try {
    // Simple HEAD request to check if the server is up
    const response = await fetch('http://127.0.0.1:5000', {
      method: 'HEAD',
      // Adding mode: 'no-cors' to handle CORS issues in development
      mode: 'no-cors'
    });
    
    return true; // If we reach here, the connection was made
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
};

export const uploadPDFFile = async (file: File, userId: string): Promise<Report | null> => {
  const formData = new FormData();
  formData.append('pdf_file', file);
  
  try {
    // First check if the API is running
    const isApiRunning = await checkApiConnection();
    if (!isApiRunning) {
      toast({
        title: "API not available",
        description: "The Flask API at http://127.0.0.1:5000 is not running. Please start the API server.",
        variant: "destructive"
      });
      
      // For demo purposes, generate a mock report when API is not available
      return createMockReport(file.name, userId);
    }
    
    const response = await fetch('http://127.0.0.1:5000/validate', {
      method: 'POST',
      body: formData,
      // Adding mode: 'no-cors' to handle CORS issues in development
      mode: 'no-cors'
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
      description: "Using mock data for demonstration. In production, make sure the Flask API is running.",
      variant: "destructive"
    });
    
    // For development/demo, create a mock report when the API fails
    return createMockReport(file.name, userId);
  }
};

// Create a mock report for demonstration when the Flask API is not available
const createMockReport = async (fileName: string, userId: string): Promise<Report> => {
  const mockReportData: Omit<Report, 'id' | 'createdAt' | 'score'> = {
    userId: userId,
    fileName: fileName,
    status: 'partial',
    pageResults: [
      {
        pageNumber: 1,
        status: 'pass',
        issues: []
      },
      {
        pageNumber: 2,
        status: 'warning',
        issues: ['Module specifications do not match county requirements']
      },
      {
        pageNumber: 3,
        status: 'fail',
        issues: [
          'Missing electrical diagram',
          'Inverter specifications incomplete',
          'Missing AHJ approval stamp'
        ]
      }
    ]
  };
  
  // Save the mock report to the database
  return await saveReport(mockReportData);
};

export const downloadReport = async (reportId: string): Promise<void> => {
  // In a real implementation, this would call an API endpoint that generates a PDF report
  // For now, we'll simulate it with a toast notification
  toast({
    title: "Report Download",
    description: `Report ${reportId} would be downloaded here`,
  });
};
