import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage 
          ? 'bg-primary-950/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-accent-500 font-serif">Luxe Scent</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-accent-400 transition-colors">Home</Link>
            <Link to="/products" className="text-white hover:text-accent-400 transition-colors">Shop</Link>
            {user?.isAdmin && (
              <Link to="/admin" className="text-white hover:text-accent-400 transition-colors">Admin</Link>
            )}
          </nav>

          {/* Search form - desktop */}
          <div className="hidden md:block relative w-1/4">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-full bg-primary-800/70 border border-primary-700 focus:outline-none focus:ring-1 focus:ring-accent-500 text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary-400" />
            </form>
          </div>

          {/* Right section with icons */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-white hover:text-accent-400 transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className="p-2 text-white hover:text-accent-400 transition-colors">
                  <User className="h-6 w-6" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-primary-900 border border-primary-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-2 px-4 border-b border-primary-800 font-medium text-sm">
                    {user.email}
                  </div>
                  <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-primary-800 transition-colors">
                    My Orders
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-accent-500 hover:bg-primary-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-white hover:text-accent-400 transition-colors">
                <User className="h-6 w-6" />
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-900 py-4 px-4 animate-fade-in">
          <nav className="flex flex-col space-y-4 mb-4">
            <Link 
              to="/" 
              className="text-white hover:text-accent-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-white hover:text-accent-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="text-white hover:text-accent-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {user ? (
              <>
                <Link 
                  to="/orders" 
                  className="text-white hover:text-accent-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-accent-500 hover:text-accent-400 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-white hover:text-accent-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
          
          {/* Search form - mobile */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-full bg-primary-800 border border-primary-700 focus:outline-none focus:ring-1 focus:ring-accent-500 text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary-400" />
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;