import React from 'react';
import { ExternalLink, Play, ArrowUpRight } from 'lucide-react';
import project1 from "@/assets/project1.webp";
import project2 from "@/assets/project2.webp";
import project3 from "@/assets/project3.webp";
import project4 from "@/assets/project4.webp";
import project5 from "@/assets/project5.webp";
import project6 from "@/assets/project6.webp";

const Portfolio = () => {
  const projects = [
    {
      title: "Global Brand Campaign 2024",
      category: "Branded Content",
      description: "Revolutionary digital campaign that achieved 300% increase in brand awareness",
      image: project1,
      gradient: "from-cyan-500 to-pink-600"
    },
    {
      title: "Celebrity Partnership Series",
      category: "Celebrity Engagement",
      description: "Strategic celebrity collaboration reaching 10M+ engaged audience",
      image: project2,
      gradient: "from-pink-500 to-purple-600"
    },
    {
      title: "Premier Sports Sponsorship",
      category: "Sponsorships",
      description: "Major sports event sponsorship with nationwide coverage and impact",
      image: project3,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Original Content Series",
      category: "Intellectual Properties",
      description: "Created and produced original IP series with 50M+ global views",
      image: project4,
      gradient: "from-pink-500 to-red-600"
    },
    {
      title: "Multi-Platform Campaign",
      category: "Branded Content",
      description: "Integrated digital campaign with exceptional engagement across platforms",
      image: project5,
      gradient: "from-cyan-500 to-pink-600"
    },
    {
      title: "Influencer Ecosystem",
      category: "Celebrity Engagement",
      description: "Built comprehensive network of 100+ influencers for brand amplification",
      image: project6,
      gradient: "from-pink-500 to-purple-600"
    }
  ];

  return (
    <section id="work" className="py-32 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Our Work</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore our recent work and discover how we've helped brands achieve extraordinary 
            results through innovative media solutions and strategic partnerships.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="group relative">
              {/* Glowing border effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${project.gradient} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000`}></div>
              
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-500">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="flex gap-3">
                        <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                          <Play size={20} className="text-white" />
                        </button>
                        <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                          <ExternalLink size={20} className="text-white" />
                        </button>
                      </div>
                      <ArrowUpRight className="w-6 h-6 text-white/80" />
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`bg-gradient-to-r ${project.gradient} px-3 py-1 rounded-full`}>
                      <span className="text-white text-xs font-semibold">{project.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-pink-500 transition-all duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-pink-600 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <span>View All Projects</span>
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;