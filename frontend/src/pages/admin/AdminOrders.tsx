import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShoppingBag, Truck, CheckCircle, Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { OrderType } from '../../types';

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateSort, setDateSort] = useState('desc');
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app we would use these filters in the API call
        // const response = await axios.get(`/api/admin/orders?status=${statusFilter}&sort=${dateSort}&page=${page}`);
        // setOrders(response.data);
        
        // Dummy data for development
        const dummyOrders = Array(25).fill(null).map((_, index) => {
          const statuses = ['pending', 'processing', 'shipped', 'delivered'];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const totalAmount = Math.floor(Math.random() * 300) + 50;
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
          
          return {
            _id: String(index + 1),
            user: {
              _id: `user${index % 10 + 1}`,
              email: `customer${index % 10 + 1}@example.com`,
              isAdmin: false
            },
            items: [
              {
                product: {
                  _id: String(Math.floor(Math.random() * 3) + 1),
                  name: ['Midnight Mystique', 'Golden Aura', 'Velvet Rose'][Math.floor(Math.random() * 3)],
                  brand: ['Luxe Noir', 'Éclat', 'Opulence'][Math.floor(Math.random() * 3)],
                  description: 'Product description',
                  price: Math.floor(Math.random() * 100) + 50,
                  image: [
                    'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                    'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                    'https://images.pexels.com/photos/265144/pexels-photo-265144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                  ][Math.floor(Math.random() * 3)],
                  category: 'perfume',
                  stock: Math.floor(Math.random() * 20) + 5
                },
                quantity: Math.floor(Math.random() * 3) + 1,
                price: Math.floor(Math.random() * 100) + 50
              }
            ],
            totalAmount,
            shippingAddress: {
              street: `${Math.floor(Math.random() * 999) + 1} Main St`,
              city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
              state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
              zipCode: String(Math.floor(Math.random() * 90000) + 10000),
              country: 'United States'
            },
            status,
            paymentStatus: 'paid',
            createdAt: date.toISOString()
          };
        });
        
        setOrders(dummyOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter, dateSort, page]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</span>;
      case 'processing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><ShoppingBag className="h-3 w-3 mr-1" /> Processing</span>;
      case 'shipped':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Truck className="h-3 w-3 mr-1" /> Shipped</span>;
      case 'delivered':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Delivered</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // In a real app we would update the status on the server
      // await axios.patch(`/api/admin/orders/${orderId}`, { status: newStatus });
      
      // For now, just update the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus as any } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order._id.includes(searchTerm) || 
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (dateSort === 'asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const displayedOrders = filteredOrders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">Manage Orders</h1>
          <Link to="/admin" className="text-accent-500 hover:text-accent-400 flex items-center">
            Back to Dashboard
          </Link>
        </div>
        
        {/* Filters */}
        <div className="bg-primary-900 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative grow">
              <input
                type="text"
                placeholder="Search by order ID or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-primary-400" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Filter:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Sort:</span>
                <button
                  onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
                  className="input-field flex items-center"
                >
                  Date {dateSort === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Orders List */}
        <div className="bg-primary-900 rounded-lg overflow-hidden">
          {displayedOrders.length === 0 ? (
            <div className="p-8 text-center">
              <Filter className="h-12 w-12 text-primary-700 mx-auto mb-3" />
              <h3 className="text-xl font-medium mb-2">No orders found</h3>
              <p className="text-primary-400 mb-4">Try adjusting your search or filter criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-primary-800">
                  <thead className="bg-primary-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-primary-900 divide-y divide-primary-800">
                    {displayedOrders.map((order) => (
                      <>
                        <tr key={order._id} className="hover:bg-primary-800/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            #{order._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {order.user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-300">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-accent-500">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button 
                              onClick={() => toggleOrderDetails(order._id)}
                              className="text-accent-500 hover:text-accent-400 mr-3"
                            >
                              {expandedOrder === order._id ? 'Hide' : 'View'}
                            </button>
                          </td>
                        </tr>
                        {expandedOrder === order._id && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-primary-800/30">
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
                                  
                                  <div className="mt-6">
                                    <h3 className="font-medium mb-3">Update Status</h3>
                                    <div className="flex flex-wrap gap-2">
                                      {['pending', 'processing', 'shipped', 'delivered'].map(status => (
                                        <button
                                          key={status}
                                          onClick={() => handleUpdateStatus(order._id, status)}
                                          disabled={order.status === status}
                                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            order.status === status 
                                              ? 'bg-primary-700 text-primary-300 cursor-not-allowed' 
                                              : 'bg-primary-800 hover:bg-primary-700 text-white'
                                          }`}
                                        >
                                          {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                      ))}
                                    </div>
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
                                      <div className="border-t border-primary-700 pt-2 flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span className="text-accent-500">${order.totalAmount.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-primary-800 flex justify-between items-center">
                  <span className="text-sm text-primary-300">
                    Showing {(page - 1) * ordersPerPage + 1} to {Math.min(page * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="p-2 rounded-md bg-primary-800 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                      .map((p, i, arr) => (
                        <>
                          {i > 0 && arr[i - 1] !== p - 1 && (
                            <span key={`ellipsis-${p}`} className="px-2">...</span>
                          )}
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              p === page
                                ? 'bg-accent-600 text-white'
                                : 'bg-primary-800 hover:bg-primary-700 text-white'
                            }`}
                          >
                            {p}
                          </button>
                        </>
                      ))}
                    
                    <button
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="p-2 rounded-md bg-primary-800 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;