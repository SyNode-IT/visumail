import React from 'react';
import { useEmailStore } from '../store/emailStore';

export function AccountSelector() {
  const { accounts, selectedAccount, setSelectedAccount } = useEmailStore();

  return (
    <div className="p-4 border-b">
      <select
        value={selectedAccount || ''}
        onChange={(e) => setSelectedAccount(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Account</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name} ({account.email})
          </option>
        ))}
      </select>
    </div>
  );
}