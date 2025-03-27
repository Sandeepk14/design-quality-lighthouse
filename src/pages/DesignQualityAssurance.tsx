// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import FileUploader from "@/components/FileUploader";
// import { useAuth } from "@/context/AuthContext";
// import {
//   saveReport,
//   getReportsByUser,
//   getReportsByDate,
//   generateMockReport,
//   Report,
// } from "@/services/mongoService";
// import { toast } from "@/hooks/use-toast";
// import {
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Download,
//   FileText,
//   LogOut,
//   Loader,
//   Calendar,
//   RefreshCw,
// } from "lucide-react";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import PageReport from "@/components/PageReport";
// import DateSelector from "@/components/DateSelector";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// interface PageResult {
//   pageNumber: number;
//   status: "pass" | "fail" | "warning";
//   issues?: string[];
// }

// interface FileUploadResult {
//   fileName: string;
//   status: "processing" | "completed" | "failed";
//   progress: number;
//   results?: PageResult[];
//   error?: string;
// }

// const DesignQualityAssurance: React.FC = () => {
//   const { user, logout } = useAuth();
//   const [files, setFiles] = useState<File[]>([]);
//   const [uploadResults, setUploadResults] = useState<FileUploadResult[]>([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [savedReports, setSavedReports] = useState<Report[]>([]);
//   const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
//   const [isLoadingReports, setIsLoadingReports] = useState(false);
//   const [activeTab, setActiveTab] = useState("upload");

//   // Load saved reports on component mount
//   useEffect(() => {
//     if (user) {
//       loadReports();
//     }
//   }, [user]);

//   // Load reports when filter date changes
//   useEffect(() => {
//     if (user) {
//       loadReports();
//     }
//   }, [filterDate]);

//   const loadReports = async () => {
//     if (!user) return;

//     setIsLoadingReports(true);
//     try {
//       let reports;
//       if (filterDate) {
//         reports = await getReportsByDate(user.id, filterDate);
//       } else {
//         reports = await getReportsByUser(user.id);
//       }
//       setSavedReports(reports);
//     } catch (error) {
//       console.error("Error loading reports:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load saved reports",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoadingReports(false);
//     }
//   };

//   const handleFilesAdded = (newFiles: File[]) => {
//     if (isProcessing) return;

//     setFiles((prevFiles) => {
//       // Filter out duplicates (files with the same name)
//       const existingFileNames = prevFiles.map((f) => f.name);
//       const uniqueNewFiles = newFiles.filter(
//         (f) => !existingFileNames.includes(f.name)
//       );

//       return [...prevFiles, ...uniqueNewFiles];
//     });

//     // Initialize upload results
//     setUploadResults((prev) => {
//       const newResults = newFiles.map((file) => ({
//         fileName: file.name,
//         status: "processing" as const,
//         progress: 0,
//       }));

//       return [...prev, ...newResults];
//     });
//   };

//   const processFiles = async () => {
//     if (files.length === 0) {
//       toast({
//         title: "No files to process",
//         description: "Please upload PDF files first.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsProcessing(true);

//     // Process each file
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];

//       // Update progress
//       setUploadResults((prev) => {
//         const updated = [...prev];
//         const index = updated.findIndex(
//           (result) => result.fileName === file.name
//         );
//         if (index !== -1) {
//           updated[index] = { ...updated[index], progress: 10 };
//         }
//         return updated;
//       });

//       // Simulate file processing (in a real app, this would call an API)
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update progress to 50%
//       setUploadResults((prev) => {
//         const updated = [...prev];
//         const index = updated.findIndex(
//           (result) => result.fileName === file.name
//         );
//         if (index !== -1) {
//           updated[index] = { ...updated[index], progress: 50 };
//         }
//         return updated;
//       });

//       // Simulate more processing time
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Generate mock results
//       const pageCount = Math.floor(Math.random() * 10) + 3; // 3-12 pages
//       const mockResults = generateMockReport(file.name, pageCount);

//       // Update to completed with results
//       setUploadResults((prev) => {
//         const updated = [...prev];
//         const index = updated.findIndex(
//           (result) => result.fileName === file.name
//         );
//         if (index !== -1) {
//           updated[index] = {
//             ...updated[index],
//             status: "completed",
//             progress: 100,
//             results: mockResults,
//           };
//         }
//         return updated;
//       });

//       // Save report to MongoDB (mock)
//       if (user) {
//         const overallStatus = mockResults.every((r) => r.status === "pass")
//           ? "success"
//           : mockResults.some((r) => r.status === "fail")
//           ? "failed"
//           : "partial";

//         await saveReport({
//           userId: user.id,
//           fileName: file.name,
//           status: overallStatus,
//           pageResults: mockResults,
//           downloadUrl: "#", // This would be a real URL in a production app
//         });
//       }
//     }

