import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import About from './components/About';
import Contact from './components/Contact';
import Videos from './pages/Videos';
import Projects from './pages/Projects';
import IPDetail from './pages/IPDetail';
import AdminPanel from './components/admin/AdminPanel';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import PendingApproval from './components/auth/PendingApproval'
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // If you do not want Header and Footer on certain pages, you can conditionally render them
  // For example, to exclude from admin, login, signup, etc., use a condition like:
  // const showHeaderFooter = !isAdminPage && !['/login', '/signup', '/forgot-password', '/pending-approval'].includes(location.pathname);
  // Then wrap Header and Footer with {showHeaderFooter && <Header />}

  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ip/:id" element={<IPDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;