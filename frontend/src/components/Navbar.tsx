import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import React from "react";
import GoogleTranslateButton from "./GoogleTranslateButton";
import { MdTranslate } from "react-icons/md";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? "bg-primary-950/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className=" px-6 w-full">
        <div className="flex items-center justify-between h-20 w-full">
          {/* Logo */}
          <Link to="/" className="flex gap-2 justify-between items-center">
            <img src="/BlackMagicLogo.png" className="w-32 p-2" alt="" />
            <span className="text-xl md:text-2xl font-bold text-accent-500 font-serif">
              Black Magic
            </span>
          </Link>
          <div className="flex justify-end gap-12 items-center w-5/6">
            {/* Search form - desktop */}
            <div className="hidden md:block relative w-1/3">
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="text-white hover:bg-black px-2 py-1 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-white hover:bg-black px-2 py-1 rounded-lg transition-colors"
              >
                Collections
              </Link>
              <Link
                to="/contact"
                className="text-white hover:bg-black px-2 py-1 rounded-lg transition-colors"
              >
                Contact Us
              </Link>

              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="text-white hover:bg-black px-2 py-1 rounded-lg transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right section with icons */}
            <div className="flex items-center space-x-2">
              <Link
                to="/cart"
                className="relative p-2 text-white hover:text-accent-400 transition-colors"
              >
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
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm hover:bg-primary-800 transition-colors"
                    >
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
                <Link
                  to="/login"
                  className="p-2 text-white hover:text-accent-400 transition-colors"
                >
                  <User className="h-6 w-6" />
                </Link>
              )}

              <div className="relative inline-block">
                <MdTranslate
                  size={24}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="cursor-pointer"
                />

                {dropdownOpen && (
                  <div className="absolute top-full right-0 z-[9999] mt-2 bg-white shadow-lg rounded p-2">
                    <GoogleTranslateButton />
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-900/60 backdrop-blur-md py-4 px-4 animate-fade-in">
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
              Collections
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-accent-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
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