//     toast({
//       title: "Processing complete",
//       description: `Successfully processed ${files.length} files.`,
//     });

//     // Refresh the reports list
//     loadReports();
//     setIsProcessing(false);
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "pass":
//       case "success":
//         return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case "fail":
//       case "failed":
//         return <XCircle className="h-5 w-5 text-red-500" />;
//       case "warning":
//       case "partial":
//         return <AlertTriangle className="h-5 w-5 text-amber-500" />;
//       default:
//         return null;
//     }
//   };

//   const handleReset = () => {
//     setFiles([]);
//     setUploadResults([]);
//   };

//   const downloadFullReport = (fileName: string) => {
//     toast({
//       title: "Report downloaded",
//       description: `Full report for ${fileName} has been downloaded.`,
//     });
//   };

//   const downloadPageReport = (fileName: string, pageNumber: number) => {
//     toast({
//       title: "Page report downloaded",
//       description: `Report for ${fileName} - Page ${pageNumber} has been downloaded.`,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <Link to="/" className="flex items-center gap-2">
//             <span className="font-bold text-xl tracking-tight">WATTMONK</span>
//           </Link>

//           <NavigationMenu>
//             <NavigationMenuList>
//               <NavigationMenuItem>
//                 <NavigationMenuTrigger>
//                   {user?.email || "Account"}
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <div className="w-[200px] p-2">
//                     <Button
//                       variant="ghost"
//                       className="w-full justify-start"
//                       onClick={logout}
//                     >
//                       <LogOut className="mr-2 h-4 w-4" />
//                       Logout
//                     </Button>
//                   </div>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//             </NavigationMenuList>
//           </NavigationMenu>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6">Design Quality Assurance</h1>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
//           <TabsList className="grid w-full max-w-md grid-cols-2">
//             <TabsTrigger value="upload">Upload & Process</TabsTrigger>
//             <TabsTrigger value="reports">View Reports</TabsTrigger>
//           </TabsList>

//           <TabsContent value="upload" className="mt-4">
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="p-6">
//                 <h2 className="text-lg font-medium mb-4">Upload Files</h2>

//                 <FileUploader
//                   onFilesAdded={handleFilesAdded}
//                   maxSize={50 * 1024 * 1024} // 50MB
//                 />

//                 <div className="mt-6 flex flex-wrap gap-4">
//                   <Button
//                     onClick={processFiles}
//                     disabled={files.length === 0 || isProcessing}
//                     className="bg-amber-500 hover:bg-amber-600"
//                   >
//                     {isProcessing ? (
//                       <>
//                         <Loader className="mr-2 h-4 w-4 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       "Analyze Documents"
//                     )}
//                   </Button>

//                   <Button
//                     variant="outline"
//                     onClick={handleReset}
//                     disabled={files.length === 0 || isProcessing}
//                   >
//                     Reset
//                   </Button>
//                 </div>
//               </div>

//               {/* File List */}
//               {uploadResults.length > 0 && (
//                 <div className="border-t">
//                   <div className="p-6">
//                     <h2 className="text-lg font-medium mb-4">Uploaded Files</h2>

//                     <div className="space-y-6">
//                       {uploadResults.map((result, index) => (
//                         <div key={index} className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex items-center justify-between mb-2">
//                             <div className="flex items-center">
//                               <FileText className="h-5 w-5 text-gray-400 mr-2" />
//                               <span className="font-medium">
//                                 {result.fileName}
//                               </span>
//                             </div>

//                             {result.status === "completed" && (
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() =>
//                                   downloadFullReport(result.fileName)
//                                 }
//                               >
//                                 <Download className="h-4 w-4 mr-2" />
//                                 Download Full Report
//                               </Button>
//                             )}
//                           </div>

//                           {/* Progress bar */}
//                           <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
//                             <div
//                               className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
//                               style={{ width: `${result.progress}%` }}
//                             ></div>
//                           </div>

//                           {/* Status */}
//                           <div className="text-sm text-gray-500">
//                             {result.status === "processing" ? (
//                               <span>Processing... {result.progress}%</span>
//                             ) : result.status === "completed" ? (
//                               <span className="text-green-500">Completed</span>
//                             ) : (
//                               <span className="text-red-500">
//                                 Failed: {result.error}
//                               </span>
//                             )}
//                           </div>

//                           {/* Results */}
//                           {result.results && result.results.length > 0 && (
//                             <div className="mt-4">
//                               <h3 className="font-medium mb-2">
//                                 Page Analysis
//                               </h3>

//                               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                                 {result.results.map((pageResult) => (
//                                   <PageReport
//                                     key={pageResult.pageNumber}
//                                     fileName={result.fileName}
//                                     pageNumber={pageResult.pageNumber}
//                                     status={pageResult.status}
//                                     issues={pageResult.issues}
//                                     onDownload={(pageNumber) =>
//                                       downloadPageReport(
//                                         result.fileName,
//                                         pageNumber
//                                       )
//                                     }
//                                   />
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="reports" className="mt-4">
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="p-6">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//                   <h2 className="text-lg font-medium">Saved Reports</h2>

