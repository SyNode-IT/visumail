import React from 'react';
import { AccountSelector } from './AccountSelector';
import { EmailBoard } from './EmailBoard';
import { AddAccountModal } from './AddAccountModal';
import { useEmailStore } from '../store/emailStore';

export function Dashboard() {
  const [isAddingAccount, setIsAddingAccount] = React.useState(false);
  const { selectedAccount, loading, error } = useEmailStore();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <AccountSelector />
            <button
              onClick={() => setIsAddingAccount(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Email Account
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {selectedAccount ? (
          <EmailBoard />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Please select an email account to continue or add a new one
            </p>
          </div>
        )}
      </main>

      {isAddingAccount && (
        <AddAccountModal onClose={() => setIsAddingAccount(false)} />
      )}
    </div>
  );
}