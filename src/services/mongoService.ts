
// This is a service to interact with MongoDB Atlas
// In a production app, these calls would go to a backend API that connects to MongoDB

export interface Report {
  id: string;
  userId: string;
  fileName: string;
  createdAt: Date;
  status: 'success' | 'failed' | 'partial';
  score: number;
  pageResults: {
    pageNumber: number;
    status: 'pass' | 'fail' | 'warning';
    issues?: string[];
  }[];
  downloadUrl?: string;
}

// Mock database for frontend
let reports: Report[] = [];

// MongoDB connection string (would be used in backend)
// const MONGODB_URI = "mongodb+srv://skraj5873:<db_password>@cluster0.bpjwvvw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const saveReport = async (report: Omit<Report, 'id' | 'createdAt' | 'score'>): Promise<Report> => {
  // Calculate overall score based on page results
  const totalPages = report.pageResults.length;
  const passedPages = report.pageResults.filter(page => page.status === 'pass').length;
  const warningPages = report.pageResults.filter(page => page.status === 'warning').length;
  
  // Score calculation: passed pages = 100%, warning pages = 50%, failed pages = 0%
  const score = Math.round(((passedPages * 100) + (warningPages * 50)) / totalPages);
  
  // In a real app, this would be an API call to save to MongoDB Atlas
  const newReport = {
    ...report,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date(),
    score
  };
  
  reports.push(newReport);
  console.log('Report saved:', newReport);
  
  return newReport;
};

export const getReportsByUser = async (userId: string): Promise<Report[]> => {
  // In a real app, this would be an API call to fetch from MongoDB Atlas
  return reports.filter(report => report.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getReportsByDate = async (userId: string, date: Date): Promise<Report[]> => {
  // In a real app, this would be an API call to fetch from MongoDB Atlas with date filtering
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);
  
  return reports.filter(report => {
    return report.userId === userId &&
           report.createdAt >= targetDate &&
           report.createdAt < nextDay;
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getReportById = async (reportId: string): Promise<Report | null> => {
  // In a real app, this would be an API call to fetch from MongoDB Atlas
  const report = reports.find(r => r.id === reportId);
  return report || null;
};

export const deleteReport = async (reportId: string): Promise<boolean> => {
  // In a real app, this would be an API call to delete from MongoDB Atlas
  const initialLength = reports.length;
  reports = reports.filter(r => r.id !== reportId);
  return reports.length < initialLength;
};

// Add user management functions
interface User {
  id: string;
  email: string;
  name?: string;
  password: string; // In a real app this would be hashed
}

let users: User[] = [];

export const createUser = async (email: string, password: string, name?: string): Promise<User> => {
  // In a real app, this would be an API call to save to MongoDB Atlas with password hashing
  const newUser = {
    id: Math.random().toString(36).substring(2, 9),
    email,
    password, // Would be hashed in a real app
    name
  };
  
  users.push(newUser);
  console.log('User created:', newUser);
  
  return newUser;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  // In a real app, this would be an API call to fetch from MongoDB Atlas
  const user = users.find(u => u.email === email);
  return user || null;
};

export const validateUserCredentials = async (email: string, password: string): Promise<User | null> => {
  // In a real app, this would be an API call with proper password validation
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

// For demo purposes, let's add some mock users
users.push({
  id: '123',
  email: 'user@example.com', 
  password: 'password123',
  name: 'Demo User'
});
