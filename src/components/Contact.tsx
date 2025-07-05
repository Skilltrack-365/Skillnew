import React from 'react';
import ContactForm from './ContactForm';

const Contact = () => {
  const handleContactSubmit = async (formData: any) => {
    // Here you can integrate with your backend API or email service
    console.log('Contact form submitted:', formData);
    
    // Example: Send to your API endpoint
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
    
    // For now, we'll use the default email handling in ContactForm
  };

  const contactInfo = {
    name: 'Prashanth',
    email: 'Prashanth@refabs365.com',
    phone: '+91 9844543555',
    location: 'Bangalore, IND',
    role: 'Team Lead - Refabs365'
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your business with cutting-edge technology? 
            Let's discuss how we can help you achieve your goals.
          </p>
        </div>

        <ContactForm 
          contactInfo={contactInfo}
          onSubmit={handleContactSubmit}
          title="Let's Start a Conversation"
          description="Get in touch with our team to discuss your project requirements, ask questions, or explore collaboration opportunities with Refabs365."
        />
      </div>
    </section>
  );
};

export default Contact;