//                   <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
//                     <div className="w-full sm:w-48">
//                       <DateSelector
//                         date={filterDate}
//                         onDateChange={setFilterDate}
//                       />
//                     </div>

//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         setFilterDate(undefined);
//                       }}
//                       className="whitespace-nowrap"
//                     >
//                       Clear Filter
//                     </Button>

//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={loadReports}
//                       disabled={isLoadingReports}
//                       className="w-10 h-10 p-0 rounded-full"
//                     >
//                       <RefreshCw
//                         className={`h-5 w-5 ${
//                           isLoadingReports ? "animate-spin" : ""
//                         }`}
//                       />
//                     </Button>
//                   </div>
//                 </div>

//                 {savedReports.length > 0 ? (
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>File Name</TableHead>
//                         <TableHead>Date</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Pages</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {savedReports.map((report) => (
//                         <TableRow key={report.id}>
//                           <TableCell className="font-medium">
//                             {report.fileName}
//                           </TableCell>
//                           <TableCell>
//                             {new Date(report.createdAt).toLocaleString()}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-1">
//                               {getStatusIcon(report.status)}
//                               <span>
//                                 {report.status === "success"
//                                   ? "Passed"
//                                   : report.status === "failed"
//                                   ? "Failed"
//                                   : "Needs Review"}
//                               </span>
//                             </div>
//                           </TableCell>
//                           <TableCell>{report.pageResults.length}</TableCell>
//                           <TableCell className="text-right">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() =>
//                                 downloadFullReport(report.fileName)
//                               }
//                             >
//                               <Download className="h-4 w-4 mr-2" />
//                               Download
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 ) : (
//                   <div className="text-center py-12 text-gray-500">
//                     {isLoadingReports ? (
//                       <div className="flex flex-col items-center gap-2">
//                         <Loader className="h-8 w-8 animate-spin text-amber-500" />
//                         <p>Loading reports...</p>
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center gap-2">
//                         <FileText className="h-12 w-12 text-gray-300" />
//                         <p className="text-lg font-medium">No reports found</p>
//                         <p className="text-sm">
//                           {filterDate
//                             ? `No reports found for ${filterDate.toLocaleDateString()}`
//                             : "Upload and process files to generate reports"}
//                         </p>
//                         {filterDate && (
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setFilterDate(undefined)}
//                             className="mt-2"
//                           >
//                             Clear Filter
//                           </Button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// };

// export default DesignQualityAssurance;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import FileUploader from "@/components/FileUploader";
// import { useAuth } from "@/context/AuthContext";
// import {
//   saveReport,
//   getReportsByUser,
//   getReportsByDate,
//   Report,
// } from "@/services/mongoService";
// import { toast } from "@/hooks/use-toast";
// import {
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Download,
//   FileText,
//   LogOut,
//   Loader,
//   RefreshCw,
// } from "lucide-react";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import DateSelector from "@/components/DateSelector";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // Define the shape of the API response
// interface APIResponse {
//   generated_json: {
//     project: {
//       address: string;
//       contact: {
//         email: string;
//         phone: string;
//       };
//       name: string;
//       regulations: {
//         ahj: string;
//         codes: string[];
//         utility_provider: string;
//       };
//       system_info: {
//         ac_system_size_kwac: number;
//         date: string;
//         dc_system_size_kwdc: number;
//         esi_id: number;
//         installer: string;
//         meter_number: number;
//         nabcep_badge: number;
//       };
//       technical_specifications: number;
//     };
//   };
//   validation_result: {
//     validation_report: {
//       field: string;
//       json_value: number;
//       pdf_value: number;
//       valid: boolean;
//     }[];
//   };
// }

// // Update FileUploadResult to store the API response
// interface FileUploadResult {
//   fileName: string;
//   status: "processing" | "completed" | "failed";
//   progress: number;
//   apiResponse?: APIResponse;
//   error?: string;
// }

// const DesignQualityAssurance: React.FC = () => {
//   const { user, logout } = useAuth();
//   const [files, setFiles] = useState<File[]>([]);
//   const [uploadResults, setUploadResults] = useState<FileUploadResult[]>([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [savedReports, setSavedReports] = useState<Report[]>([]);
//   const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
//   const [isLoadingReports, setIsLoadingReports] = useState(false);
//   const [activeTab, setActiveTab] = useState("upload");

//   // Load saved reports on component mount
//   useEffect(() => {
//     if (user) {
//       loadReports();
//     }
//   }, [user]);

//   // Load reports when filter date changes
//   useEffect(() => {
//     if (user) {
//       loadReports();
//     }
//   }, [filterDate]);

//   const loadReports = async () => {
//     if (!user) return;

