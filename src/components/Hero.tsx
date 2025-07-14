import React from 'react';
import { Play, ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Creative Excellence</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  We are
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Across Media
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                We specialise in <span className="text-white font-semibold">Branded Content Creation</span>, 
                <span className="text-white font-semibold"> Celebrity Engagement</span>, 
                <span className="text-white font-semibold"> Sponsorships</span> and 
                <span className="text-white font-semibold"> IPs</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Play size={20} />
                  <span>Watch more</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button className="group border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-2xl font-semibold hover:border-cyan-400 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
                <span>Get Started</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12">
              <div className="text-center group">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">500+</div>
                <div className="text-sm text-gray-400 mt-1">Projects</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">100+</div>
                <div className="text-sm text-gray-400 mt-1">Celebrities</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">50+</div>
                <div className="text-sm text-gray-400 mt-1">Brands</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">5+</div>
                <div className="text-sm text-gray-400 mt-1">Years</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden border border-gray-700">
                <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center relative">
                  {/* Video thumbnail placeholder */}
                  <div className="absolute inset-4 bg-gradient-to-br from-cyan-500/20 to-pink-600/20 rounded-2xl"></div>
                  
                  <div className="relative text-center text-white z-10">
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:scale-110 transition-all duration-300 shadow-2xl shadow-cyan-500/30">
                      <Play size={40} fill="white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Our Intro Video</h3>
                    <p className="text-gray-300">Discover what we do</p>
                  </div>
                  
                  {/* Animated particles */}
                  <div className="absolute top-8 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-12 right-12 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 right-8 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-pink-500 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;