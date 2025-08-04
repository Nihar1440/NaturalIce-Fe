import React, { useState, useEffect } from 'react';
import { Leaf, Shield, Truck, CreditCard, Heart, ChevronDown, Sparkles, Globe, Award, Users } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{count}{suffix}</span>;
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div className={`group relative overflow-hidden bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
    </div>
  );
};

const StatsCard = ({ number, label, suffix = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div className={`text-center p-6 rounded-2xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="text-3xl font-bold text-white mb-2">
        {isVisible ? <AnimatedCounter end={number} suffix={suffix} /> : '0'}
      </div>
      <div className="text-blue-100 text-sm uppercase tracking-wide">{label}</div>
    </div>
  );
};

const FloatingElement = ({ children, delay = 0 }) => {
  return (
    <div 
      className="animate-bounce"
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: '3s',
        animationIterationCount: 'infinite'
      }}
    >
      {children}
    </div>
  );
};

const LearnMorePage = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const features = [
    {
      icon: Leaf,
      title: "Our Brand Story",
      description: "Founded with a passion for natural and sustainable products, our brand is committed to providing high-quality, eco-friendly ice products. We believe in the power of nature and strive to bring its purest form to our customers."
    },
    {
      icon: Globe,
      title: "Sustainability Practices",
      description: "We are dedicated to protecting the environment. Our packaging is 100% recyclable, and we source our materials from sustainable suppliers. We continuously work to minimize our carbon footprint and promote a greener planet."
    },
    {
      icon: Truck,
      title: "Shipping & Returns",
      description: "We offer fast and reliable shipping to ensure your products arrive in perfect condition. If you are not completely satisfied with your purchase, we offer a hassle-free return policy."
    },
    {
      icon: Shield,
      title: "Payment Security",
      description: "Your security is our top priority. We use the latest encryption technology to protect your payment information. Shop with confidence knowing that your data is safe with us."
    },
    {
      icon: Heart,
      title: "Product Care",
      description: "To ensure the best experience, please follow the care instructions provided with your product. Proper care will maintain the quality and extend the life of your purchase."
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Every product undergoes rigorous quality testing to ensure it meets our high standards. We're committed to delivering excellence in every order."
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/5 to-transparent rounded-full"></div>
      </div>
      
      {/* Floating Elements */}
      <FloatingElement delay={0}>
        <div className="absolute top-20 left-10 text-blue-300/30">
          <Sparkles size={24} />
        </div>
      </FloatingElement>
      <FloatingElement delay={1}>
        <div className="absolute top-40 right-20 text-purple-300/30">
          <Sparkles size={16} />
        </div>
      </FloatingElement>
      <FloatingElement delay={2}>
        <div className="absolute bottom-40 left-20 text-cyan-300/30">
          <Sparkles size={20} />
        </div>
      </FloatingElement>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div 
          className="relative min-h-screen flex items-center justify-center text-center px-6"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 leading-tight">
                Discover Our
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Amazing Story
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed opacity-90">
                Where innovation meets sustainability, and quality becomes a lifestyle.
              </p>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
              <StatsCard number={500} suffix="K+" label="Happy Customers" delay={500} />
              <StatsCard number={99} suffix="%" label="Satisfaction Rate" delay={700} />
              <StatsCard number={50} suffix="+" label="Countries Served" delay={900} />
              <StatsCard number={5} suffix=" Years" label="Experience" delay={1100} />
            </div>
            
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Explore More
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
        
        {/* Features Section */}
        <div id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose Us?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                We're not just another company. We're your partners in creating a better, more sustainable future.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 200}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Call to Action Section */}
        <div className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Join Our Community
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Be part of a movement that values quality, sustainability, and innovation. Together, we're making a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Get Started Today
                </button>
                <button className="border-2 border-white/30 hover:border-white/50 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg backdrop-blur transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default LearnMorePage;