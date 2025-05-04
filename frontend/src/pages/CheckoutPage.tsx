import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import React from 'react';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'United States'
  });
  
  const [payment, setPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  if (cartItems.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create order in backend
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: address,
        totalAmount: totalPrice + (totalPrice > 50 ? 0 : 5.99)
      };
      
      await axios.post('/api/orders', orderData);
      
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Order creation failed:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
        
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary-900 rounded-lg p-8 text-center max-w-md mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-medium mb-2">Order Placed Successfully!</h2>
            <p className="text-primary-300 mb-6">
              Thank you for your purchase. We've received your order and will process it shortly.
            </p>
            <button 
              onClick={() => navigate('/orders')}
              className="btn btn-primary w-full mb-3"
            >
              View My Orders
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="btn btn-secondary w-full"
            >
              Continue Shopping
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout steps */}
            <div className="lg:col-span-2">
              {/* Steps indicator */}
              <div className="mb-8">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-accent-600' : 'bg-green-600'} text-white`}>
                    1
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${step === 1 ? 'bg-primary-700' : 'bg-green-600'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-accent-600' : step > 2 ? 'bg-green-600' : 'bg-primary-700'} text-white`}>
                    2
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className={step === 1 ? 'text-white' : 'text-green-500'}>Shipping</span>
                  <span className={step === 2 ? 'text-white' : step > 2 ? 'text-green-500' : 'text-primary-500'}>Payment</span>
                </div>
              </div>
              
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-primary-900 rounded-lg p-6"
                >
                  <h2 className="text-xl font-medium mb-6 flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-accent-500" /> Shipping Address
                  </h2>
                  
                  <form onSubmit={handleAddressSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <label htmlFor="street" className="block text-sm font-medium mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="street"
                          value={address.street}
                          onChange={(e) => setAddress({...address, street: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={address.city}
                          onChange={(e) => setAddress({...address, city: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium mb-2">
                          State / Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          value={address.state}
                          onChange={(e) => setAddress({...address, state: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                          Zip / Postal Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          value={address.zipCode}
                          onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium mb-2">
                          Country
                        </label>
                        <select
                          id="country"
                          value={address.country}
                          onChange={(e) => setAddress({...address, country: e.target.value})}
                          className="input-field"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                        </select>
                      </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-full">
                      Continue to Payment
                    </button>
                  </form>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-primary-900 rounded-lg p-6"
                >
                  <h2 className="text-xl font-medium mb-6 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-accent-500" /> Payment Information
                  </h2>
                  
                  {error && (
                    <div className="mb-6 p-3 bg-accent-900/30 border border-accent-800 rounded-lg flex items-center text-accent-400">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={payment.cardNumber}
                          onChange={(e) => setPayment({...payment, cardNumber: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          placeholder="John Doe"
                          value={payment.cardName}
                          onChange={(e) => setPayment({...payment, cardName: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={payment.expiryDate}
                            onChange={(e) => setPayment({...payment, expiryDate: e.target.value})}
                            className="input-field"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            placeholder="123"
                            value={payment.cvv}
                            onChange={(e) => setPayment({...payment, cvv: e.target.value})}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full flex items-center justify-center"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            Processing...
                          </span>
                        ) : (
                          'Complete Purchase'
                        )}
                      </button>
                      
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn btn-secondary w-full"
                      >
                        Back to Shipping
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
            
            {/* Order summary */}
            <div>
              <div className="bg-primary-900 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                  {cartItems.map((item, index) => (
                    <div key={`${item._id}-${index}`} className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium text-white text-sm">{item.name}</h3>
                        <p className="text-xs text-primary-300">{item.brand}</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-accent-500 text-sm">${item.price.toFixed(2)}</p>
                          <p className="text-primary-400 text-sm">x{item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;