//     setIsLoadingReports(true);
//     try {
//       let reports;
//       if (filterDate) {
//         reports = await getReportsByDate(user.id, filterDate);
//       } else {
//         reports = await getReportsByUser(user.id);
//       }
//       setSavedReports(reports);
//     } catch (error) {
//       console.error("Error loading reports:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load saved reports",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoadingReports(false);
//     }
//   };

//   const handleFilesAdded = (newFiles: File[]) => {
//     if (isProcessing) return;

//     setFiles((prevFiles) => {
//       // Filter out duplicates (files with the same name)
//       const existingFileNames = prevFiles.map((f) => f.name);
//       const uniqueNewFiles = newFiles.filter(
//         (f) => !existingFileNames.includes(f.name)
//       );
//       return [...prevFiles, ...uniqueNewFiles];
//     });

//     // Initialize upload results
//     setUploadResults((prev) => {
//       const newResults = newFiles.map((file) => ({
//         fileName: file.name,
//         status: "processing" as const,
//         progress: 0,
//       }));
//       return [...prev, ...newResults];
//     });
//   };

//   // Process a single file by calling the API
//   const processSingleFile = async (file: File) => {
//     // Update progress to 10%
//     setUploadResults((prev) => {
//       const updated = [...prev];
//       const index = updated.findIndex(
//         (result) => result.fileName === file.name
//       );
//       if (index !== -1) {
//         updated[index] = { ...updated[index], progress: 10 };
//       }
//       return updated;
//     });

//     // Optionally, simulate a delay (e.g., reading or preparing file)
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     // Update progress to 50%
//     setUploadResults((prev) => {
//       const updated = [...prev];
//       const index = updated.findIndex(
//         (result) => result.fileName === file.name
//       );
//       if (index !== -1) {
//         updated[index] = { ...updated[index], progress: 50 };
//       }
//       return updated;
//     });

//     // Create a FormData object for file upload
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://127.0.0.1:5000/validate", {
//         method: "POST",
//         body: formData,
//       });
//       const apiResponse: APIResponse = await response.json();

//       // Update progress to 100% and mark as completed
//       setUploadResults((prev) => {
//         const updated = [...prev];
//         const index = updated.findIndex(
//           (result) => result.fileName === file.name
//         );
//         if (index !== -1) {
//           updated[index] = {
//             ...updated[index],
//             status: "completed",
//             progress: 100,
//             apiResponse,
//           };
//         }
//         return updated;
//       });

//       // Determine overall status from validation report
//       const overallStatus =
//         apiResponse.validation_result.validation_report.every(
//           (item) => item.valid === true
//         )
//           ? "success"
//           : "failed";

//       // Save report (for demo purposes, we save the file name and overall status)
//       if (user) {
//         await saveReport({
//           userId: user.id,
//           fileName: file.name,
//           status: overallStatus,
//           pageResults: [], // You may wish to adapt this to store details from apiResponse
//           downloadUrl: "#",
//         });
//       }
//     } catch (error: unknown) {
//       console.error("Error processing file:", error);
//       setUploadResults((prev) => {
//         const updated = [...prev];
//         const index = updated.findIndex(
//           (result) => result.fileName === file.name
//         );
//         if (index !== -1) {
//           updated[index] = {
//             ...updated[index],
//             status: "failed",
//             error: error instanceof Error ? error.message : "Unknown error",
//           };
//         }
//         return updated;
//       });
//     }
//   };

//   const processFiles = async () => {
//     if (files.length === 0) {
//       toast({
//         title: "No files to process",
//         description: "Please upload PDF files first.",
//         variant: "destructive",
//       });
//       return;
//     }
//     setIsProcessing(true);

//     // Process each file sequentially or in parallel
//     for (const file of files) {
//       await processSingleFile(file);
//     }

//     toast({
//       title: "Processing complete",
//       description: `Successfully processed ${files.length} file(s).`,
//     });

//     // Refresh the reports list
//     loadReports();
//     setIsProcessing(false);
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "pass":
//       case "success":
//         return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case "fail":
//       case "failed":
//         return <XCircle className="h-5 w-5 text-red-500" />;
//       case "warning":
//       case "partial":
//         return <AlertTriangle className="h-5 w-5 text-amber-500" />;
//       default:
//         return null;
//     }
//   };

//   const handleReset = () => {
//     setFiles([]);
//     setUploadResults([]);
//   };

//   const downloadFullReport = (fileName: string) => {
//     toast({
//       title: "Report downloaded",
//       description: `Full report for ${fileName} has been downloaded.`,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <Link to="/" className="flex items-center gap-2">
//             <span className="font-bold text-xl tracking-tight">WATTMONK</span>
//           </Link>

