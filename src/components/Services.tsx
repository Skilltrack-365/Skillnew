import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Code, Cloud, Smartphone, Database, Shield, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      id: 'ai-machine-learning',
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Custom AI solutions including natural language processing, computer vision, and predictive analytics to automate and optimize your business processes.",
      features: ["Deep Learning Models", "Natural Language Processing", "Computer Vision", "Predictive Analytics"]
    },
    {
      id: 'software-development',
      icon: Code,
      title: "Software Development",
      description: "Full-stack development services creating scalable, secure, and high-performance applications tailored to your business needs.",
      features: ["Web Applications", "API Development", "Microservices", "Legacy Modernization"]
    },
    {
      id: 'cloud-solutions',
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Cloud-native architecture design and implementation with focus on scalability, reliability, and cost optimization.",
      features: ["Cloud Migration", "DevOps & CI/CD", "Serverless Architecture", "Container Orchestration"]
    },
    {
      id: 'mobile-development',
      icon: Smartphone,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences across all devices.",
      features: ["iOS & Android Apps", "React Native", "Flutter Development", "Mobile UI/UX"]
    },
    {
      id: 'data-engineering',
      icon: Database,
      title: "Data Engineering",
      description: "Build robust data pipelines, warehouses, and analytics platforms to unlock insights from your data.",
      features: ["Data Pipelines", "Data Warehousing", "Real-time Analytics", "Business Intelligence"]
    },
    {
      id: 'cybersecurity',
      icon: Shield,
      title: "Cybersecurity",
      description: "Comprehensive security solutions to protect your digital assets and ensure compliance with industry standards.",
      features: ["Security Audits", "Penetration Testing", "Compliance Management", "Incident Response"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive technology solutions that help businesses innovate, 
            scale, and stay competitive in today's digital landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={`/services/${service.id}`}
                className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors group"
              >
                View Courses
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;