import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-950 border-t border-primary-800 pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div>
            <h3 className="text-xl font-serif font-bold text-accent-500 mb-4">Luxe Scent</h3>
            <p className="text-primary-300 mb-4">Premium fragrances for the discerning individual. Discover your signature scent with our curated collection.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-400 hover:text-accent-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary-400 hover:text-accent-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary-400 hover:text-accent-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-primary-300 hover:text-accent-400 transition-colors">Shop All</Link>
              </li>
              <li>
                <Link to="/products?category=perfume" className="text-primary-300 hover:text-accent-400 transition-colors">Perfumes</Link>
              </li>
              <li>
                <Link to="/products?category=deodorant" className="text-primary-300 hover:text-accent-400 transition-colors">Deodorants</Link>
              </li>
              <li>
                <Link to="/products?category=body-spray" className="text-primary-300 hover:text-accent-400 transition-colors">Body Sprays</Link>
              </li>
            </ul>
          </div>
          
          {/* Info links */}
          <div>
            <h4 className="text-white font-medium mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-300 hover:text-accent-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-accent-400 transition-colors">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-accent-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-primary-300 hover:text-accent-400 transition-colors">Terms & Conditions</a>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h4 className="text-white font-medium mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-accent-500 mr-2 mt-0.5" />
                <span className="text-primary-300">123 Perfume Lane, Fragrance City, FC 54321</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-accent-500 mr-2" />
                <span className="text-primary-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-accent-500 mr-2" />
                <span className="text-primary-300">info@luxescent.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Luxe Scent Boutique. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="Visa" className="h-6" />
            <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Mastercard" className="h-6" />
            <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="PayPal" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;