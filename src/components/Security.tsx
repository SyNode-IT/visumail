import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

const securityFeatures = [
  {
    title: 'End-to-End Encryption',
    description: 'All emails are encrypted using industry-standard PGP/GPG protocols.'
  },
  {
    title: 'Self-Hosted Solution',
    description: 'Deploy on your own infrastructure for complete data sovereignty.'
  },
  {
    title: 'Two-Factor Authentication',
    description: 'Additional security layer with 2FA support for all accounts.'
  },
  {
    title: 'Open Source',
    description: 'Transparent, auditable code that you can trust.'
  }
];

export function Security() {
  return (
    <section id="security" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Enterprise-Grade Security
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Your data stays yours. With end-to-end encryption and self-hosting options, 
            security and privacy are at the core of our solution.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}