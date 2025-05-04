import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { ProductType } from '../types';

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card group">
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <span className="bg-accent-600 text-white text-xs uppercase tracking-wider py-1 px-2 rounded">
              {product.category}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
          <p className="text-primary-300 text-sm mb-3">{product.brand}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-500 font-semibold">${product.price.toFixed(2)}</p>
              {product.oldPrice && (
                <p className="text-primary-400 text-sm line-through">${product.oldPrice.toFixed(2)}</p>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart} 
              className="p-2 bg-primary-800 hover:bg-accent-700 rounded-full transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;