
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, FileTextIcon } from 'lucide-react';
import { motion } from '@/components/animations/Motion';
import { AnimatedLogo } from '@/components/AnimatedLogo';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex flex-col">
      <header className="py-6 px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AnimatedLogo className="h-8 w-8" />
            <h1 className="text-xl font-bold">Design Quality Lighthouse</h1>
          </div>
          
          <nav>
            <Link to="/design-quality-assurance">
              <Button className="bg-watt-gold hover:bg-watt-bronze text-black">
                Quality Assurance
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-8">
              <AnimatedLogo className="h-24 w-24 mx-auto" />
            </div>
            
            <h2 className="text-4xl font-bold mb-6">Design Quality Assurance Platform</h2>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Upload and evaluate PDF designs for quality assurance. 
              Our platform helps identify design inconsistencies and quality issues.
            </p>
            
            <Link to="/design-quality-assurance">
              <Button size="lg" className="bg-watt-gold hover:bg-watt-bronze text-black px-8 py-6 rounded-xl">
                <FileTextIcon className="mr-2 h-5 w-5" />
                Start Evaluating Designs
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
