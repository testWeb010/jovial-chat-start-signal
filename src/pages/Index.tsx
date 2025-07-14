import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Users, 
  Eye, 
  TrendingUp, 
  Star,
  Sparkles,
  Target,
  Zap,
  Video,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  Award,
  BarChart3,
  Camera,
  Megaphone
} from "lucide-react";
import heroVideo from "@/assets/hero-video.jpg";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";
import project4 from "@/assets/project4.jpg";
import project5 from "@/assets/project5.jpg";
import project6 from "@/assets/project6.jpg";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  const services = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Branded Content Creation",
      description: "From concept to creation, we develop compelling branded content that resonates with your audience and drives engagement across all platforms.",
      features: ["Video Production", "Photography", "Graphic Design", "Animation"]
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Celebrity Engagement",
      description: "Connect your brand with influential celebrities and personalities to amplify your message and reach new audiences effectively.",
      features: ["Celebrity Partnerships", "Influencer Marketing", "Brand Ambassadorships", "Event Appearances"]
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Specialisation",
      description: "We specialize in creating targeted campaigns that speak directly to your specific market segments with precision and impact.",
      features: ["Market Research", "Audience Analysis", "Campaign Strategy", "Performance Optimization"]
    },
    {
      icon: <Megaphone className="w-8 h-8" />,
      title: "Individual Properties",
      description: "Develop unique brand properties and intellectual assets that set your company apart from the competition.",
      features: ["Brand Development", "IP Creation", "Content Libraries", "Asset Management"]
    }
  ];

  const transformServices = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics",
      description: "Data-driven insights to optimize your media strategy"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Strategy Packs",
      description: "Comprehensive media strategies tailored to your goals"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Innovation",
      description: "Cutting-edge solutions for modern media challenges"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Results",
      description: "Fast turnaround times without compromising quality"
    }
  ];

  const projects = [
    {
      title: "Olive Road Campaign 2024",
      category: "Brand Campaign",
      image: project1,
      description: "A comprehensive brand awareness campaign that increased market reach by 250%"
    },
    {
      title: "Celebrity Partnership Series",
      category: "Influencer Marketing",
      image: project2,
      description: "Strategic celebrity collaborations driving engagement across multiple platforms"
    },
    {
      title: "Premium Social Videography",
      category: "Video Production",
      image: project3,
      description: "High-quality video content that boosted social media engagement by 400%"
    },
    {
      title: "Digital Content Series",
      category: "Content Strategy",
      image: project4,
      description: "Multi-platform content strategy resulting in viral social media success"
    },
    {
      title: "Multi-Platform Campaign",
      category: "Integrated Marketing",
      image: project5,
      description: "Cross-platform marketing campaign reaching over 2M unique users"
    },
    {
      title: "Influencer Acquisition",
      category: "Partnership Development",
      image: project6,
      description: "Strategic influencer partnerships that amplified brand visibility"
    }
  ];

  const journeySteps = [
    {
      step: "01",
      title: "Brief",
      description: "We start by understanding your vision, goals, and target audience to create a strategic foundation."
    },
    {
      step: "02", 
      title: "Create",
      description: "Our creative team develops compelling content and campaigns tailored to your brand's unique story."
    },
    {
      step: "03",
      title: "Deploy",
      description: "We execute your campaign across multiple channels, ensuring maximum reach and engagement."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            <span className="text-primary">Across</span>Media
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="hover:text-primary transition-colors">What We Do</a>
            <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <Button variant="gradient" size="sm">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  A CROSS MEDIA PULS
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  We are<br />
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Across Media
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  A creative & branded influencer, celebrity-led, & 
                  content-driven media company creating exceptional 
                  campaigns that drive results.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="gradient" size="lg">
                  Get Started Today
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="hero" size="lg">
                  Our Process
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Awards</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">5+</div>
                  <div className="text-sm text-muted-foreground">Years</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-card">
                <img 
                  src={heroVideo} 
                  alt="Media Production Studio" 
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-hero flex items-center justify-center">
                  <Button size="icon" className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 backdrop-blur-sm hover:bg-primary/30">
                    <Play className="w-6 h-6 text-primary-foreground" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm font-medium">Our Work Video</div>
                  <div className="text-xs text-muted-foreground">See how we create amazing campaigns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="services" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Star className="w-3 h-3 mr-1" />
              WHAT WE DO
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold">What We Do</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer end-to-end creative solutions designed to drive engagement and strengthen 
              your brand's competitive presence with strategic social media campaigns & performance tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-gradient-secondary border-border/50 hover:shadow-card transition-all duration-300 group">
                <CardContent className="p-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors">
                    {service.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transform Section */}
      <section className="py-20 px-6 bg-gradient-secondary">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  RESULTS
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Transforming<br />
                  Brands Through<br />
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Strategic Media
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  We leverage cutting-edge strategies and innovative approaches to deliver 
                  measurable results that exceed expectations. Our proven methodology ensures 
                  your brand stands out in today's competitive landscape.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Data-driven campaign optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Multi-platform content distribution</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Celebrity & influencer partnerships</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Real-time performance tracking</span>
                </div>
              </div>

              <Button variant="gradient" size="lg">
                Learn More About Our Process
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {transformServices.map((service, index) => (
                <Card key={index} className="bg-card/50 border-border/30 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      {service.icon}
                    </div>
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Camera className="w-3 h-3 mr-1" />
              CASE STUDIES
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold">Featured Projects</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore some of our most successful campaigns and see how we've helped brands 
              achieve extraordinary results across multiple platforms and audiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="group overflow-hidden border-border/50 hover:shadow-card transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6 space-y-3">
                  <Badge variant="secondary" className="text-xs">
                    {project.category}
                  </Badge>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-secondary">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  LET'S TALK
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Let's Create Something<br />
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Extraordinary
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  Ready to elevate your brand with strategic media campaigns? 
                  Let's discuss how we can help you achieve your goals and create 
                  content that truly resonates with your audience.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Start Your Journey</h3>
                <div className="space-y-4">
                  {journeySteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {step.step}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Details</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project..."
                      className="bg-background/50 min-h-[120px]"
                    />
                  </div>
                  <Button type="submit" variant="gradient" size="lg" className="w-full">
                    Send Message
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold">
                <span className="text-primary">Across</span>Media
              </div>
              <p className="text-muted-foreground text-sm">
                Creating exceptional campaigns that drive results through strategic media and celebrity partnerships.
              </p>
              <div className="flex space-x-4">
                <Button size="icon" variant="ghost" className="hover:text-primary">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="hover:text-primary">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="hover:text-primary">
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Services</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Branded Content</div>
                <div>Celebrity Engagement</div>
                <div>Video Production</div>
                <div>Social Media</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About Us</div>
                <div>Our Team</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>hello@acrossmedia.com</div>
                <div>+1 (555) 123-4567</div>
                <div>New York, NY</div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AcrossMedia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
