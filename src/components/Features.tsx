import React from 'react';
import { Kanban, Brain, Inbox, Shield, Layout, Mail } from 'lucide-react';

const features = [
  {
    icon: Kanban,
    title: 'Kanban View',
    description: 'Organize emails visually with customizable boards and columns for better workflow management.'
  },
  {
    icon: Brain,
    title: 'AI-Powered',
    description: 'Smart categorization and automated responses powered by advanced machine learning.'
  },
  {
    icon: Inbox,
    title: 'Universal Inbox',
    description: 'Aggregate multiple email accounts into a single, unified interface.'
  },
  {
    icon: Shield,
    title: 'Self-Hosted',
    description: 'Deploy on your own infrastructure for complete control and privacy.'
  },
  {
    icon: Layout,
    title: 'Custom Plugins',
    description: 'Extend functionality with a robust plugin system and API integration.'
  },
  {
    icon: Mail,
    title: 'IMAP/SMTP Support',
    description: 'Compatible with all major email providers and protocols.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          Powerful Features for Modern Email Management
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <feature.icon className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}