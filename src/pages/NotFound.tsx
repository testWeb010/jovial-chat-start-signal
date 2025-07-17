import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden flex items-center justify-center pt-16 md:pt-32">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-to-r from-cyan-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] md:bg-[size:100px_100px]"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 md:space-y-10">
          {/* 404 Number */}
          <div className="relative">
            <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
            <h1 className="relative text-7xl sm:text-9xl lg:text-[12rem] font-bold leading-none">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                404
              </span>
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-4 md:space-y-8">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-xs md:text-sm font-medium tracking-wider uppercase">Page Not Found</span>
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-pink-400 animate-pulse delay-500" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Oops! This page seems to have
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                gone missing
              </span>
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, let's get you back to exploring our amazing content.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/')}
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-pink-600 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 text-sm sm:text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2 md:gap-3">
                <Home size={16} className="sm:w-5 sm:h-5" />
                <span>Back to Home</span>
              </div>
            </button>
            
            <button 
              onClick={() => navigate(-1)}
              className="group border-2 border-gray-600 text-gray-300 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-2xl font-semibold hover:border-cyan-400 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 text-sm sm:text-base"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                <span>Go Back</span>
              </div>
            </button>
          </div>

          {/* Quick Links */}
          <div className="pt-6 md:pt-12">
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">Or explore these popular sections:</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
              <button 
                onClick={() => navigate('/videos')}
                className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-cyan-400 transition-all duration-300 text-xs sm:text-sm"
              >
                Videos
              </button>
              <button 
                onClick={() => navigate('/projects')}
                className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-cyan-400 transition-all duration-300 text-xs sm:text-sm"
              >
                Projects
              </button>
              <button 
                onClick={() => navigate('/#about')}
                className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-cyan-400 transition-all duration-300 text-xs sm:text-sm"
              >
                About Us
              </button>
              <button 
                onClick={() => navigate('/#contact')}
                className="px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-cyan-400 transition-all duration-300 text-xs sm:text-sm"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-3 h-3 sm:w-4 sm:h-4 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-10 sm:bottom-32 right-10 sm:right-32 w-4 h-4 sm:w-6 sm:h-6 bg-pink-500 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/3 sm:top-1/2 right-10 sm:right-20 w-1 h-1 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-ping delay-1000 opacity-50"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-32 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-300 rounded-full animate-bounce delay-500 opacity-30"></div>
      </div>
    </section>
  );
};

export default NotFound;