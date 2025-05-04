import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Check, Truck, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { OrderType } from '../types';
import React from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Dummy data for development
        setOrders([
          {
            _id: '1',
            user: {
              _id: 'user1',
              email: 'user@example.com',
              isAdmin: false
            },
            items: [
              {
                product: {
                  _id: '1',
                  name: 'Midnight Mystique',
                  brand: 'Luxe Noir',
                  description: 'A captivating blend of exotic spices and deep amber.',
                  price: 89.99,
                  image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                  category: 'perfume',
                  stock: 15
                },
                quantity: 2,
                price: 89.99
              },
              {
                product: {
                  _id: '2',
                  name: 'Golden Aura',
                  brand: 'Éclat',
                  description: 'Luxurious notes of jasmine, vanilla, and sandalwood.',
                  price: 75.50,
                  image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                  category: 'perfume',
                  stock: 8
                },
                quantity: 1,
                price: 75.50
              }
            ],
            totalAmount: 255.48,
            shippingAddress: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'United States'
            },
            status: 'delivered',
            paymentStatus: 'paid',
            createdAt: '2023-11-15T10:30:00Z'
          },
          {
            _id: '2',
            user: {
              _id: 'user1',
              email: 'user@example.com',
              isAdmin: false
            },
            items: [
              {
                product: {
                  _id: '3',
                  name: 'Velvet Rose',
                  brand: 'Opulence',
                  description: 'An elegant composition featuring Bulgarian rose and patchouli.',
                  price: 120.00,
                  image: 'https://images.pexels.com/photos/265144/pexels-photo-265144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                  category: 'perfume',
                  stock: 12
                },
                quantity: 1,
                price: 120.00
              }
            ],
            totalAmount: 120.00,
            shippingAddress: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'United States'
            },
            status: 'shipped',
            paymentStatus: 'paid',
            createdAt: '2023-12-05T14:20:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-accent-500" />;
      case 'delivered':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-primary-900 rounded-lg p-8 text-center">
            <div className="mb-4 flex justify-center">
              <ShoppingBag className="h-16 w-16 text-primary-700" />
            </div>
            <h2 className="text-2xl font-medium mb-2">No orders yet</h2>
            <p className="text-primary-400 mb-6">You haven't placed any orders yet.</p>
            <button 
              onClick={() => navigate('/products')}
              className="btn btn-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-primary-900 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-primary-800">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-primary-400">Order #{order._id}</span>
                        <span className="text-sm text-primary-400">•</span>
                        <span className="text-sm text-primary-400">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status}</span>
                        </div>
                        <span className="text-sm text-primary-400">•</span>
                        <span className="text-accent-500 font-semibold">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="flex items-center text-accent-500 hover:text-accent-400 transition-colors"
                      >
                        {expandedOrder === order._id ? (
                          <>Hide Details <ChevronUp className="ml-1 h-4 w-4" /></>
                        ) : (
                          <>View Details <ChevronDown className="ml-1 h-4 w-4" /></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {expandedOrder === order._id && (
                  <div className="p-6 border-b border-primary-800 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <h3 className="font-medium mb-4">Order Items</h3>
                        <div className="space-y-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="w-16 h-16 flex-shrink-0">
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                              
                              <div className="flex-grow">
                                <h4 className="font-medium">{item.product.name}</h4>
                                <p className="text-sm text-primary-300">{item.product.brand}</p>
                                <div className="flex justify-between mt-1">
                                  <p className="text-accent-500">${item.price.toFixed(2)}</p>
                                  <p className="text-primary-400">x{item.quantity}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-4">Shipping Address</h3>
                        <address className="not-italic text-primary-300">
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </address>
                        
                        <div className="mt-6">
                          <h3 className="font-medium mb-4">Order Summary</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-primary-300">Total Items</span>
                              <span>
                                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-primary-300">Subtotal</span>
                              <span>
                                ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-primary-300">Shipping</span>
                              <span>
                                {order.totalAmount - order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 0
                                  ? `$${(order.totalAmount - order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}`
                                  : 'Free'
                                }
                              </span>
                            </div>
                            <div className="border-t border-primary-800 pt-2 flex justify-between font-semibold">
                              <span>Total</span>
                              <span className="text-accent-500">${order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;