//           <NavigationMenu>
//             <NavigationMenuList>
//               <NavigationMenuItem>
//                 <NavigationMenuTrigger>
//                   {user?.email || "Account"}
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <div className="w-[200px] p-2">
//                     <Button
//                       variant="ghost"
//                       className="w-full justify-start"
//                       onClick={logout}
//                     >
//                       <LogOut className="mr-2 h-4 w-4" />
//                       Logout
//                     </Button>
//                   </div>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//             </NavigationMenuList>
//           </NavigationMenu>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6">Design Quality Assurance</h1>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
//           <TabsList className="grid w-full max-w-md grid-cols-2">
//             <TabsTrigger value="upload">Upload & Process</TabsTrigger>
//             <TabsTrigger value="reports">View Reports</TabsTrigger>
//           </TabsList>

//           <TabsContent value="upload" className="mt-4">
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="p-6">
//                 <h2 className="text-lg font-medium mb-4">Upload Files</h2>
//                 <FileUploader
//                   onFilesAdded={handleFilesAdded}
//                   maxSize={50 * 1024 * 1024} // 50MB
//                 />
//                 <div className="mt-6 flex flex-wrap gap-4">
//                   <Button
//                     onClick={processFiles}
//                     disabled={files.length === 0 || isProcessing}
//                     className="bg-amber-500 hover:bg-amber-600"
//                   >
//                     {isProcessing ? (
//                       <>
//                         <Loader className="mr-2 h-4 w-4 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       "Analyze Documents"
//                     )}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={handleReset}
//                     disabled={files.length === 0 || isProcessing}
//                   >
//                     Reset
//                   </Button>
//                 </div>
//               </div>

//               {/* File List with API results */}
//               {uploadResults.length > 0 && (
//                 <div className="border-t">
//                   <div className="p-6">
//                     <h2 className="text-lg font-medium mb-4">Uploaded Files</h2>
//                     <div className="space-y-6">
//                       {uploadResults.map((result, index) => (
//                         <div key={index} className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex items-center justify-between mb-2">
//                             <div className="flex items-center">
//                               <FileText className="h-5 w-5 text-gray-400 mr-2" />
//                               <span className="font-medium">
//                                 {result.fileName}
//                               </span>
//                             </div>
//                             {result.status === "completed" && (
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() =>
//                                   downloadFullReport(result.fileName)
//                                 }
//                               >
//                                 <Download className="h-4 w-4 mr-2" />
//                                 Download Full Report
//                               </Button>
//                             )}
//                           </div>

//                           {/* Progress Bar */}
//                           <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
//                             <div
//                               className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
//                               style={{ width: `${result.progress}%` }}
//                             ></div>
//                           </div>

//                           {/* Status */}
//                           <div className="text-sm text-gray-500 mb-4">
//                             {result.status === "processing" ? (
//                               <span>Processing... {result.progress}%</span>
//                             ) : result.status === "completed" ? (
//                               <span className="text-green-500">Completed</span>
//                             ) : (
//                               <span className="text-red-500">
//                                 Failed: {result.error}
//                               </span>
//                             )}
//                           </div>

//                           {/* Display API response details if available */}
//                           {result.apiResponse && (
//                             <div className="mt-4">
//                               <h3 className="font-medium mb-2">
//                                 Project Details
//                               </h3>
//                               <div className="bg-white p-4 border rounded mb-4">
//                                 <p>
//                                   <strong>Name:</strong>{" "}
//                                   {
//                                     result.apiResponse.generated_json.project
//                                       .name
//                                   }
//                                 </p>
//                                 <p>
//                                   <strong>Address:</strong>{" "}
//                                   {
//                                     result.apiResponse.generated_json.project
//                                       .address
//                                   }
//                                 </p>
//                                 <p>
//                                   <strong>Contact Email:</strong>{" "}
//                                   {
//                                     result.apiResponse.generated_json.project
//                                       .contact.email
//                                   }
//                                 </p>
//                                 <p>
//                                   <strong>Contact Phone:</strong>{" "}
//                                   {
//                                     result.apiResponse.generated_json.project
//                                       .contact.phone
//                                   }
//                                 </p>
//                                 <p>
//                                   <strong>Installer:</strong>{" "}
//                                   {
//                                     result.apiResponse.generated_json.project
//                                       .system_info.installer
//                                   }
//                                 </p>
//                                 <p>
//                                   <strong>Date (JSON):</strong>{" "}
//                                   {
//                                     result.apiResponse.generated_json.project
//                                       .system_info.date
//                                   }
//                                 </p>
//                               </div>

