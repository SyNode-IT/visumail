import React from 'react';
import { Inbox, Star, Clock, Archive, Trash, Tag } from 'lucide-react';

const demoEmails = [
  {
    id: 1,
    subject: 'Project Update Meeting',
    sender: 'sarah@company.com',
    preview: 'Here are the key points from today\'s meeting...',
    status: 'todo',
    priority: 'high'
  },
  {
    id: 2,
    subject: 'New Feature Request',
    sender: 'dev-team@company.com',
    preview: 'We need to implement the following features...',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: 3,
    subject: 'Weekly Newsletter',
    sender: 'newsletter@tech.com',
    preview: 'Latest updates in the tech world...',
    status: 'done',
    priority: 'low'
  }
];

const columns = [
  { id: 'todo', title: 'To Do', icon: Inbox },
  { id: 'in-progress', title: 'In Progress', icon: Clock },
  { id: 'done', title: 'Done', icon: Archive }
];

export function Demo() {
  return (
    <section id="demo" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experience the Kanban Email Flow
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualize your email workflow with our intuitive Kanban board interface
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {columns.map((column) => (
            <div key={column.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <column.icon className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
              </div>
              
              <div className="space-y-3">
                {demoEmails
                  .filter(email => email.status === column.id)
                  .map(email => (
                    <div key={email.id} className="bg-white p-4 rounded shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{email.subject}</h4>
                        {email.priority === 'high' && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{email.sender}</p>
                      <p className="text-sm text-gray-500">{email.preview}</p>
                      <div className="flex items-center mt-3 space-x-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Email</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}