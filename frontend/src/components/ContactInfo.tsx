import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export const ContactInfo: React.FC = () => {
  return (
    <div className="bg-black/60 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-gray-800 shadow-xl hover:shadow-red-900/10 transition-all duration-500 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-2xl font-serif mb-6 text-red-500">Our Information</h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-red-900/30 p-3 rounded-full">
              <Phone className="text-red-400" size={20} />
            </div>
            <div>
              <h3 className="font-medium mb-1">Phone</h3>
              <p className="text-gray-300">+971 55 705 2240</p>
              <p className="text-gray-400 text-sm mt-1">Customer support available Mon-Fri</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-red-900/30 p-3 rounded-full">
              <Mail className="text-red-400" size={20} />
            </div>
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <p className="text-gray-300">info@blackmagiccomplexllc.com</p>
              <p className="text-gray-400 text-sm mt-1">We'll respond within 24 hours</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-red-900/30 p-3 rounded-full">
              <MapPin className="text-red-400" size={20} />
            </div>
            <div>
              <h3 className="font-medium mb-1">Address</h3>
              <p className="text-gray-300">2B St - Deira </p>
              <p className="text-gray-300"> Dubai - United Arab Emirates</p>
              <p className="text-gray-400 text-sm mt-1">Our flagship store and offices</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-red-900/30 p-3 rounded-full">
              <Clock className="text-red-400" size={20} />
            </div>
            <div>
              <h3 className="font-medium mb-1">Business Hours</h3>
              <p className="text-gray-300">Monday - Friday: 9AM - 6PM</p>
              <p className="text-gray-300">Saturday: 10AM - 4PM</p>
              <p className="text-gray-300">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Follow Us</h3>
        <div className="flex gap-4">
          <a href="#" className="bg-black hover:bg-red-900/40 p-3 rounded-full border border-gray-700 hover:border-red-500 transition-all duration-300">
            <Instagram size={20} />
          </a>
          <a href="#" className="bg-black hover:bg-red-900/40 p-3 rounded-full border border-gray-700 hover:border-red-500 transition-all duration-300">
            <Facebook size={20} />
          </a>
          <a href="#" className="bg-black hover:bg-red-900/40 p-3 rounded-full border border-gray-700 hover:border-red-500 transition-all duration-300">
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};