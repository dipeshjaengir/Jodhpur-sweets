import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import Header from './components/Layout/Header.jsx';
import Footer from './components/Layout/Footer.jsx';
import MobileDrawer from './components/Layout/MobileDrawer.jsx';
import CartDrawer from './components/Cart/CartDrawer.jsx';
import CustomCursor from './components/Layout/CustomCursor.jsx';
import Preloader from './components/Layout/Preloader.jsx';

// Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Collection from './pages/Collection.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CustomBox from './pages/CustomBox.jsx';
import BulkInquiry from './pages/BulkInquiry.jsx';
import Gallery from './pages/Gallery.jsx';
import BookTable from './pages/BookTable.jsx';
import Contact from './pages/Contact.jsx';
import Checkout from './pages/Checkout.jsx';
import Auth from './pages/Auth.jsx';
import Account from './pages/Account.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export const App = () => {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Scroll to top on route transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileMenuOpen(false); // Close mobile drawer on link click
  }, [location.pathname]);

  // Global Toast Listener
  useEffect(() => {
    const handleToastEvent = (e) => {
      const { message, type = 'success' } = e.detail;
      const id = Date.now() + Math.random().toString();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };

    window.addEventListener('toast', handleToastEvent);
    return () => window.removeEventListener('toast', handleToastEvent);
  }, []);

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="page-transition-container relative min-h-screen flex flex-col">
      {/* Luxury Intro preloader and customized cursors */}
      <Preloader />
      <CustomCursor />

      {/* Global Headers (Hidden inside Admin View to keep dashboard clean) */}
      {!isAdminPage && (
        <Header 
          onCartOpen={() => setCartOpen(true)} 
          onMobileMenuOpen={() => setMobileMenuOpen(true)} 
        />
      )}

      {/* Mobile drawer & Shopping cart slides */}
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Main Pages routes wrapper */}
      <main className={`flex-grow ${!isAdminPage ? 'pt-[80px]' : ''}`}>
        <Routes>
          <Route path="/" element={<Home onCartOpen={() => setCartOpen(true)} />} />
          <Route path="/about" element={<About />} />
          <Route path="/collection/:category" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/custom-box" element={<CustomBox />} />
          <Route path="/bulk-inquiry" element={<BulkInquiry />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/book-table" element={<BookTable />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Global Footers */}
      {!isAdminPage && <Footer />}

      {/* Global Floating Toasts Container */}
      <div className="fixed bottom-6 left-6 z-[200] flex flex-col space-y-3 pointer-events-none max-w-sm w-full font-sans">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`pointer-events-auto flex items-center justify-between p-3.5 shadow-2xl rounded-sm text-xs transition-all duration-300 transform translate-y-0 opacity-100 ${
              t.type === 'error' 
                ? 'bg-red-950 text-red-100 border border-red-800' 
                : 'bg-brand-chocolate text-brand-cream border border-brand-gold/30'
            } animate-[slideUp_0.3s_ease-out]`}
          >
            <div className="flex items-center space-x-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.type === 'error' ? 'bg-red-500' : 'bg-brand-gold'}`} />
              <span className="font-light tracking-wide">{t.message}</span>
            </div>
            <button 
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-brand-cream/50 hover:text-brand-cream ml-4 shrink-0"
              aria-label="Close Notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
