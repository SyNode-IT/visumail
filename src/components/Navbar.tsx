import React from 'react';
import { Mail, Github } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">VisuMail</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#security" className="text-gray-600 hover:text-gray-900">Security</a>
          <a href="#roadmap" className="text-gray-600 hover:text-gray-900">Roadmap</a>
          <a href="https://github.com" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
            <Github className="h-5 w-5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}