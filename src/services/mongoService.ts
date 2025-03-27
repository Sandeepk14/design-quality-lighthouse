
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

export const getReportsByDate = async (userId: string, date: Date): Promise<Report[]> => {
  // In a real app, this would be an API call to fetch from MongoDB with date filtering
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
  // In a real app, this would be an API call to fetch from MongoDB
  const report = reports.find(r => r.id === reportId);
  return report || null;
};

export const deleteReport = async (reportId: string): Promise<boolean> => {
  // In a real app, this would be an API call to delete from MongoDB
  const initialLength = reports.length;
  reports = reports.filter(r => r.id !== reportId);
  return reports.length < initialLength;
};

export const generateMockReport = (fileName: string, pageCount: number): Report['pageResults'] => {
  return Array.from({ length: pageCount }).map((_, index) => {
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
};

// import mongoose, { Schema, model, Document } from 'mongoose';
// import 'dotenv/config'; // Ensure environment variables are loaded
// import { connect } from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();


// // Securely load MongoDB URI from environment variables
// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error('❌ MongoDB connection string is missing. Set MONGO_URI in a .env file.');
//   process.exit(1);
// }

// // Connect to MongoDB with proper error handling
// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   } as mongoose.ConnectOptions)
//   .then(() => console.log('✅ MongoDB Connected Successfully'))
//   .catch((err) => {
//     console.error('❌ MongoDB Connection Error:', err);
//     process.exit(1);
//   });

// // Report Interface
// export interface Report {
//   userId: string;
//   fileName: string;
//   createdAt: Date;
//   status: 'success' | 'failed' | 'partial';
//   pageResults: {
//     pageNumber: number;
//     status: 'pass' | 'fail' | 'warning';
//     issues?: string[];
//   }[];
//   downloadUrl?: string;
// }

// // Mongoose Document Interface
// interface ReportDocument extends Report, Document {}

// // Mongoose Schema
// const reportSchema = new Schema<ReportDocument>(
//   {
//     userId: { type: String, required: true },
//     fileName: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//     status: { type: String, enum: ['success', 'failed', 'partial'], required: true },
//     pageResults: [
//       {
//         pageNumber: { type: Number, required: true },
//         status: { type: String, enum: ['pass', 'fail', 'warning'], required: true },
//         issues: { type: [String], default: [] },
//       },
//     ],
//     downloadUrl: { type: String },
//   },
//   { timestamps: true } // Adds createdAt & updatedAt timestamps
// );

// // Mongoose Model
// const ReportModel = model<ReportDocument>('Report', reportSchema);

// // Save a Report
// export const saveReport = async (report: Omit<Report, 'createdAt'>): Promise<Report> => {
//   try {
//     const newReport = new ReportModel({ ...report, createdAt: new Date() });
//     return await newReport.save();
//   } catch (error) {
//     console.error('❌ Error saving report:', error);
//     throw error;
//   }
// };

// // Get Reports by User ID
// export const getReportsByUser = async (userId: string): Promise<Report[]> => {
//   try {
//     return await ReportModel.find({ userId }).sort({ createdAt: -1 });
//   } catch (error) {
//     console.error('❌ Error fetching reports by user:', error);
//     throw error;
//   }
// };

// // Get Reports by Date
// export const getReportsByDate = async (userId: string, date: Date): Promise<Report[]> => {
//   try {
//     const startDate = new Date(date);
//     startDate.setHours(0, 0, 0, 0);

//     const endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + 1);

//     return await ReportModel.find({
//       userId,
//       createdAt: { $gte: startDate, $lt: endDate },
//     }).sort({ createdAt: -1 });
//   } catch (error) {
//     console.error('❌ Error fetching reports by date:', error);
//     throw error;
//   }
// };

// // Get Report by ID
// export const getReportById = async (reportId: string): Promise<Report | null> => {
//   try {
//     return await ReportModel.findById(reportId);
//   } catch (error) {
//     console.error('❌ Error fetching report by ID:', error);
//     throw error;
//   }
// };

// // Delete a Report
// export const deleteReport = async (reportId: string): Promise<boolean> => {
//   try {
//     const result = await ReportModel.deleteOne({ _id: reportId });
//     return result.deletedCount > 0;
//   } catch (error) {
//     console.error('❌ Error deleting report:', error);
//     throw error;
//   }
// };

// // Generate Mock Report Data
// export const generateMockReport = (fileName: string, pageCount: number): Report['pageResults'] => {
//   const statuses: ('pass' | 'fail' | 'warning')[] = ['pass', 'fail', 'warning'];

//   return Array.from({ length: pageCount }, (_, index) => {
//     const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

//     const issues =
//       randomStatus === 'pass'
//         ? []
//         : ['Inconsistent dimensions', 'Missing labels', 'Inadequate clearance', 'Incorrect distances']
//             .sort(() => 0.5 - Math.random()) // Shuffle issues
//             .slice(0, Math.floor(Math.random() * 3) + 1); // Pick 1-3 issues

//     return {
//       pageNumber: index + 1,
//       status: randomStatus,
//       issues: issues.length > 0 ? issues : undefined,
//     };
//   });
// };

// // Export Mongoose Model
// export default ReportModel;
