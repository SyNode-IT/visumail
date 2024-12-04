import React from 'react';
import { useAuthStore } from './store/authStore';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';

function App() {
  const { token } = useAuthStore();

  if (!token) {
    return <LandingPage />;
  }

  return <Dashboard />;
}

export default App;