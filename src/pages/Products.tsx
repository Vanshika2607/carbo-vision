import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Grid, List, Search, ChevronDown, ArrowRight } from 'lucide-react';
import { products, getProductsByCategory } from '../data/products';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'bike-conversion', name: 'Bike Conversions', count: products.filter(p => p.category === 'bike-conversion').length },
    { id: 'cycle-conversion', name: 'Cycle Conversions', count: products.filter(p => p.category === 'cycle-conversion').length },
    { id: 'home-automation', name: 'Home Automation', count: products.filter(p => p.category === 'home-automation').length },
    { id: 'other smart-products', name: 'Other Smart Products', count: products.filter(p => p.category === 'other smart-products').length },
  ];

  const filteredProducts = getProductsByCategory(selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Removed inline ProductCard component

  return (
    <div className="min-h-screen bg-brand-light/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex items-center gap-2 text-brand-secondary text-sm font-bold uppercase tracking-widest mb-4">
            <div className="h-1 w-8 bg-brand-secondary rounded-full"></div>
            Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary font-display mb-4">
            Custom Solutions
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Reimagining everyday life with smart, sustainable innovations — 
            crafted to transform your journey and power your creativity.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <div className="lg:w-72 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-brand-primary mb-6 flex items-center gap-2 font-display">
                <Filter className="h-5 w-5 text-brand-secondary" />
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-brand-primary text-white shadow-lg shadow-indigo-100'
                        : 'text-gray-500 hover:bg-brand-light hover:text-brand-primary'
                    }`}
                  >
                    <span className="font-bold text-sm">{category.name}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      selectedCategory === category.id ? 'bg-white/10' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Promo */}
            <div className="bg-brand-dark rounded-[2rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <h4 className="text-xl font-bold mb-3 font-display relative z-10 text-brand-secondary">Need Guidance?</h4>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed relative z-10">Our engineers are ready to help you pick the perfect kit for your needs.</p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-brand-secondary font-bold text-sm hover:translate-x-1 transition-transform">
                Consult an Expert <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
              <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm w-full sm:w-auto">
                <Search className="h-5 w-5 text-gray-400" />
                <input 
                   type="text" 
                   placeholder="Search innovations..." 
                   className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full"
                />
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-100 rounded-xl px-6 py-3 pr-12 text-sm font-bold text-brand-primary cursor-pointer hover:bg-gray-50 transition-colors shadow-sm focus:ring-2 focus:ring-brand-secondary outline-none"
                  >
                    <option value="name">A to Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-brand-primary'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-brand-primary'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-8'}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isListView={viewMode === 'list'} />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Search className="h-8 w-8 text-gray-300" />
                </div>
                <h4 className="text-xl font-bold text-brand-primary font-display mb-2">No Innovations Found</h4>
                <p className="text-gray-400 max-w-xs mx-auto">We couldn't find any products in this category. Try selecting another one.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;