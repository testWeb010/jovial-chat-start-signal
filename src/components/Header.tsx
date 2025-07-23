import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Linkedin, Youtube, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/images/AMS-logo.png';

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate header opacity and blur based on scroll
  const scrollProgress = Math.min(scrollY / 100, 1);
  const headerOpacity = scrollProgress;
  const headerBlur = scrollProgress * 20;

  const navItems = [
    { name: 'HOME', active: true, path: '/' },
    { name: 'VIDEOS', active: false, path: '/videos' },
    { name: 'ABOUT', active: false, path: '/about' },
    { name: 'CONTACT', active: false, path: '/contact' },
  ];

  const socialIcons = [
    { icon: Instagram, href: 'https://www.instagram.com/acrossmediasolutions/?igsh=M2JjM2JjM2Jj' },
    { icon: Facebook, href: 'https://www.facebook.com/acrossmediasolutions/' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/across-media-solutions-ams/?originalSubdomain=in' },
    { icon: Youtube, href: 'https://youtube.com/@acrossmediasolutions?si=BZZXwU6l2er38LyH' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out">
      {/* Header Background with Dynamic Effects */}
      <div 
        className="absolute inset-0 transition-all duration-500 ease-out"
        style={{
          background: scrollY > 50 
            ? `linear-gradient(135deg, 
                rgba(6, 182, 212, ${0.1 + headerOpacity * 0.15}) 0%, 
                rgba(236, 72, 153, ${0.1 + headerOpacity * 0.15}) 50%, 
                rgba(147, 51, 234, ${0.1 + headerOpacity * 0.15}) 100%)`
            : 'transparent',
          backdropFilter: scrollY > 50 ? `blur(${headerBlur}px) saturate(1.5)` : 'none',
          borderBottom: scrollY > 50 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid transparent',
          boxShadow: scrollY > 50 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(236, 72, 153, 0.1)' 
            : 'none'
        }}
      />
      
      {/* Header Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/">
              <img src={Logo} alt="Across Media Solutions Logo" className="h-16" />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `relative text-sm font-medium transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                {item.name}
                {item.active && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"></div>
                )}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full transition-all duration-300 hover:w-full"></div>
              </NavLink>
            ))}
          </nav>

          {/* Social Icons & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Social Icons - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-3">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-500 hover:border-transparent transition-all duration-300 hover:scale-110"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-500 transition-all duration-300"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 ease-out ${
        isMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="bg-black/90 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <nav className="space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `block text-lg font-medium transition-all duration-300 ${isActive ? 'text-white border-l-2 border-pink-500 pl-4' : 'text-gray-300 hover:text-white hover:pl-2'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
            
            {/* Mobile Social Icons */}
            <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-white/10">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-500 hover:border-transparent transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;