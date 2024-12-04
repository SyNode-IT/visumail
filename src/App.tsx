import React from 'react';
import { AccountSelector } from './components/AccountSelector';
import { EmailBoard } from './components/EmailBoard';
import { useEmailStore } from './store/emailStore';

function App() {
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
        <div className="container mx-auto">
          <AccountSelector />
        </div>
      </header>
      
      <main className="container mx-auto py-6">
        {selectedAccount ? (
          <EmailBoard />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Please select an email account to continue
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;