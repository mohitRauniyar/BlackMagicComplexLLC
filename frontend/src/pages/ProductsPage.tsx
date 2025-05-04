import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ProductType } from '../types';
import React from 'react';

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    brand: searchParams.get('brand') || '',
    search: searchParams.get('search') || ''
  });

  const [allBrands, setAllBrands] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build query params from filters
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.search) params.append('search', filters.search);
        
        const response = await axios.get(`/api/products?${params.toString()}`);
        // Ensure response.data is treated as an array
        const productsData = Array.isArray(response.data) ? response.data : [];
        setProducts(productsData);
        
        // Extract unique brands for filter, ensuring we're working with an array
        const brands = [...new Set(productsData.map((p: ProductType) => p.brand))];
        setAllBrands(brands);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Use dummy data for now
        const dummyProducts = [
          {
            _id: '1',
            name: 'Midnight Mystique',
            brand: 'Luxe Noir',
            description: 'A captivating blend of exotic spices and deep amber.',
            price: 89.99,
            image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            category: 'perfume',
            stock: 15
          },
          {
            _id: '2',
            name: 'Golden Aura',
            brand: 'Éclat',
            description: 'Luxurious notes of jasmine, vanilla, and sandalwood.',
            price: 75.50,
            oldPrice: 95.00,
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
          },
          {
            _id: '4',
            name: 'Ocean Breeze',
            brand: 'Aqua Vitae',
            description: 'Fresh and invigorating scent with notes of sea salt and citrus.',
            price: 65.00,
            image: 'https://images.pexels.com/photos/190333/pexels-photo-190333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            category: 'body-spray',
            stock: 20
          },
          {
            _id: '5',
            name: 'Arctic Chill',
            brand: 'Nordic',
            description: 'A cool, refreshing deodorant with long-lasting protection.',
            price: 25.99,
            image: 'https://images.pexels.com/photos/5748755/pexels-photo-5748755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            category: 'deodorant',
            stock: 30
          },
          {
            _id: '6',
            name: 'Amber Woods',
            brand: 'Luxe Noir',
            description: 'Warm and woody scent perfect for evening occasions.',
            price: 95.00,
            image: 'https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            category: 'perfume',
            stock: 7
          }
        ];
        
        // Filter dummy data based on search params
        let filteredProducts = dummyProducts;
        
        if (filters.category) {
          filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        }
        
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.brand.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
          );
        }
        
        if (filters.brand) {
          filteredProducts = filteredProducts.filter(p => p.brand === filters.brand);
        }
        
        if (filters.minPrice) {
          filteredProducts = filteredProducts.filter(p => p.price >= Number(filters.minPrice));
        }
        
        if (filters.maxPrice) {
          filteredProducts = filteredProducts.filter(p => p.price <= Number(filters.maxPrice));
        }
        
        setProducts(filteredProducts);
        setAllBrands([...new Set(dummyProducts.map(p => p.brand))]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Update URL with filters
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newSearchParams.set(key, value);
    });
    setSearchParams(newSearchParams);
    
  }, [filters, setSearchParams]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      search: filters.search // Keep the search term
    });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-2">Our Collection</h1>
        <p className="text-primary-300 mb-8">Discover premium fragrances for every occasion</p>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile filter toggle */}
          <button 
            className="md:hidden flex items-center justify-center bg-primary-800 px-4 py-2 rounded-md mb-4"
            onClick={toggleFilter}
          >
            {isFilterOpen ? (
              <>
                <X className="h-5 w-5 mr-2" /> Close Filters
              </>
            ) : (
              <>
                <SlidersHorizontal className="h-5 w-5 mr-2" /> Filter Products
              </>
            )}
          </button>
          
          {/* Filter sidebar - desktop always visible, mobile conditional */}
          <aside className={`md:w-1/4 lg:w-1/5 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-primary-900 rounded-lg p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium flex items-center">
                  <Filter className="h-5 w-5 mr-2" /> Filters
                </h2>
                
                <button 
                  onClick={clearFilters}
                  className="text-xs text-accent-500 hover:text-accent-400"
                >
                  Clear All
                </button>
              </div>
              
              {/* Category filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {['perfume', 'deodorant', 'body-spray'].map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category}
                        onChange={() => handleFilterChange('category', category)}
                        className="mr-2 form-radio text-accent-600"
                      />
                      <span className="capitalize">{category.replace('-', ' ')}</span>
                    </label>
                  ))}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === ''}
                      onChange={() => handleFilterChange('category', '')}
                      className="mr-2 form-radio text-accent-600"
                    />
                    <span>All categories</span>
                  </label>
                </div>
              </div>
              
              {/* Price range filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="flex flex-col space-y-3">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              
              {/* Brand filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Brand</h3>
                <div className="space-y-2">
                  {allBrands.map(brand => (
                    <label key={brand} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        checked={filters.brand === brand}
                        onChange={() => handleFilterChange('brand', brand)}
                        className="mr-2 form-radio text-accent-600"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={filters.brand === ''}
                      onChange={() => handleFilterChange('brand', '')}
                      className="mr-2 form-radio text-accent-600"
                    />
                    <span>All brands</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Products grid */}
          <div className="md:w-3/4 lg:w-4/5">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-primary-900 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-primary-400 mb-4">Try changing your filter criteria or search term.</p>
                <button 
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <p className="text-primary-300 mb-4">{products.length} products found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;