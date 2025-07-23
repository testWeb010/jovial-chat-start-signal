import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Calendar, Eye, Share2, Download, Star } from 'lucide-react';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';

interface IP {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  views: string;
  releaseDate: string;
  status: 'active' | 'upcoming';
}

const IPDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const ip = location.state?.ip as IP;

  // If no IP data is passed via state, you would typically fetch it here
  if (!ip) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">IP Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* <Header /> */}
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={ip.thumbnail}
              alt={ip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20">
            {/* Back Button */}
            <motion.button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 mb-8 text-gray-300 hover:text-white transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ArrowLeft size={20} />
              <span>Back to IP Showcase</span>
            </motion.button>

            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[50vh]">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      ip.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {ip.status === 'active' ? 'Now Streaming' : 'Coming Soon'}
                    </span>
                    <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30">
                      {ip.category}
                    </span>
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white via-gray-100 to-primary bg-clip-text text-transparent">
                      {ip.title}
                    </span>
                  </h1>

                  <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                    {ip.description}
                  </p>

                  <div className="flex items-center gap-8 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Eye size={20} />
                      <span className="text-lg">{ip.views} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={20} />
                      <span className="text-lg">{new Date(ip.releaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-yellow-400" fill="currentColor" />
                      <span className="text-lg">4.8/5</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-primary/25 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                      <Play size={20} />
                      <span>Watch Now</span>
                    </div>
                  </button>
                  
                  <button className="group border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-2xl font-semibold hover:border-primary hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                    <div className="flex items-center gap-3">
                      <Download size={20} />
                      <span>Download</span>
                    </div>
                  </button>

                  <button className="group border-2 border-gray-600 text-gray-300 px-6 py-4 rounded-2xl font-semibold hover:border-primary hover:text-white transition-all duration-300">
                    <Share2 size={20} />
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden border border-gray-700 aspect-video">
                  <img
                    src={ip.thumbnail}
                    alt={ip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300">
                      <Play size={40} className="text-white ml-2" fill="white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Synopsis */}
              <div className="lg:col-span-2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Synopsis</h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      {ip.description} This groundbreaking content pushes the boundaries of storytelling, 
                      combining innovative production techniques with compelling narratives that resonate 
                      with audiences across demographics.
                    </p>
                    <p>
                      Our team of creative professionals has crafted this intellectual property to deliver 
                      maximum engagement while maintaining the highest production values. The content features 
                      stunning visuals, captivating storylines, and memorable characters that leave lasting 
                      impressions on viewers.
                    </p>
                    <p>
                      With its unique blend of entertainment and meaningful messaging, this IP represents 
                      the future of digital content creation and sets new standards for the industry.
                    </p>
                  </div>
                </motion.div>

                {/* Production Details */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">Production Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-primary mb-2">Genre</h4>
                      <p className="text-gray-300">{ip.category}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-primary mb-2">Duration</h4>
                      <p className="text-gray-300">45-60 minutes per episode</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-primary mb-2">Language</h4>
                      <p className="text-gray-300">English with subtitles</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-primary mb-2">Rating</h4>
                      <p className="text-gray-300">TV-14</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <motion.div
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Views</span>
                      <span className="text-white font-semibold">{ip.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Release Date</span>
                      <span className="text-white font-semibold">
                        {new Date(ip.releaseDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className={`font-semibold ${
                        ip.status === 'active' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {ip.status === 'active' ? 'Active' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating</span>
                      <span className="text-yellow-400 font-semibold">★ 4.8/5</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Awards & Recognition</h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="text-primary font-semibold">Best Digital Series 2024</div>
                      <div className="text-gray-400">Streaming Content Awards</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-primary font-semibold">Audience Choice Award</div>
                      <div className="text-gray-400">Digital Media Festival</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-primary font-semibold">Innovation in Content</div>
                      <div className="text-gray-400">Tech & Media Summit</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default IPDetail;