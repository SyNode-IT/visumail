import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  register: async (email: string, password: string) => {
    const { data } = await api.post('/auth/register', { email, password });
    return data;
  },
  setup2FA: async (email: string) => {
    const { data } = await api.post('/auth/2fa/setup', { email });
    return data;
  },
  verify2FA: async (token: string) => {
    const { data } = await api.post('/auth/2fa/verify', { token });
    return data;
  },
};

// Email API
export const emails = {
  getAll: async () => {
    const { data } = await api.get('/emails');
    return data;
  },
  send: async (emailData: any) => {
    const { data } = await api.post('/emails', emailData);
    return data;
  },
  updateStatus: async (emailId: string, status: string) => {
    const { data } = await api.patch(`/emails/${emailId}/status`, { status });
    return data;
  },
};

// Email Accounts API
export const accounts = {
  add: async (accountData: any) => {
    const { data } = await api.post('/accounts', accountData);
    return data;
  },
  getAll: async () => {
    const { data } = await api.get('/accounts');
    return data;
  },
  remove: async (accountId: string) => {
    const { data } = await api.delete(`/accounts/${accountId}`);
    return data;
  },
  getEmails: async (accountId: string) => {
    const { data } = await api.get(`/accounts/${accountId}/emails`);
    return data;
  },
};