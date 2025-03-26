
// This is a mock MongoDB service
// In a real application, this would connect to a MongoDB instance via API endpoints

export interface Report {
  id: string;
  userId: string;
  fileName: string;
  createdAt: Date;
  status: 'success' | 'failed' | 'partial';
  pageResults: {
    pageNumber: number;
    status: 'pass' | 'fail' | 'warning';
    issues?: string[];
  }[];
  downloadUrl?: string;
}

// Mock database
let reports: Report[] = [];

export const saveReport = async (report: Omit<Report, 'id' | 'createdAt'>): Promise<Report> => {
  // In a real app, this would be an API call to save to MongoDB
  const newReport = {
    ...report,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date(),
  };
  
  reports.push(newReport);
  console.log('Report saved:', newReport);
  
  return newReport;
};

export const getReportsByUser = async (userId: string): Promise<Report[]> => {
  // In a real app, this would be an API call to fetch from MongoDB
  return reports.filter(report => report.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getReportById = async (reportId: string): Promise<Report | null> => {
  // In a real app, this would be an API call to fetch from MongoDB
  const report = reports.find(r => r.id === reportId);
  return report || null;
};
