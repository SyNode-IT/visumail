import React from 'react';
import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Mail className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold text-white">VisuMail</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Contributing</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">
          © {new Date().getFullYear()} VisuMail.com. Open source under MIT license.
        </div>
      </div>
    </footer>
  );
}