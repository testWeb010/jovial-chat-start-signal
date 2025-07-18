import React from 'react';
import { Award, Target, Zap, Globe, CheckCircle } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "Delivering exceptional quality in every project with meticulous attention to detail."
    },
    {
      icon: Target,
      title: "Strategic Focus",
      description: "Every campaign is strategically crafted to achieve your specific business objectives."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Staying ahead of trends with cutting-edge techniques and creative solutions."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Leveraging our extensive network to maximize your brand's impact worldwide."
    }
  ];

  const achievements = [
    "500+ Successful Projects Delivered",
    "100+ Celebrity Partnerships",
    "50+ Premium Brand Collaborations",
    "5+ Years of Industry Excellence"
  ];

  return (
    <section id="about" className="py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 mb-8">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">About Us</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Transforming Brands Through
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                  Strategic Media
                </span>
              </h2>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                At Across Media, we believe in the power of authentic storytelling and strategic partnerships. 
                Our team of creative visionaries and industry experts collaborate to create campaigns that not only 
                capture attention but drive meaningful, measurable results.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                From concept to execution, we handle every aspect of your media journey, ensuring your brand 
                message reaches the right audience through the most impactful channels and partnerships.
              </p>
            </div>

            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <CheckCircle className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="group relative">
                {/* Glowing effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
                
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-500 h-full">
                  <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon size={28} className="text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-pink-500 transition-all duration-300">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;