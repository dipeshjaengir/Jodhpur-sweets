import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Sparkles, Phone, Heart, ShoppingBag, Landmark, Compass, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className={`fixed inset-0 z-[150] lg:hidden transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      {/* Drawer Panel */}
      <div className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-brand-chocolate text-brand-cream p-8 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-brand-gold/15 mb-8">
            <span className="font-serif text-lg tracking-[0.15em] text-brand-gold">Navigation</span>
            <button onClick={onClose} className="text-brand-cream/80 hover:text-brand-gold">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col space-y-5 text-sm uppercase tracking-wider font-sans font-light">
            <Link to="/" onClick={onClose} className="hover:text-brand-gold py-1">Home</Link>
            
            {/* Grouped Collections */}
            <div className="flex flex-col space-y-2 pl-2 border-l border-brand-gold/10">
              <span className="text-[10px] text-brand-gold uppercase tracking-[0.2em] mb-1 font-semibold">Our Catalog</span>
              <Link to="/collection/sweets" onClick={onClose} className="hover:text-brand-gold text-xs py-1">Sweets (Mithai)</Link>
              <Link to="/collection/namkeen" onClick={onClose} className="hover:text-brand-gold text-xs py-1">Namkeen (Savory)</Link>
              <Link to="/collection/wedding" onClick={onClose} className="hover:text-brand-gold text-xs py-1">Wedding Hampers</Link>
              <Link to="/collection/corporate" onClick={onClose} className="hover:text-brand-gold text-xs py-1">Corporate Gifts</Link>
              <Link to="/collection/festival" onClick={onClose} className="hover:text-brand-gold text-xs py-1">Festivals</Link>
            </div>

            <Link to="/custom-box" onClick={onClose} className="hover:text-brand-gold py-1 flex items-center space-x-2 text-brand-gold font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Royal Custom Box</span>
            </Link>
            
            <Link to="/about" onClick={onClose} className="hover:text-brand-gold py-1">Our Story</Link>
            <Link to="/gallery" onClick={onClose} className="hover:text-brand-gold py-1">Gallery</Link>
            <Link to="/book-table" onClick={onClose} className="hover:text-brand-gold py-1">Book Table</Link>
            <Link to="/bulk-inquiry" onClick={onClose} className="hover:text-brand-gold py-1">Bulk Orders</Link>
            <Link to="/contact" onClick={onClose} className="hover:text-brand-gold py-1">Contact</Link>
            
            {isAdmin && (
              <Link to="/admin" onClick={onClose} className="hover:text-brand-gold py-1 text-red-400 font-semibold">
                Admin Panel
              </Link>
            )}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="border-t border-brand-gold/15 pt-6 flex flex-col space-y-4">
          {user ? (
            <div className="flex flex-col space-y-2">
              <span className="text-xs text-brand-gold">Logged in as: <strong className="text-brand-cream">{user.name}</strong></span>
              <button 
                onClick={() => { logout(); onClose(); }}
                className="w-full py-2.5 bg-brand-maroon/20 hover:bg-brand-maroon text-brand-cream border border-brand-maroon text-xs uppercase tracking-luxury transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              onClick={onClose}
              className="w-full py-2.5 bg-brand-gold text-brand-chocolate hover:bg-brand-gold/90 text-xs font-semibold uppercase tracking-luxury text-center transition-all"
            >
              Sign In / Sign Up
            </Link>
          )}
          
          <div className="text-[10px] text-brand-cream/40 text-center font-sans tracking-[0.1em]">
            New Jodhpur Sweet Home Mandawa<br />
            Handcrafted Rajasthani Heritage
          </div>
        </div>

      </div>
    </div>
  );
};
export default MobileDrawer;
