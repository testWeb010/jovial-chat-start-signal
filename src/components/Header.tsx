import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '@/hooks/useLenis';
import logo from '@/assets/images/ams-logo-new.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 backdrop-blur-xl' 
          : 'bg-gradient-to-r from-primary/20 via-purple-600/15 to-primary/20 backdrop-blur-lg'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <motion.div 
            className="flex items-center z-10 relative"
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <NavLink to="/" className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <img src={logo} alt="Across Media Solutions" className="relative h-16 drop-shadow-2xl filter brightness-110" />
            </NavLink>
          </motion.div>
          
          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-16">
            {['HOME', 'VIDEOS', 'ABOUT', 'CONTACT'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 + 0.3 }}
                whileHover={{ y: -2 }}
              >
                <NavLink 
                  to={item === 'HOME' ? '/' : `/${item.toLowerCase()}`} 
                  className="relative text-base font-bold tracking-wider transition-all duration-500 hover:scale-110 inline-block group"
                >
                  {({ isActive }) => (
                    <>
                      <span className={`relative z-10 transition-all duration-500 ${
                        isActive 
                          ? 'text-primary drop-shadow-lg' 
                          : isScrolled 
                            ? 'text-gray-100 hover:text-primary' 
                            : 'text-white hover:text-primary'
                      }`}>
                        {item}
                      </span>
                      <motion.span 
                        className={`absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full transition-all duration-500 ${
                          isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                        }`}
                        layoutId={isActive ? "activeTab" : undefined}
                      />
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur"></div>
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