import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';


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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Across<span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">Media</span>
            </NavLink>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}>HOME</NavLink>
            <NavLink to="/videos" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}>VIDEOS</NavLink>
            <NavLink to="/about" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}>ABOUT</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}>CONTACT</NavLink>
          </nav>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10">
            <nav className="flex flex-col space-y-6 p-6">
              <NavLink to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide" onClick={() => setIsMenuOpen(false)}>HOME</NavLink>
              <NavLink to="/videos" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide" onClick={() => setIsMenuOpen(false)}>VIDEOS</NavLink>
              <NavLink to="/about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide" onClick={() => setIsMenuOpen(false)}>ABOUT</NavLink>
              <NavLink to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide" onClick={() => setIsMenuOpen(false)}>CONTACT</NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;