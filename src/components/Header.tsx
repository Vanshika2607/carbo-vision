import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Zap, LogOut, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const { currentUser, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-brand-primary p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-200">
              <Zap className="h-6 w-6 text-brand-secondary fill-brand-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-brand-primary font-display tracking-tight leading-none">Carbo Vision</h1>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Private Limited</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-brand-primary bg-brand-light'
                    : 'text-gray-500 hover:text-brand-primary hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Tools & Auth */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex h-10 w-[1px] bg-gray-100 mx-2"></div>
            
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-500 hover:text-brand-primary hover:bg-brand-light rounded-xl transition-all duration-300"
            >
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-secondary text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center ring-2 ring-white">
                  {items.length}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="hidden md:flex items-center gap-3 bg-brand-light px-1.5 py-1.5 rounded-2xl border border-blue-50">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-blue-100/50">
                  <User className="w-4 h-4 text-brand-primary" />
                </div>
                <span className="text-sm font-bold text-brand-primary pr-2">
                  {currentUser.name}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="bg-white p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 border border-transparent hover:border-red-100 shadow-sm"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 text-gray-500 hover:text-brand-primary transition-colors bg-gray-50 hover:bg-brand-light rounded-xl"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-gray-50 animate-fade-in">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-brand-primary bg-brand-light'
                      : 'text-gray-500 hover:text-brand-primary hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-50">
              {currentUser ? (
                <div className="flex items-center justify-between bg-brand-light p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <User className="w-5 h-5 text-brand-primary" />
                    </div>
                    <span className="text-base font-bold text-brand-primary">
                      {currentUser.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      navigate('/');
                    }}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center py-4 rounded-2xl text-base font-bold text-white bg-brand-primary hover:bg-brand-dark transition-all duration-300 shadow-lg shadow-indigo-100"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;