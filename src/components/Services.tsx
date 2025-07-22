import React from 'react';
import { Video, Users, Handshake, Lightbulb, ArrowUpRight, Target } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Video,
      title: "Branded Content Creation",
      description: "Crafting compelling narratives that resonate with your audience and drive meaningful engagement across all digital platforms.",
      features: ["Video Production", "Social Media Content", "Campaign Strategy", "Creative Direction"],
      gradient: "from-cyan-500 to-pink-600"
    },
    {
      icon: Users,
      title: "Celebrity Engagement",
      description: "Strategic partnerships with celebrities and influencers to amplify your brand message and reach new audiences authentically.",
      features: ["Celebrity Partnerships", "Influencer Marketing", "Event Appearances", "Brand Ambassadorships"],
      gradient: "from-pink-500 to-purple-600"
    },
    {
      icon: Handshake,
      title: "Sponsorships & Intellectual Properties",
      description: "Curated sponsorship opportunities and unique IP development that align with your brand values, creating lasting value and memorable experiences.",
      features: ["Event Sponsorships", "IP Development", "Content Licensing", "Rights Management", "Sports Marketing", "Format Creation"],
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Target,
      title: "Digital Marketing Solutions",
      description: "Comprehensive digital marketing strategies that amplify your brand presence across all digital channels and drive measurable results.",
      features: ["Social Media Strategy", "Performance Marketing", "Brand Positioning", "Analytics & Insights"],
      gradient: "from-pink-500 to-red-600"
    }
  ];

  return (
    <section id="services" className="py-32 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Our Specializations</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              What We Do
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We deliver comprehensive media solutions that transform brands through innovative content 
            and strategic partnerships, creating lasting impact in the digital landscape.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              {/* Glowing border effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${service.gradient} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000`}></div>
              
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-500 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <service.icon size={32} className="text-white" />
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-gray-500 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-blue-500 transition-all duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-400 mb-8 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 bg-gradient-to-r ${service.gradient} rounded-full`}></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;