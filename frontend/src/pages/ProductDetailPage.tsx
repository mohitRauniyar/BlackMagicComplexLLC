import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, ArrowLeft, Check, Truck, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { ProductType } from '../types';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';
import React from 'react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [similarProducts, setSimilarProducts] = useState<ProductType[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        
        // Fetch similar products
        const similarResponse = await axios.get(`/api/products?category=${response.data.category}&limit=3`);
        setSimilarProducts(similarResponse.data.filter((p: ProductType) => p._id !== id));
      } catch (error) {
        console.error('Error fetching product:', error);
        // Use dummy data for now
        const dummyProduct: ProductType = {
          _id: '123456', // directly assign string
          name: 'Midnight Mystique',
          brand: 'Luxe Noir',
          description:
            'A captivating blend of exotic spices and deep amber...',
          price: 89.99,
          image:
            'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          category: 'perfume',
          stock: 15,
          featured: true,
        };
        
        
        setProduct(dummyProduct);
        
        // Dummy similar products
        setSimilarProducts([
          {
            _id: '2',
            name: 'Golden Aura',
            brand: 'Éclat',
            description: 'Luxurious notes of jasmine, vanilla, and sandalwood.',
            price: 75.50,
            image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            category: 'perfume',
            stock: 8
          },
          {
            _id: '3',
            name: 'Velvet Rose',
            brand: 'Opulence',
            description: 'An elegant composition featuring Bulgarian rose and patchouli.',
            price: 120.00,
            image: 'https://images.pexels.com/photos/265144/pexels-photo-265144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            category: 'perfume',
            stock: 12
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (product && value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-medium mb-4">Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-primary-300 hover:text-accent-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Product image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary-900 rounded-lg overflow-hidden"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto object-contain aspect-square"
            />
          </motion.div>
          
          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-2">
              <span className="inline-block bg-accent-600 text-white text-xs uppercase tracking-wider py-1 px-2 rounded mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-primary-300 mb-4">{product.brand}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-3xl font-semibold text-accent-500 mb-1">
                ${product.price.toFixed(2)}
              </p>
              {product.oldPrice && (
                <p className="text-primary-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </p>
              )}
            </div>
            
            <div className="mb-8">
              <p className="text-primary-200 leading-relaxed mb-4">
                {product.description}
              </p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-primary-300">
                  Availability:
                </div>
                {product.stock > 0 ? (
                  <span className="text-green-500 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-accent-500">Out of Stock</span>
                )}
              </div>
              
              {/* Quantity selector */}
              <div className="flex items-center mb-8">
                <span className="text-primary-300 mr-4">Quantity:</span>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="bg-primary-800 hover:bg-primary-700 px-3 py-1 rounded-l-md disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="bg-primary-800 px-6 py-1">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={product.stock <= quantity}
                    className="bg-primary-800 hover:bg-primary-700 px-3 py-1 rounded-r-md disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`btn btn-primary flex-1 flex items-center justify-center ${addedToCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" /> Add to Cart
                    </>
                  )}
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="btn btn-gold flex-1 flex items-center justify-center"
                >
                  Buy Now
                </button>
                <button className="btn btn-secondary p-3">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              
              {/* Product features */}
              <div className="space-y-3 border-t border-primary-800 pt-6">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-accent-500 mr-3" />
                  <span className="text-primary-200">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-accent-500 mr-3" />
                  <span className="text-primary-200">Authenticity guaranteed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Product details tabs */}
        <div className="mb-12">
          <div className="flex border-b border-primary-800 mb-6">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'description' 
                  ? 'text-accent-500 border-b-2 border-accent-500' 
                  : 'text-primary-300 hover:text-white'
              }`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'details' 
                  ? 'text-accent-500 border-b-2 border-accent-500' 
                  : 'text-primary-300 hover:text-white'
              }`}
            >
              Details
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'shipping' 
                  ? 'text-accent-500 border-b-2 border-accent-500' 
                  : 'text-primary-300 hover:text-white'
              }`}
            >
              Shipping
            </button>
          </div>
          
          <div className="bg-primary-900 rounded-lg p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-primary-200 leading-relaxed mb-4">
                  {product.description}
                </p>
                <p className="text-primary-200 leading-relaxed">
                  Experience the allure of {product.name} by {product.brand}, a fragrance that embodies sophistication and elegance. This exquisite scent is crafted with the finest ingredients, ensuring a long-lasting impression wherever you go.
                </p>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div>
                <h3 className="text-xl font-medium mb-4">Product Specifications</h3>
                <ul className="space-y-3 text-primary-200">
                  <li className="flex">
                    <span className="font-medium w-1/3">Brand:</span>
                    <span>{product.brand}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-1/3">Category:</span>
                    <span className="capitalize">{product.category.replace('-', ' ')}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-1/3">Volume:</span>
                    <span>50ml</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-1/3">Concentration:</span>
                    <span>Eau de Parfum</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-1/3">Fragrance Family:</span>
                    <span>Oriental Spicy</span>
                  </li>
                </ul>
              </div>
            )}
            
            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-xl font-medium mb-4">Shipping Information</h3>
                <ul className="space-y-3 text-primary-200">
                  <li className="flex items-start">
                    <span className="font-medium w-1/3">Standard Shipping:</span>
                    <span>3-5 business days, $5.99 (Free on orders over $50)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium w-1/3">Express Shipping:</span>
                    <span>1-2 business days, $12.99</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium w-1/3">Returns:</span>
                    <span>30-day return policy. Unopened items only.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Similar products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProducts.map(product => (
                <div 
                  key={product._id} 
                  className="product-card group cursor-pointer"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                    <p className="text-primary-300 text-sm mb-3">{product.brand}</p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-accent-500 font-semibold">${product.price.toFixed(2)}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }} 
                        className="p-2 bg-primary-800 hover:bg-accent-700 rounded-full transition-colors"
                      >
                        <ShoppingBag className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;