import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/images/ams-Photoroom.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl border-b border-primary/20' 
          : 'bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center z-10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <NavLink to="/">
              <img src={logo} alt="AcrossMedia Logo" className="h-12 drop-shadow-lg" />
            </NavLink>
          </motion.div>
          
          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-12">
            {['HOME', 'VIDEOS', 'ABOUT', 'CONTACT'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <NavLink 
                  to={item === 'HOME' ? '/' : `/${item.toLowerCase()}`} 
                  className={({ isActive }) => `
                    relative text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105 inline-block group
                    ${isActive 
                      ? 'text-primary drop-shadow-sm' 
                      : isScrolled 
                        ? 'text-gray-200 hover:text-primary' 
                        : 'text-white hover:text-primary'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {item}
                      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : ''}`}></span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Social Media Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {[
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Linkedin, href: '#', label: 'LinkedIn' },
              { icon: Youtube, href: '#', label: 'YouTube' }
            ].map(({ icon: Icon, href, label }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isScrolled 
                    ? 'text-gray-300 hover:text-primary hover:bg-primary/10' 
                    : 'text-white/80 hover:text-primary hover:bg-white/10'
                }`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                whileHover={{ y: -2 }}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled ? 'text-white hover:bg-primary/20' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMenuOpen ? 'close' : 'menu'}
                initial={{ rotate: 0 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 backdrop-blur-xl border-b border-primary/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col space-y-6 p-6">
                {['HOME', 'VIDEOS', 'ABOUT', 'CONTACT'].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink 
                      to={item === 'HOME' ? '/' : `/${item.toLowerCase()}`} 
                      className={({ isActive }) => `
                        block text-sm font-semibold tracking-wide transition-all duration-300 py-2 px-4 rounded-lg
                        ${isActive 
                          ? 'text-primary bg-primary/10' 
                          : 'text-gray-300 hover:text-primary hover:bg-primary/5'
                        }
                      `}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </NavLink>
                  </motion.div>
                ))}
                
                {/* Mobile Social Icons */}
                <div className="flex items-center justify-center space-x-6 pt-4 border-t border-primary/20">
                  {[
                    { icon: Instagram, href: '#', label: 'Instagram' },
                    { icon: Twitter, href: '#', label: 'Twitter' },
                    { icon: Linkedin, href: '#', label: 'LinkedIn' },
                    { icon: Youtube, href: '#', label: 'YouTube' }
                  ].map(({ icon: Icon, href, label }, index) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-gray-300 hover:text-primary transition-all duration-300 hover:scale-110 rounded-full hover:bg-primary/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;