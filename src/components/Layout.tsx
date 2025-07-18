import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-900">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
