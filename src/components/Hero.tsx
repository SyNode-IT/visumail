import React from 'react';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="container mx-auto px-6 pt-20 pb-24 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
        Visual Email Management,
        <span className="text-indigo-600"> Simplified</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Experience email like never before with VisuMail's Kanban-style organization, AI-powered features, and enterprise-grade security.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#get-started" className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center">
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
        <a href="#demo" className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          View Demo
        </a>
      </div>
    </div>
  );
}