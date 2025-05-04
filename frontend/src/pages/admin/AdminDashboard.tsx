import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen, Users, DollarSign, Clock, BarChart3, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { OrderType } from '../../types';

const AdminDashboard = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would fetch this data from the API
        // const ordersResponse = await axios.get('/api/admin/orders');
        // const statsResponse = await axios.get('/api/admin/stats');
        // setOrders(ordersResponse.data);
        // setStats(statsResponse.data);
        
        // Dummy data for development
        const dummyOrders = [
          {
            _id: '1',
            user: {
              _id: 'user1',
              email: 'customer1@example.com',
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
              }
            ],
            totalAmount: 179.98,
            shippingAddress: {
              street: '123 Oak St',
              city: 'Boston',
              state: 'MA',
              zipCode: '02108',
              country: 'United States'
            },
            status: 'pending',
            paymentStatus: 'paid',
            createdAt: '2023-12-18T14:20:00Z'
          },
          {
            _id: '2',
            user: {
              _id: 'user2',
              email: 'customer2@example.com',
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
              street: '456 Maple Ave',
              city: 'Chicago',
              state: 'IL',
              zipCode: '60601',
              country: 'United States'
            },
            status: 'shipped',
            paymentStatus: 'paid',
            createdAt: '2023-12-15T09:45:00Z'
          },
          {
            _id: '3',
            user: {
              _id: 'user3',
              email: 'customer3@example.com',
              isAdmin: false
            },
            items: [
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
                quantity: 3,
                price: 75.50
              }
            ],
            totalAmount: 226.50,
            shippingAddress: {
              street: '789 Pine Blvd',
              city: 'Los Angeles',
              state: 'CA',
              zipCode: '90001',
              country: 'United States'
            },
            status: 'delivered',
            paymentStatus: 'paid',
            createdAt: '2023-12-10T16:30:00Z'
          }
        ];
        
        setOrders(dummyOrders);
        
        // Calculate stats from orders
        const pendingOrders = dummyOrders.filter(order => order.status === 'pending').length;
        const shippedOrders = dummyOrders.filter(order => order.status === 'shipped').length;
        const deliveredOrders = dummyOrders.filter(order => order.status === 'delivered').length;
        const totalRevenue = dummyOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        setStats({
          totalOrders: dummyOrders.length,
          totalRevenue,
          pendingOrders,
          shippedOrders,
          deliveredOrders,
          totalProducts: 15,  // Dummy value
          totalUsers: 10      // Dummy value
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
          <Link to="/admin/orders" className="btn btn-primary">
            View All Orders
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-primary-900 rounded-lg p-6 flex items-start">
            <div className="p-3 bg-accent-900/40 rounded-lg mr-4">
              <DollarSign className="h-6 w-6 text-accent-500" />
            </div>
            <div>
              <p className="text-primary-300 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
          
          <div className="bg-primary-900 rounded-lg p-6 flex items-start">
            <div className="p-3 bg-primary-800 rounded-lg mr-4">
              <PackageOpen className="h-6 w-6 text-primary-300" />
            </div>
            <div>
              <p className="text-primary-300 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              <div className="flex items-center mt-1 space-x-2">
                <span className="flex items-center text-xs text-yellow-500">
                  <Clock className="h-3 w-3 mr-1" /> {stats.pendingOrders} pending
                </span>
                <span className="flex items-center text-xs text-accent-500">
                  <Truck className="h-3 w-3 mr-1" /> {stats.shippedOrders} shipped
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-primary-900 rounded-lg p-6 flex items-start">
            <div className="p-3 bg-primary-800 rounded-lg mr-4">
              <ShoppingBag className="h-6 w-6 text-primary-300" />
            </div>
            <div>
              <p className="text-primary-300 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
            </div>
          </div>
          
          <div className="bg-primary-900 rounded-lg p-6 flex items-start">
            <div className="p-3 bg-primary-800 rounded-lg mr-4">
              <Users className="h-6 w-6 text-primary-300" />
            </div>
            <div>
              <p className="text-primary-300 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>
        
        {/* Orders Chart - Simplified for this implementation */}
        <div className="bg-primary-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-accent-500" /> Sales Overview
            </h2>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            <p className="text-primary-400">
              Sales chart visualization would appear here with actual data.
            </p>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-primary-900 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-primary-800">
            <h2 className="text-xl font-medium">Recent Orders</h2>
          </div>
          
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
                {orders.map((order) => (
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
                      <Link to={`/admin/orders/${order._id}`} className="text-accent-500 hover:text-accent-400">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-primary-800 text-center">
            <Link to="/admin/orders" className="text-accent-500 hover:text-accent-400 font-medium">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;