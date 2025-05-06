import React from 'react';
// import { ContactForm } from './ContactForm';
// import { ContactInfo } from './ContactInfo';
// import { DynamicBackground } from './DynamicBackground';
import { ContactInfo } from './../components/ContactInfo';
import { DynamicBackground } from './../components/DynamicBackground';
import { ContactForm } from './../components/ContactForm';
import { Helmet } from 'react-helmet';

const ContactPage: React.FC = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <DynamicBackground />
      <div className="relative z-10">
        
        <main className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-center mb-2">
            Contact Us
          </h1>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our products, orders, or anything else, our team is ready to assist you.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <ContactInfo />
            <ContactForm />
          </div>
        </main>
      </div>
    </div>
  );
};


export default ContactPage; 