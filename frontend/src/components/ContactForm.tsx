import React, { useState } from 'react';
import { Send } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send the form data to your backend
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormStatus('idle');
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }, 1000);
  };
  
  return (
    <div className="bg-black/60 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-gray-800 shadow-xl hover:shadow-red-900/10 transition-all duration-500">
      <h2 className="text-2xl font-serif mb-6 text-red-500">Send Us a Message</h2>
      
      {formStatus === 'success' ? (
        <div className="bg-green-900/40 border border-green-700 text-green-200 p-4 rounded-md animate-fade-in">
          <p className="font-medium">Thank you for contacting us!</p>
          <p className="text-sm mt-1">We've received your message and will get back to you shortly.</p>
        </div>
      ) : formStatus === 'error' ? (
        <div className="bg-red-900/40 border border-red-700 text-red-200 p-4 rounded-md animate-fade-in">
          <p className="font-medium">There was an error submitting your message</p>
          <p className="text-sm mt-1">Please try again or contact us directly at contact@essenceperfumes.com</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-gray-600 focus:border-red-500 py-2 text-white outline-none transition-all peer"
            />
            <label 
              htmlFor="name"
              className={`absolute left-0 transition-all ${formState.name ? 'text-xs -top-4 text-red-400' : 'text-gray-400 top-2 peer-focus:text-xs peer-focus:-top-4 peer-focus:text-red-400'}`}
            >
              Your Name
            </label>
          </div>
          
          <div className="relative group">
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-gray-600 focus:border-red-500 py-2 text-white outline-none transition-all peer"
            />
            <label 
              htmlFor="email"
              className={`absolute left-0 transition-all ${formState.email ? 'text-xs -top-4 text-red-400' : 'text-gray-400 top-2 peer-focus:text-xs peer-focus:-top-4 peer-focus:text-red-400'}`}
            >
              Email Address
            </label>
          </div>
          
          <div className="relative group">
            <input 
              type="text" 
              id="subject" 
              name="subject"
              value={formState.subject}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-gray-600 focus:border-red-500 py-2 text-white outline-none transition-all peer"
            />
            <label 
              htmlFor="subject"
              className={`absolute left-0 transition-all ${formState.subject ? 'text-xs -top-4 text-red-400' : 'text-gray-400 top-2 peer-focus:text-xs peer-focus:-top-4 peer-focus:text-red-400'}`}
            >
              Subject
            </label>
          </div>
          
          <div className="relative group">
            <textarea 
              id="message" 
              name="message"
              value={formState.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-transparent border-b border-gray-600 focus:border-red-500 py-2 text-white outline-none transition-all peer resize-none"
            ></textarea>
            <label 
              htmlFor="message"
              className={`absolute left-0 transition-all ${formState.message ? 'text-xs -top-4 text-red-400' : 'text-gray-400 top-2 peer-focus:text-xs peer-focus:-top-4 peer-focus:text-red-400'}`}
            >
              Your Message
            </label>
          </div>
          
          <button 
            type="submit" 
            className="bg-red-800 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/30 w-full md:w-auto"
          >
            <Send size={18} />
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};