//                               <h3 className="font-medium mb-2">
//                                 Validation Report
//                               </h3>
//                               <div className="overflow-x-auto">
//                                 <Table>
//                                   <TableHeader>
//                                     <TableRow>
//                                       <TableHead>Field</TableHead>
//                                       <TableHead>JSON Value</TableHead>
//                                       <TableHead>PDF Value</TableHead>
//                                       <TableHead>Status</TableHead>
//                                     </TableRow>
//                                   </TableHeader>
//                                   <TableBody>
//                                     {result.apiResponse.validation_result.validation_report.map(
//                                       (item, idx) => (
//                                         <TableRow key={idx}>
//                                           <TableCell>{item.field}</TableCell>
//                                           <TableCell>
//                                             {item.json_value.toString()}
//                                           </TableCell>
//                                           <TableCell>
//                                             {item.pdf_value.toString()}
//                                           </TableCell>
//                                           <TableCell>
//                                             {item.valid ? (
//                                               <CheckCircle className="h-5 w-5 text-green-500" />
//                                             ) : (
//                                               <XCircle className="h-5 w-5 text-red-500" />
//                                             )}
//                                           </TableCell>
//                                         </TableRow>
//                                       )
//                                     )}
//                                   </TableBody>
//                                 </Table>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="reports" className="mt-4">
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="p-6">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//                   <h2 className="text-lg font-medium">Saved Reports</h2>
//                   <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
//                     <div className="w-full sm:w-48">
//                       <DateSelector
//                         date={filterDate}
//                         onDateChange={setFilterDate}
//                       />
//                     </div>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setFilterDate(undefined)}
//                       className="whitespace-nowrap"
//                     >
//                       Clear Filter
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={loadReports}
//                       disabled={isLoadingReports}
//                       className="w-10 h-10 p-0 rounded-full"
//                     >
//                       <RefreshCw
//                         className={`h-5 w-5 ${
//                           isLoadingReports ? "animate-spin" : ""
//                         }`}
//                       />
//                     </Button>
//                   </div>
//                 </div>
//                 {savedReports.length > 0 ? (
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>File Name</TableHead>
//                         <TableHead>Date</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Pages</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {savedReports.map((report) => (
//                         <TableRow key={report.id}>
//                           <TableCell className="font-medium">
//                             {report.fileName}
//                           </TableCell>
//                           <TableCell>
//                             {new Date(report.createdAt).toLocaleString()}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-1">
//                               {getStatusIcon(report.status)}
//                               <span>
//                                 {report.status === "success"
//                                   ? "Passed"
//                                   : report.status === "failed"
//                                   ? "Failed"
//                                   : "Needs Review"}
//                               </span>
//                             </div>
//                           </TableCell>
//                           <TableCell>{report.pageResults.length}</TableCell>
//                           <TableCell className="text-right">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() =>
//                                 downloadFullReport(report.fileName)
//                               }
//                             >
//                               <Download className="h-4 w-4 mr-2" />
//                               Download
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 ) : (
//                   <div className="text-center py-12 text-gray-500">
//                     {isLoadingReports ? (
//                       <div className="flex flex-col items-center gap-2">
//                         <Loader className="h-8 w-8 animate-spin text-amber-500" />
//                         <p>Loading reports...</p>
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center gap-2">
//                         <FileText className="h-12 w-12 text-gray-300" />
//                         <p className="text-lg font-medium">No reports found</p>
//                         <p className="text-sm">
//                           {filterDate
//                             ? `No reports found for ${filterDate.toLocaleDateString()}`
//                             : "Upload and process files to generate reports"}
//                         </p>
//                         {filterDate && (
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setFilterDate(undefined)}
//                             className="mt-2"
//                           >
//                             Clear Filter
//                           </Button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// };

// export default DesignQualityAssurance;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { useAuth } from "@/context/AuthContext";
import {
  saveReport,
  getReportsByUser,
  getReportsByDate,
  Report,
} from "@/services/mongoService";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  FileText,
  LogOut,
  Loader,
  RefreshCw,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DateSelector from "@/components/DateSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface APIResponse {
  generated_json: {
    project: {
      address: string;
      contact: {
        email: string;
        phone: string;
      };
      name: string;
      regulations: {
        ahj: string;
        codes: string[];
        utility_provider: string;
      };
      system_info: {
        ac_system_size_kwac: number;
        date: string;
        dc_system_size_kwdc: number;
        esi_id: number | null;
        installer: string;
        meter_number: number | null;
        nabcep_badge: number | null;
      };
      technical_specifications: {
        electrical: {
          main_breaker_rating_a: number;
          main_panel_brand: string;
          main_service_panel_a: number;
          main_service_voltage_v: number;
          service_feed_source: string;
          voltage_drop_percent: number;
        };
        inverters: {
          existing_inverters: {
            manufacturer: string;
            model: string;
            quantity: number;
          };
          manufacturer: string;
          model: string;
          quantity: number;
        };
        modules: {
          existing_modules: {
            manufacturer: string;
            model: string;
            quantity: number;
          };
          manufacturer: string;
          model: string;
          module_dimensions: string;
          module_weight_lbs: number;
          panel_wattage_w: number;
          quantity: number;
        };
        mounting: {
          rafter_size: string;
          rafter_spacing: string;
          roof_tilt_degrees: number;
          roof_type: string;
        };
      };
    };
  };
  validation_result: {
    validation_report: {
      field: string;
      json_value: string | number | null;
      pdf_value: string | number | null;
      valid: boolean;
    }[];
  };
}

