import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react';
import logo from '@/assets/images/ams-Photoroom.png';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { Icon: Facebook, href: 'https://facebook.com' },
    { Icon: Instagram, href: 'https://instagram.com' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/company/across-media-solutions-ams/?originalSubdomain=in' },
    { Icon: Youtube, href: 'https://youtube.com/@acrossmediasolutions?si=BZZXwU6l2er38LyH' },
  ];
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.footer 
      className="bg-black border-t border-gray-800 relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div 
            className="lg:col-span-2 space-y-8"
            variants={itemVariants}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img src={logo} alt="AcrossMedia Logo" className="h-12" />
            </motion.div>
            
            <motion.p 
              className="text-gray-400 leading-relaxed max-w-md"
              variants={itemVariants}
            >
              Transforming brands through strategic media solutions, celebrity engagement, 
              and innovative content creation that drives meaningful results.
            </motion.p>
            
            <motion.div 
              className="flex space-x-4"
              variants={itemVariants}
            >
              {socialLinks.map(({ Icon, href }, index) => (
                <motion.a 
                  key={index}
                  href={href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-600 transition-all duration-300 border border-gray-700 hover:border-transparent"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <Icon size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-white mb-8">Services</h3>
            <ul className="space-y-4 text-gray-400">
              {['Branded Content Creation', 'Celebrity Engagement', 'Sponsorships', 'Intellectual Properties'].map((service, index) => (
                <motion.li
                  key={service}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  viewport={{ once: true }}
                >
                  <motion.a 
                    href="#" 
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-300"
                    whileHover={{ x: 5, color: "#06b6d4" }}
                  >
                    {service}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-white mb-8">Company</h3>
            <ul className="space-y-4 text-gray-400">
              {['About Us', 'Our Team', 'Careers', 'Contact'].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                  viewport={{ once: true }}
                >
                  <motion.a 
                    href="#" 
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-300"
                    whileHover={{ x: 5, color: "#06b6d4" }}
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p className="text-gray-400 text-sm">
            2024 Across Media. All rights reserved.
          </p>
          
          <motion.button 
            onClick={scrollToTop}
            className="group w-10 h-10 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/25"
            whileHover={{ 
              scale: 1.2,
              rotate: 360,
              boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)"
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ArrowUp size={16} className="text-white group-hover:translate-y-[-2px] transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;