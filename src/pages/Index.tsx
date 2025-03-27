
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { FileCheck, BarChart, Shield } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">WATTMONK</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/design-quality-assurance">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="bg-amber-500 hover:bg-amber-600">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
            <Link to={isAuthenticated ? "/design-quality-assurance" : "/sign-in"}>
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 min-w-[200px]"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/sign-up">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  Create Account
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-amber-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <FileCheck className="h-6 w-6 text-amber-600" />
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
                <BarChart className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Detailed Reports</h3>
              <p className="text-gray-600">
                Get comprehensive analysis with specific issues identified and
                recommendations for improvements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-amber-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-amber-600" />
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
