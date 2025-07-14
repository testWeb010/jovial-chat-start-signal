import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-gray-800 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Across
              </span>
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                Media
              </span>
            </div>
            
            <p className="text-gray-400 leading-relaxed max-w-md">
              Transforming brands through strategic media solutions, celebrity engagement, 
              and innovative content creation that drives meaningful results.
            </p>
            
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="group w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-600 transition-all duration-300 border border-gray-700 hover:border-transparent"
                >
                  <Icon size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-8">Services</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-300">Branded Content Creation</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-300">Celebrity Engagement</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-300">Sponsorships</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-300">Intellectual Properties</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-8">Company</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-300">Our Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-300">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-300">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Across Media. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-8 mt-4 md:mt-0">
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
            
            <button 
              onClick={scrollToTop}
              className="group w-10 h-10 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/25"
            >
              <ArrowUp size={16} className="text-white group-hover:translate-y-[-2px] transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;