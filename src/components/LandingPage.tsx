import React from 'react';
import { Mail, Shield, Layout } from 'lucide-react';
import { Hero } from './Hero';
import { Features } from './Features';
import { Demo } from './Demo';
import { Security } from './Security';
import { Footer } from './Footer';
import { AuthPage } from './auth/AuthPage';

export function LandingPage() {
  const [showAuth, setShowAuth] = React.useState(false);

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">VisuMail</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAuth(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Hero />
      <Features />
      <Demo />
      <Security />
      <Footer />
    </div>
  );
}