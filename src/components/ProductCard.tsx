import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  isListView?: boolean;
}

const ProductCard = ({ product, isListView = false }: ProductCardProps) => {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isListView ? 'flex flex-col sm:flex-row' : 'flex flex-col h-full'}`}>
      {/* Image Container */}
      <div className={`relative overflow-hidden ${isListView ? 'sm:w-64 h-64' : 'aspect-[4/3]'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-brand-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm tracking-wider">OUT OF STOCK</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <Link
            to={`/product/${product.id}`}
            className="bg-white text-brand-primary px-6 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-brand-secondary hover:text-white"
          >
            Quick View
          </Link>
        </div>
      </div>

      {/* Content Container */}
      <div className={`p-6 flex flex-col flex-1 ${isListView ? 'justify-between' : ''}`}>
        <div>
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center text-brand-accent">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-sm font-bold text-gray-700">{product.rating}</span>
            </div>
            <span className="text-gray-400 text-xs">({product.reviews} reviews)</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors mb-2 font-display">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-2xl font-extrabold text-brand-primary font-display">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-base text-gray-400 line-through mb-1">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              to={`/product/${product.id}`}
              className="flex-1 bg-brand-primary text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            >
              View Details
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
            <button
               className="p-3 rounded-xl border border-gray-200 text-brand-primary hover:bg-brand-light transition-colors"
               aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
