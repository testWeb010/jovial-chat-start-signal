import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 mb-8">
            <MessageCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Get In Touch</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Let's Create Something
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              Extraordinary
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your brand? Let's discuss your vision and create 
            a strategic media solution that delivers exceptional results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div>
              <h3 className="text-3xl font-bold text-white mb-8">Start Your Journey</h3>
              <p className="text-gray-300 leading-relaxed mb-10">
                We're passionate about bringing your vision to life through innovative media solutions. 
                Our team is ready to collaborate with you on creating impactful campaigns that resonate 
                with your audience and drive meaningful results.
              </p>
            </div>

            <div className="space-y-8">
              <div className="group flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail size={28} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white text-lg mb-1">Email</div>
                  <div className="text-gray-400">hello@acrossmedia.com</div>
                </div>
              </div>

              <div className="group flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone size={28} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white text-lg mb-1">Phone</div>
                  <div className="text-gray-400">+91 98765 43210</div>
                </div>
              </div>

              <div className="group flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={28} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white text-lg mb-1">Office</div>
                  <div className="text-gray-400">Mumbai, Maharashtra, India</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-3xl blur opacity-20"></div>
            
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 border border-gray-700">
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">Subject</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                    placeholder="Project inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">Message</label>
                  <textarea 
                    rows={6}
                    className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none text-white placeholder-gray-400"
                    placeholder="Tell us about your vision and how we can help bring it to life..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="group relative overflow-hidden w-full bg-gradient-to-r from-cyan-500 to-pink-600 text-white px-8 py-5 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <Send size={20} />
                    <span>Send Message</span>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;