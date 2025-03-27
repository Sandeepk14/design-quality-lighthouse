import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">WATTMONK</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/sign-up">
              <Button className="bg-amber-500 hover:bg-amber-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            Design Quality Assurance for Solar Projects
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload your design PDFs and get automated quality checks to ensure
            compliance with all standards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-in">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 min-w-[200px]"
              >
                Get Started
              </Button>
            </Link>
            <Link to="/design-quality-assurance">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-amber-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Automated Quality Checks
              </h3>
              <p className="text-gray-600">
                Our system automatically analyzes your design PDFs for
                compliance with industry standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-amber-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Detailed Reports</h3>
              <p className="text-gray-600">
                Get page-by-page analysis with specific issues identified and
                recommendations for improvements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-amber-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-600">
                Upload multiple PDFs at once and get results quickly, even for
                files up to 50MB.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Wattmonk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
