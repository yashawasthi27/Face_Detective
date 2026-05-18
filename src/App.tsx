import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import PasswordGuard from './components/PasswordGuard';
import { RefreshCw } from 'lucide-react';

// Lazy loading pages to dramatically speed up initial load
const Register = React.lazy(() => import('./pages/Register'));
const Attendance = React.lazy(() => import('./pages/Attendance'));
const Records = React.lazy(() => import('./pages/Records'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const DownloadRecord = React.lazy(() => import('./pages/DownloadRecord'));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <RefreshCw className="animate-spin text-teal-500" size={40} />
    <p className="text-slate-400 font-medium animate-pulse">Loading Module...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={
              <PasswordGuard>
                <Register />
              </PasswordGuard>
            } />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/records" element={
              <PasswordGuard>
                <Records />
              </PasswordGuard>
            } />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/download" element={<DownloadRecord />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
