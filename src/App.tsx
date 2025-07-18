import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
// import VideoSection from './components/VideoSection';
import Videos from './pages/Videos';
import ProjectsSection from './components/ProjectSection';
import AdminPanel from './components/admin/AdminPanel';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import PendingApproval from './components/auth/PendingApproval'
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './pages/NotFound'; // Corrected import path for NotFound component


const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith(import.meta.env.VITE_ADMIN_PATH || '/admin');

  return (
    <div className="min-h-screen">
      {!isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Services />
            <About />
            <Portfolio />
            <Contact />
          </>
        } />
        <Route path={import.meta.env.VITE_LOGIN_PATH} element={<Login />} />
        <Route path={import.meta.env.VITE_SIGNUP_PATH} element={<Signup />} />
        <Route path={import.meta.env.VITE_ABOUT_PATH} element={<About />} />
        <Route path={import.meta.env.VITE_CONTACT_PATH} element={<Contact />} />
        <Route path={import.meta.env.VITE_FORGOT_PASSWORD_PATH} element={<ForgotPassword />} />
        <Route path={import.meta.env.VITE_PENDING_APPROVAL_PATH} element={<PendingApproval />} />
        <Route path={import.meta.env.VITE_VIDEOS_PATH} element={<Videos/>} />
        <Route path={import.meta.env.VITE_PROJECTS_PATH} element={<ProjectsSection />} />
        <Route path={import.meta.env.VITE_ADMIN_PATH} element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        // Catch-all route for 404 Not Found
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminPage && <Footer />}
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