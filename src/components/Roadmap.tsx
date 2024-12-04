import React from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const phases = [
  {
    title: 'Phase 1: Core Features',
    status: 'completed',
    items: [
      'IMAP/SMTP Integration',
      'Basic Kanban Interface',
      'Multi-account Support',
      'Security Foundation'
    ]
  },
  {
    title: 'Phase 2: AI Integration',
    status: 'in-progress',
    items: [
      'Smart Email Categorization',
      'Auto-response Generation',
      'Priority Detection',
      'Content Summarization'
    ]
  },
  {
    title: 'Phase 3: Advanced Features',
    status: 'upcoming',
    items: [
      'Plugin System',
      'API Integration',
      'Custom Workflows',
      'Team Collaboration'
    ]
  }
];

export function Roadmap() {
  return (
    <section id="roadmap" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Development Roadmap
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our journey to revolutionize email management
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {phases.map((phase, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                {phase.status === 'completed' ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                ) : phase.status === 'in-progress' ? (
                  <Clock className="h-6 w-6 text-yellow-500 mr-2" />
                ) : (
                  <Calendar className="h-6 w-6 text-gray-400 mr-2" />
                )}
                <h3 className="text-lg font-semibold">{phase.title}</h3>
              </div>
              <ul className="space-y-3">
                {phase.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 mt-2 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}