interface FileUploadResult {
  fileName: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  apiResponse?: APIResponse;
  error?: string;
}

// Helper functions outside the component
const groupByCategory = (
  validationReport: {
    field: string;
    json_value: string | number | null;
    pdf_value: string | number | null;
    valid: boolean;
  }[]
) => {
  return validationReport.reduce((acc, item) => {
    const category = item.field.split(".").slice(0, -1).join(".");
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
};

const formatCategoryName = (category: string) => {
  return category
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" > ")
    .replace(/_/g, " ");
};

const formatFieldName = (fieldPath: string) => {
  const parts = fieldPath.split(".");
  return parts[parts.length - 1]
    .replace(/_/g, " ")
    .replace(/(^|\s)\S/g, (l) => l.toUpperCase());
};

const formatValue = (value: string | number | null | undefined | string[]) => {
  if (value === null || value === undefined) return "N/A";
  if (Array.isArray(value)) return value.join(", ");
  return value.toString();
};

const DesignQualityAssurance: React.FC = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadResults, setUploadResults] = useState<FileUploadResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedReports, setSavedReports] = useState<Report[]>([]);
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

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
        variant: "destructive",
      });
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleFilesAdded = (newFiles: File[]) => {
    if (isProcessing) return;

    setFiles((prevFiles) => {
      const existingFileNames = prevFiles.map((f) => f.name);
      const uniqueNewFiles = newFiles.filter(
        (f) => !existingFileNames.includes(f.name)
      );
      return [...prevFiles, ...uniqueNewFiles];
    });

    setUploadResults((prev) => {
      const newResults = newFiles.map((file) => ({
        fileName: file.name,
        status: "processing" as const,
        progress: 0,
      }));
      return [...prev, ...newResults];
    });
  };

  const processSingleFile = async (file: File) => {
    setUploadResults((prev) => {
      const updated = [...prev];
      const index = updated.findIndex(
        (result) => result.fileName === file.name
      );
      if (index !== -1) {
        updated[index] = { ...updated[index], progress: 10 };
      }
      return updated;
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    setUploadResults((prev) => {
      const updated = [...prev];
      const index = updated.findIndex(
        (result) => result.fileName === file.name
      );
      if (index !== -1) {
        updated[index] = { ...updated[index], progress: 50 };
      }
      return updated;
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/validate", {
        method: "POST",
        body: formData,
      });
      const apiResponse: APIResponse = await response.json();

      setUploadResults((prev) => {
        const updated = [...prev];
        const index = updated.findIndex(
          (result) => result.fileName === file.name
        );
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "completed",
            progress: 100,
            apiResponse,
          };
        }
        return updated;
      });

      const overallStatus =
        apiResponse.validation_result.validation_report.every(
          (item) => item.valid === true
        )
          ? "success"
          : "failed";

      if (user) {
        await saveReport({
          userId: user.id,
          fileName: file.name,
          status: overallStatus,
          pageResults: [],
          downloadUrl: "#",
        });
      }
    } catch (error: unknown) {
      console.error("Error processing file:", error);
      setUploadResults((prev) => {
        const updated = [...prev];
        const index = updated.findIndex(
          (result) => result.fileName === file.name
        );
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
        return updated;
      });
    }
  };

  const processFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files to process",
        description: "Please upload PDF files first.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);

    for (const file of files) {
      await processSingleFile(file);
    }

    toast({
      title: "Processing complete",
      description: `Successfully processed ${files.length} file(s).`,
    });

    loadReports();
    setIsProcessing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "fail":
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
      case "partial":
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">WATTMONK</span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {user?.email || "Account"}
                </NavigationMenuTrigger>
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
                  maxSize={50 * 1024 * 1024}
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
                      "Analyze Documents"
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
                              <span className="font-medium">
                                {result.fileName}
                              </span>
                            </div>
                            {result.status === "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  downloadFullReport(result.fileName)
                                }
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Full Report
                              </Button>
                            )}
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div
                              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${result.progress}%` }}
                            ></div>
                          </div>

                          <div className="text-sm text-gray-500 mb-4">
                            {result.status === "processing" ? (
                              <span>Processing... {result.progress}%</span>
                            ) : result.status === "completed" ? (
                              <span className="text-green-500">Completed</span>
                            ) : (
                              <span className="text-red-500">
                                Failed: {result.error}
                              </span>
                            )}
                          </div>

                          {result.apiResponse && (
                            <div className="mt-4 space-y-6">
                              {/* Project Overview Card */}
                              <div className="bg-white p-6 border rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 text-amber-600">
                                  Project Overview
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-2">
                                      Basic Information
                                    </h4>
                                    <div className="space-y-1">
                                      <p>
                                        <span className="font-medium">
                                          Name:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.name
                                        }
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Address:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.address
                                        }
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Date:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.system_info.date
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-2">
                                      Contact Information
                                    </h4>
                                    <div className="space-y-1">
                                      <p>
                                        <span className="font-medium">
                                          Email:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.contact.email
                                        }
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Phone:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.contact.phone
                                        }
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Installer:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.system_info.installer
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* System Specifications */}
                              <div className="bg-white p-6 border rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 text-amber-600">
                                  System Specifications
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-2">
                                      System Details
                                    </h4>
                                    <div className="space-y-1">
                                      <p>
                                        <span className="font-medium">
                                          DC Size:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.system_info
                                            .dc_system_size_kwdc
                                        }{" "}
                                        kWdc
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          AC Size:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.system_info
                                            .ac_system_size_kwac
                                        }{" "}
                                        kWac
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          AHJ:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.regulations.ahj
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-2">
                                      Modules
                                    </h4>
                                    <div className="space-y-1">
                                      <p>
                                        <span className="font-medium">
                                          Manufacturer:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.technical_specifications
                                            .modules.manufacturer
                                        }
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Model:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.technical_specifications
                                            .modules.model
                                        }
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Quantity:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.technical_specifications
                                            .modules.quantity
                                        }
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Wattage:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.technical_specifications
                                            .modules.panel_wattage_w
                                        }
                                        W
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-2">
                                      Inverters
                                    </h4>
                                    <div className="space-y-1">
                                      <p>
                                        <span className="font-medium">
                                          Manufacturer:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.technical_specifications
                                            .inverters.manufacturer
                                        }
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Model:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.technical_specifications
                                            .inverters.model
                                        }
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Quantity:
                                        </span>{" "}
                                        {
                                          result.apiResponse.generated_json
                                            .project.technical_specifications
                                            .inverters.quantity
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Validation Results */}
                              <div className="bg-white p-6 border rounded-lg shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-lg font-semibold text-amber-600">
                                    Validation Results
                                  </h3>
                                  <div className="flex items-center">
                                    <span className="mr-2">
                                      Overall Status:
                                    </span>
                                    {result.apiResponse.validation_result.validation_report.every(
                                      (v) => v.valid
                                    ) ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="h-3 w-3 mr-1" />{" "}
                                        All Valid
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <XCircle className="h-3 w-3 mr-1" />{" "}
                                        Validation Issues
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  {Object.entries(
                                    groupByCategory(
                                      result.apiResponse.validation_result
                                        .validation_report
                                    )
                                  ).map(([category, fields]) => (
                                    <div key={category}>
                                      <h4 className="font-medium text-gray-700 mb-2">
                                        {formatCategoryName(category)}
                                      </h4>
                                      <div className="overflow-x-auto">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Field</TableHead>
                                              <TableHead>
                                                Expected Value
                                              </TableHead>
                                              <TableHead>PDF Value</TableHead>
                                              <TableHead>Status</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {(
                                              fields as {
                                                field: string;
                                                json_value:
                                                  | string
                                                  | number
                                                  | null;
                                                pdf_value:
                                                  | string
                                                  | number
                                                  | null;
                                                valid: boolean;
                                              }[]
                                            ).map((item, idx) => (
                                              <TableRow
                                                key={idx}
                                                className={
                                                  !item.valid ? "bg-red-50" : ""
                                                }
                                              >
                                                <TableCell className="font-medium">
                                                  {formatFieldName(item.field)}
                                                </TableCell>
                                                <TableCell>
                                                  {formatValue(item.json_value)}
                                                </TableCell>
                                                <TableCell>
                                                  {formatValue(item.pdf_value)}
                                                </TableCell>
                                                <TableCell>
                                                  {item.valid ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                  ) : (
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                  )}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Regulations */}
                              <div className="bg-white p-6 border rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 text-amber-600">
                                  Applicable Codes & Regulations
                                </h3>
                                <ul className="list-disc pl-5 space-y-1">
                                  {result.apiResponse.generated_json.project.regulations.codes.map(
                                    (code, idx) => (
                                      <li key={idx}>{code}</li>
                                    )
                                  )}
                                </ul>
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
                      onClick={() => setFilterDate(undefined)}
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
                      <RefreshCw
                        className={`h-5 w-5 ${
                          isLoadingReports ? "animate-spin" : ""
                        }`}
                      />
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
                          <TableCell className="font-medium">
                            {report.fileName}
                          </TableCell>
                          <TableCell>
                            {new Date(report.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(report.status)}
                              <span>
                                {report.status === "success"
                                  ? "Passed"
                                  : report.status === "failed"
                                  ? "Failed"
                                  : "Needs Review"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{report.pageResults.length}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                downloadFullReport(report.fileName)
                              }
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
