import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our Royal Updates.');
    e.target.reset();
  };

  return (
    <footer className="bg-brand-chocolate text-brand-cream border-t border-brand-gold/15 pt-16 pb-8 relative overflow-hidden">
      
      {/* Subtle royal background graphic watermark */}
      <div className="absolute -bottom-20 -right-20 text-[180px] font-serif text-brand-gold/5 pointer-events-none select-none">
        JODHPUR
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Column 1: Brand details */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="flex flex-col select-none">
            <span className="font-serif text-xl lg:text-2xl font-light tracking-[0.2em] text-brand-cream leading-tight">
              NEW JODHPUR
            </span>
            <span className="font-serif text-xs font-light tracking-[0.3em] text-brand-gold">
              SWEET HOME
            </span>
            <span className="font-sans text-[7px] tracking-[0.35em] text-brand-cream/60 uppercase">
              Mandawa
            </span>
          </Link>
          <p className="font-sans font-light text-xs text-brand-cream/70 leading-relaxed max-w-sm">
            Elevating the culinary artistry of Shekhawati. Handcrafting pure-ghee traditional mithai, namkeen, and catering experiences with royal Rajasthani legacy, direct from Mandawa.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-brand-cream/60 hover:text-brand-gold transition-colors text-sm" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-brand-cream/60 hover:text-brand-gold transition-colors text-sm" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-brand-cream/60 hover:text-brand-gold transition-colors text-sm" aria-label="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-brand-cream/60 hover:text-brand-gold transition-colors text-sm" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Column 2: Sitemap Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif text-sm tracking-[0.15em] text-brand-gold uppercase">Shop & Services</h3>
          <ul className="flex flex-col space-y-2.5 font-sans font-light text-xs text-brand-cream/70">
            <li><Link to="/collection/sweets" className="hover:text-brand-gold transition-colors">Sweets (Premium Mithai)</Link></li>
            <li><Link to="/collection/namkeen" className="hover:text-brand-gold transition-colors">Savory Snacks (Namkeen)</Link></li>
            <li><Link to="/custom-box" className="hover:text-brand-gold transition-colors flex items-center space-x-1.5">
              <span>Royal Gift Box Builder</span>
            </Link></li>
            <li><Link to="/collection/wedding" className="hover:text-brand-gold transition-colors">Wedding Favor Collections</Link></li>
            <li><Link to="/collection/corporate" className="hover:text-brand-gold transition-colors">Corporate Gifting Portals</Link></li>
            <li><Link to="/bulk-inquiry" className="hover:text-brand-gold transition-colors">B2B & Bulk Catering Inquiries</Link></li>
          </ul>
        </div>

        {/* Column 3: Contacts */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif text-sm tracking-[0.15em] text-brand-gold uppercase">Contact Details</h3>
          <ul className="flex flex-col space-y-3 font-sans font-light text-xs text-brand-cream/70">
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <span>
                <strong>Mandawa Mod</strong>, Mandawa Road,<br />
                Mandawa, Jhunjhunu District,<br />
                Rajasthan - 333704, India
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-brand-gold shrink-0" />
              <a href="tel:+919999999999" className="hover:text-brand-gold transition-colors">[INSERT VERIFIED PHONE]</a>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-brand-gold shrink-0" />
              <a href="mailto:info@jodhpursweetsmandawa.com" className="hover:text-brand-gold transition-colors">info@jodhpursweetsmandawa.com</a>
            </li>
            <li className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <span>
                Open Daily: 8:00 AM - 10:00 PM<br />
                <span className="text-[10px] text-brand-gold/60">Dine-in & Home Delivery available</span>
              </span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif text-sm tracking-[0.15em] text-brand-gold uppercase">Royal Gazette</h3>
          <p className="font-sans font-light text-xs text-brand-cream/70 leading-relaxed">
            Subscribe to receive notices of seasonal arrivals, festive offerings, and royal discounts.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
            <div className="flex items-center border border-brand-gold/30 bg-brand-chocolate focus-within:border-brand-gold transition-colors px-3 py-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                required 
                className="bg-transparent border-none text-xs text-brand-cream w-full placeholder-brand-cream/40 focus:outline-none focus:ring-0"
              />
              <button type="submit" aria-label="Subscribe" className="text-brand-gold hover:text-brand-cream ml-1.5 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[9px] text-brand-cream/40 font-light">We respect your privacy. Unsubscribe anytime.</span>
          </form>
        </div>

      </div>

      {/* Gold Divider */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="gold-line" />
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-brand-cream/50 font-sans font-light space-y-4 md:space-y-0">
        <div>
          © {currentYear} New Jodhpur Sweet Home Mandawa. All Rights Reserved.
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/privacy-policy" className="hover:text-brand-cream transition-colors">Privacy Policy</Link>
          <Link to="/terms-conditions" className="hover:text-brand-cream transition-colors">Terms of Service</Link>
          <Link to="/refund-policy" className="hover:text-brand-cream transition-colors">Refund Policy</Link>
        </div>
        <div className="flex items-center space-x-3 text-brand-gold/60 text-lg">
          <i className="fa-brands fa-cc-visa" title="Visa"></i>
          <i className="fa-brands fa-cc-mastercard" title="Mastercard"></i>
          <i className="fa-brands fa-cc-paypal" title="Paypal"></i>
          <i className="fa-brands fa-cc-stripe" title="Stripe"></i>
        </div>
      </div>
      
    </footer>
  );
};
export default Footer;
