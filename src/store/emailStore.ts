import create from 'zustand';
import { Email, EmailAccount } from '../types/email';

interface EmailState {
  emails: Email[];
  accounts: EmailAccount[];
  selectedAccount: string | null;
  loading: boolean;
  error: string | null;
  addEmail: (email: Email) => void;
  updateEmailStatus: (emailId: string, status: Email['status']) => void;
  addAccount: (account: EmailAccount) => void;
  setSelectedAccount: (accountId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  emails: [],
  accounts: [],
  selectedAccount: null,
  loading: false,
  error: null,

  addEmail: (email) =>
    set((state) => ({ emails: [...state.emails, email] })),

  updateEmailStatus: (emailId, status) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === emailId ? { ...email, status } : email
      ),
    })),

  addAccount: (account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),

  setSelectedAccount: (accountId) =>
    set({ selectedAccount: accountId }),

  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));