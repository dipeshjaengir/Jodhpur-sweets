import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const Header = ({ onCartOpen, onMobileMenuOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotals, wishlistItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = getTotals();
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
      scrolled 
        ? 'bg-brand-chocolate border-b border-brand-gold/25 py-3 shadow-lg' 
        : 'bg-brand-chocolate/85 backdrop-blur-md border-b border-brand-gold/10 py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 relative flex items-center justify-between h-12">
        
        {/* Navigation - Left on desktop */}
        <div className="flex items-center">
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[10px] uppercase tracking-luxury font-sans font-light text-brand-cream/80">
            <Link to="/" className={`hover:text-brand-gold transition-colors duration-300 ${location.pathname === '/' ? 'text-brand-gold font-medium' : ''}`}>
              Home
            </Link>
            
            <div className="relative">
              <button 
                onMouseEnter={() => setCollectionsOpen(true)}
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="hover:text-brand-gold flex items-center space-x-1 transition-colors duration-300"
              >
                <span>Collections</span>
                <ChevronDown className="w-3 h-3 text-brand-gold" />
              </button>
              
              {collectionsOpen && (
                <div 
                  onMouseLeave={() => setCollectionsOpen(false)}
                  className="absolute top-full left-0 mt-3 w-48 bg-brand-chocolate border border-brand-gold/25 shadow-2xl py-2 flex flex-col z-50 animate-[fadeIn_0.2s_ease-out]"
                >
                  <Link to="/collection/sweets" onClick={() => setCollectionsOpen(false)} className="px-4 py-2 hover:bg-brand-maroon/20 hover:text-brand-gold text-brand-cream/90 transition-colors">Sweets (Mithai)</Link>
                  <Link to="/collection/namkeen" onClick={() => setCollectionsOpen(false)} className="px-4 py-2 hover:bg-brand-maroon/20 hover:text-brand-gold text-brand-cream/90 transition-colors">Namkeen (Savory)</Link>
                  <Link to="/collection/wedding" onClick={() => setCollectionsOpen(false)} className="px-4 py-2 hover:bg-brand-maroon/20 hover:text-brand-gold text-brand-cream/90 transition-colors">Wedding Hampers</Link>
                  <Link to="/collection/corporate" onClick={() => setCollectionsOpen(false)} className="px-4 py-2 hover:bg-brand-maroon/20 hover:text-brand-gold text-brand-cream/90 transition-colors">Corporate Gifts</Link>
                  <Link to="/collection/festival" onClick={() => setCollectionsOpen(false)} className="px-4 py-2 hover:bg-brand-maroon/20 hover:text-brand-gold text-brand-cream/90 transition-colors">Festival Specials</Link>
                </div>
              )}
            </div>

            <Link to="/custom-box" className={`hover:text-brand-gold flex items-center space-x-1 text-brand-gold font-medium transition-colors duration-300 ${location.pathname === '/custom-box' ? 'underline decoration-brand-gold underline-offset-4' : ''}`}>
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Custom Box</span>
            </Link>
            
            <Link to="/about" className={`hover:text-brand-gold transition-colors duration-300 ${location.pathname === '/about' ? 'text-brand-gold font-medium' : ''}`}>
              Our Story
            </Link>
          </nav>
        </div>

        {/* Brand Logo - Centered absolutely */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <Link to="/" className="flex flex-col items-center select-none text-center transform hover:scale-[1.02] transition-transform duration-300">
            <span className="font-serif text-base md:text-lg lg:text-xl font-light tracking-[0.25em] text-brand-cream leading-tight">
              NEW JODHPUR
            </span>
            <span className="font-serif text-[9px] md:text-[10px] font-light tracking-[0.3em] text-brand-gold">
              SWEET HOME
            </span>
            <span className="font-sans text-[6px] tracking-[0.35em] text-brand-cream/60 uppercase">
              Mandawa
            </span>
          </Link>
        </div>

        {/* Navigation - Right & Icons */}
        <div className="flex items-center space-x-6">
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[10px] uppercase tracking-luxury font-sans font-light text-brand-cream/80 mr-4">
            <Link to="/gallery" className={`hover:text-brand-gold transition-colors duration-300 ${location.pathname === '/gallery' ? 'text-brand-gold font-medium' : ''}`}>
              Gallery
            </Link>
            <Link to="/book-table" className={`hover:text-brand-gold transition-colors duration-300 ${location.pathname === '/book-table' ? 'text-brand-gold font-medium' : ''}`}>
              Book Table
            </Link>
            <Link to="/contact" className={`hover:text-brand-gold transition-colors duration-300 ${location.pathname === '/contact' ? 'text-brand-gold font-medium' : ''}`}>
              Contact
            </Link>
          </nav>

          {/* Action Icons & User Status */}
          <div className="flex items-center space-x-6 text-brand-cream">
            {user ? (
              <>
                {/* Wishlist */}
                <Link to="/account?tab=wishlist" className="hover:text-brand-gold transition-colors relative py-1" aria-label="Wishlist">
                  <Heart className="w-5 h-5 font-light text-brand-cream hover:text-brand-gold" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-brand-gold text-brand-chocolate text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold font-sans">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                {/* Cart Button */}
                <button 
                  onClick={onCartOpen}
                  className="hover:text-brand-gold transition-colors relative flex items-center py-1" 
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5 text-brand-cream hover:text-brand-gold" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-brand-maroon text-brand-cream border border-brand-gold/40 text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold font-sans">
                      {itemCount}
                    </span>
                  )}
                </button>

                {/* Avatar / Profile */}
                <Link 
                  to={isAdmin ? "/admin" : "/account?tab=profile"} 
                  className="flex items-center space-x-2 group" 
                  aria-label="Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-gold text-brand-chocolate flex items-center justify-center font-serif text-[10px] font-bold border border-brand-gold/40 transition-transform group-hover:scale-105">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden xl:inline text-[9px] uppercase tracking-wider text-brand-cream/80 hover:text-brand-gold">
                    {isAdmin ? 'Admin' : 'Profile'}
                  </span>
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-[9px] uppercase tracking-widest text-brand-cream/60 hover:text-red-400 transition-colors font-semibold font-sans border border-brand-gold/15 px-2 py-1 hover:border-red-400 rounded-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Wishlist */}
                <Link to="/auth?redirect=/account?tab=wishlist" className="hover:text-brand-gold transition-colors relative py-1" aria-label="Wishlist">
                  <Heart className="w-5 h-5 font-light text-brand-cream hover:text-brand-gold" />
                </Link>

                {/* Cart Button */}
                <button 
                  onClick={onCartOpen}
                  className="hover:text-brand-gold transition-colors relative flex items-center py-1" 
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5 text-brand-cream hover:text-brand-gold" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-brand-maroon text-brand-cream border border-brand-gold/40 text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold font-sans">
                      {itemCount}
                    </span>
                  )}
                </button>

                {/* Login Button */}
                <Link 
                  to="/auth" 
                  className="text-[9px] uppercase tracking-widest font-bold text-brand-gold border border-brand-gold/30 hover:border-brand-gold px-3.5 py-1.5 hover:bg-brand-gold hover:text-brand-chocolate transition-all duration-300 rounded-sm"
                >
                  Login
                </Link>
              </>
            )}

            {/* Mobile Menu Icon */}
            <button 
              onClick={onMobileMenuOpen}
              className="lg:hidden hover:text-brand-gold transition-colors py-1 text-brand-cream"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
export default Header;
