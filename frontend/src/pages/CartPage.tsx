import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';
import React from 'react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 300);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">Your Shopping Bag</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-primary-900 rounded-lg p-8 text-center">
            <div className="mb-4 flex justify-center">
              <ShoppingBag className="h-16 w-16 text-primary-700" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your bag is empty</h2>
            <p className="text-primary-400 mb-6">Looks like you haven't added any items to your bag yet.</p>
            <Link to="/products" className="btn btn-primary inline-flex items-center">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-primary-900 rounded-lg overflow-hidden"
              >
                <div className="p-4 md:p-6 border-b border-primary-800">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium">Items ({cartItems.length})</h2>
                    <button 
                      onClick={handleClearCart}
                      className={`text-sm text-accent-500 hover:text-accent-400 flex items-center ${isClearing ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Clear All
                    </button>
                  </div>
                </div>
                
                <ul>
                  {cartItems.map((item, index) => (
                    <motion.li 
                      key={`${item._id}-${index}`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="p-4 md:p-6 border-b border-primary-800 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    >
                      <div className="sm:w-20 h-20 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium text-white">{item.name}</h3>
                        <p className="text-sm text-primary-300 mb-1">{item.brand}</p>
                        <p className="text-accent-500 font-semibold">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="bg-primary-800 hover:bg-primary-700 px-3 py-1 rounded-l-md"
                          >
                            -
                          </button>
                          <span className="bg-primary-800 px-4 py-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="bg-primary-800 hover:bg-primary-700 px-3 py-1 rounded-r-md"
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-accent-500 hover:text-accent-400"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            {/* Order summary */}
            <div>
              <div className="bg-primary-900 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-primary-300">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-300">Shipping</span>
                    <span>{totalPrice > 50 ? 'Free' : '$5.99'}</span>
                  </div>
                  <div className="border-t border-primary-800 pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-accent-500">
                      ${(totalPrice + (totalPrice > 50 ? 0 : 5.99)).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/checkout')}
                  className="btn btn-primary w-full mb-3"
                >
                  Proceed to Checkout
                </button>
                
                <Link 
                  to="/products" 
                  className="btn btn-secondary w-full flex items-center justify-center"
                >
                  Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;