import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Sparkles, Check, ChevronDown, Award, Star } from 'lucide-react';
import { api } from '../utils/api.js';
import { useCart } from '../context/CartContext.jsx';
import AIGiftRecommender from '../components/AI/AIGiftRecommender.jsx';

export const Home = ({ onCartOpen }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlistItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isAiRecommenderOpen, setIsAiRecommenderOpen] = useState(false);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data = await api.getProducts();
        // Take featured/bestselling items
        setProducts(data.filter(p => p.isFeatured || p.isBestSeller));
      } catch (err) {
        console.error('Error fetching home products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const faqs = [
    { q: "What is the shelf life of your traditional sweets?", a: "Due to our pure ingredients and preparation in Desi Ghee, dry sweets like Kaju Katli and Sohan Halwa last up to 30 days when stored in an airtight container in a cool place. Syrup-based sweets like Gulab Jamun should be refrigerated and consumed within 7-10 days." },
    { q: "Do you ship across India and internationally?", a: "Yes, we ship premium gift boxes and dry sweets pan-India within 2-4 business days. International shipping is available for select dry fruit hampers and long-shelf-life collections." },
    { q: "Can I customize the contents of my gift boxes?", a: "Absolutely. Our website features a bespoke 'AI Gift Box Builder' where you can select a container size (500g or 1kg) and populate the individual slots with your preferred sweets and namkeens." },
    { q: "How do I place bulk orders for corporate events or weddings?", a: "For large quantities, you can access our 'Bulk Inquiry' tab to configure custom packaging, choose gift tags, and request customized discount rates. Our event manager will follow up within 24 hours." }
  ];

  const handleQuickAdd = (product) => {
    const defaultVariant = product.priceVariants[0];
    addToCart(product, defaultVariant.weight, defaultVariant.price, 1);
    onCartOpen();
  };

  return (
    <div className="bg-brand-cream overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="assets/images/banner.jpg" 
            alt="Royal Rajasthani Sweets Banner" 
            className="w-full h-full object-cover brightness-50 transform scale-105 transition-transform duration-10000 ease-out" 
            style={{ transformOrigin: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-chocolate to-transparent opacity-80" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-brand-cream">
          <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-gold font-semibold mb-4 inline-block">
            Est. Generation Heritage • Mandawa, Rajasthan
          </span>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light tracking-wide leading-tight mb-6">
            Handcrafted Traditional Mithai,<br />
            Presented with Modern Luxury Restraint
          </h1>
          <p className="font-sans text-xs md:text-sm font-light text-brand-cream/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Crafting pure ghee delicacies inspired by the historic havelis and colorful art culture of Mandawa. Indulge in generations-old recipes remixed for the modern connoisseur.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/collection/sweets" 
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-maroon hover:bg-brand-maroon/90 text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors border border-brand-maroon shadow-xl"
            >
              Explore Collection
            </Link>
            <Link 
              to="/custom-box" 
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-brand-cream hover:text-brand-chocolate text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-all border border-brand-cream/40"
            >
              Build Custom Box
            </Link>
          </div>
        </div>

        {/* Scroll down trigger */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-brand-cream/50 z-10">
          <span className="text-[10px] uppercase tracking-widest block mb-1">Our Story</span>
          <ChevronDown className="w-4 h-4 mx-auto animate-bounce text-brand-gold" />
        </div>
      </section>

      {/* 2. Brand Positioning / Short Intro */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-bold">The Mandawa Legacy</span>
          <h2 className="font-serif text-2xl md:text-3xl text-brand-chocolate font-light leading-snug">
            In the heart of Shekhawati’s painted town, we preserve the purity of historic royal recipes.
          </h2>
          <p className="font-sans text-xs text-brand-chocolate/75 leading-relaxed">
            Mandawa is globally celebrated for its open-air art galleries, frescoed havelis, and royal history. New Jodhpur Sweet Home brings that exact architectural detail, balance, and artistic passion into confectionery. We cook exclusively in pure Desi Ghee, sourcing local organic milk and saffron threads.
          </p>
          <blockquote className="border-l-2 border-brand-gold pl-4 py-1 italic font-serif text-sm text-brand-maroon">
            "We do not mass-produce; we slow-craft. Every piece of Mawa Kachori is hand-pleated, and every tray of Kaju Katli represents hours of precise hand kneading."
          </blockquote>
          <div className="pt-2">
            <Link to="/about" className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-maroon hover:text-brand-gold transition-colors tracking-wider uppercase">
              <span>Read Our Full Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-5 relative group">
          <div className="absolute inset-0 bg-brand-gold/10 transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 duration-500" />
          <img 
            src="assets/images/mawa_kachori.jpg" 
            alt="Mawa kachori cooking" 
            className="w-full h-80 object-cover border border-brand-beige relative z-10" 
          />
        </div>
      </section>

      {/* 3. Luxury Category Highlights (Asymmetric Grid) */}
      <section className="py-16 bg-brand-warm/30 border-t border-b border-brand-beige/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold">Crafted Categories</span>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-brand-chocolate font-light mt-2">Explore Our Collections</h2>
            <div className="gold-line mt-4 max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Box 1: Sweets */}
            <div className="bg-white border border-brand-beige p-6 flex flex-col justify-between h-96 hover:shadow-xl transition-all group">
              <div>
                <img src="assets/images/kaju_katli.jpg" alt="Mithai" className="w-full h-48 object-cover mb-6 border border-brand-beige/25" />
                <h3 className="font-serif text-xl text-brand-chocolate group-hover:text-brand-maroon transition-colors">Premium Mithai</h3>
                <p className="font-sans text-xs text-brand-chocolate/65 mt-2 leading-relaxed">Royal cashew fudge, milk pedas, and slow-fried syrup treats prepared for celebratory times.</p>
              </div>
              <Link to="/collection/sweets" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-maroon mt-4 hover:translate-x-1 transition-transform">
                <span>View Sweets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Box 2: Namkeen */}
            <div className="bg-white border border-brand-beige p-6 flex flex-col justify-between h-96 hover:shadow-xl transition-all group">
              <div>
                <img src="assets/images/pyaaz_kachori.jpg" alt="Namkeen" className="w-full h-48 object-cover mb-6 border border-brand-beige/25" />
                <h3 className="font-serif text-xl text-brand-chocolate group-hover:text-brand-maroon transition-colors">Jodhpuri Namkeen</h3>
                <p className="font-sans text-xs text-brand-chocolate/65 mt-2 leading-relaxed">Spicy onion kachoris, paneer samosas, and savory crispy snacks cooked with rich local spices.</p>
              </div>
              <Link to="/collection/namkeen" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-maroon mt-4 hover:translate-x-1 transition-transform">
                <span>View Namkeens</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Box 3: Custom Box Builder */}
            <div className="bg-brand-maroon text-brand-cream p-8 flex flex-col justify-between h-96 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[120px] font-serif text-brand-gold/5 pointer-events-none select-none -mr-8 -mt-8">
                B
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-chocolate text-brand-gold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl font-light text-brand-cream">Bespoke Gift Boxes</h3>
                <p className="font-sans text-xs text-brand-cream/80 leading-relaxed pt-2">
                  Create a custom assortment. Choose between our royal 500g and 1kg luxury boxes and select each sweet piece to compose your personalized royal hamper.
                </p>
              </div>
              <Link to="/custom-box" className="w-full py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-chocolate text-xs uppercase tracking-luxury font-bold text-center transition-colors">
                Start Customizing
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Best Sellers Products Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 border-b border-brand-beige pb-4">
          <div>
            <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold">House Specialties</span>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-brand-chocolate font-light mt-1">Our Best Sellers</h2>
          </div>
          <Link to="/collection/sweets" className="text-xs text-brand-maroon hover:text-brand-gold transition-colors font-semibold uppercase tracking-wider mt-4 md:mt-0 flex items-center space-x-1">
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-2 border-brand-gold border-t-brand-maroon rounded-full animate-spin mx-auto mb-4" />
            <span className="text-xs text-brand-chocolate/50 uppercase tracking-widest">Loading Royal Kitchen...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white border border-brand-beige hover:border-brand-gold/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
                <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-brand-warm/10 aspect-square border-b border-brand-beige/50">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
                  />
                  {product.isBestSeller && (
                    <span className="absolute top-3 left-3 bg-brand-maroon text-brand-cream text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border border-brand-gold/20">
                      Best Seller
                    </span>
                  )}
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-base text-brand-chocolate hover:text-brand-maroon transition-colors">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="flex items-center space-x-1 mt-1 text-brand-gold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[10px] font-semibold text-brand-chocolate/70">{product.rating} ({product.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-brand-maroon">
                      ₹{product.priceVariants[0].price} <span className="text-[10px] text-brand-chocolate/40 font-light">/ {product.priceVariants[0].weight}</span>
                    </span>
                    
                    <button 
                      onClick={() => handleQuickAdd(product)}
                      className="p-2 border border-brand-beige hover:border-brand-maroon hover:bg-brand-maroon hover:text-brand-cream transition-colors text-brand-chocolate/70"
                      title="Add to Basket"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Pure Ghee Premium Process Section */}
      <section className="py-24 bg-brand-chocolate text-brand-cream border-t border-brand-gold/10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold">Our Discipline</span>
            <h2 className="font-serif text-2xl md:text-4xl text-brand-cream font-light mt-2">The Royal Crafting Process</h2>
            <div className="gold-line mt-4 max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center relative z-10">
            {/* Step 1 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-maroon/20 text-brand-gold font-serif text-lg">I</div>
              <h3 className="font-serif text-base text-brand-gold font-light">Organic Dairy</h3>
              <p className="font-sans text-[11px] text-brand-cream/60 leading-relaxed">Sourcing fresh rich organic buffalo milk directly from pastoral Rajasthan farms daily.</p>
            </div>
            {/* Step 2 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-maroon/20 text-brand-gold font-serif text-lg">II</div>
              <h3 className="font-serif text-base text-brand-gold font-light">Desi Ghee</h3>
              <p className="font-sans text-[11px] text-brand-cream/60 leading-relaxed">Every sweet is slow-cooked in clean, churned Desi Ghee for authentic aromatic richness.</p>
            </div>
            {/* Step 3 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-maroon/20 text-brand-gold font-serif text-lg">III</div>
              <h3 className="font-serif text-base text-brand-gold font-light">Aromatics</h3>
              <p className="font-sans text-[11px] text-brand-cream/60 leading-relaxed">Sourcing pure Kashmiri Kesar threads, fresh green cardamoms, and Goan cashews.</p>
            </div>
            {/* Step 4 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-maroon/20 text-brand-gold font-serif text-lg">IV</div>
              <h3 className="font-serif text-base text-brand-gold font-light">Luxe Packing</h3>
              <p className="font-sans text-[11px] text-brand-cream/60 leading-relaxed">Sweets are nested inside custom velvet or silk embossed boxes to preserve freshness.</p>
            </div>
            {/* Step 5 */}
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-14 h-14 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-maroon/20 text-brand-gold font-serif text-lg">V</div>
              <h3 className="font-serif text-base text-brand-gold font-light">Royal Delivery</h3>
              <p className="font-sans text-[11px] text-brand-cream/60 leading-relaxed">Express-shipped to your doorstep with real-time temperature-tracked logistics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials / Reviews */}
      <section className="py-24 bg-brand-cream">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold font-medium">Customer Chronicles</span>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-chocolate font-light mt-1">Sweets Stories</h2>
            <div className="flex justify-center items-center space-x-1.5 mt-3 text-brand-gold">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-xs text-brand-chocolate/70 font-semibold ml-1">4.8 / 5 on Google Reviews (430+ votes)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-warm/30 border border-brand-beige p-8 rounded-lg flex flex-col justify-between space-y-6">
              <p className="font-serif text-sm italic text-brand-chocolate/80 leading-relaxed">
                "The Shahi Mawa Kachori is simply divine! It takes me back to my childhood days. Absolute royal taste, premium gold foil details, and airtight packaging."
              </p>
              <div className="flex flex-col">
                <span className="font-serif text-xs font-semibold text-brand-maroon">Aishwarya Singh</span>
                <span className="text-[10px] text-brand-chocolate/40 uppercase tracking-widest mt-0.5">Gurugram</span>
              </div>
            </div>
            
            <div className="bg-brand-warm/30 border border-brand-beige p-8 rounded-lg flex flex-col justify-between space-y-6">
              <p className="font-serif text-sm italic text-brand-chocolate/80 leading-relaxed">
                "Amazing Pyaaz Kachoris! Crispy and perfectly spiced. The custom box builder tool is so easy to use on my iPhone. The boxes look extremely high-end."
              </p>
              <div className="flex flex-col">
                <span className="font-serif text-xs font-semibold text-brand-maroon">Rajesh Sharma</span>
                <span className="text-[10px] text-brand-chocolate/40 uppercase tracking-widest mt-0.5">Jaipur</span>
              </div>
            </div>

            <div className="bg-brand-warm/30 border border-brand-beige p-8 rounded-lg flex flex-col justify-between space-y-6">
              <p className="font-serif text-sm italic text-brand-chocolate/80 leading-relaxed">
                "We ordered custom boxes as wedding invitations for our guests. The team did a stellar job matching Jodhpuri patterns. Truly world-class quality!"
              </p>
              <div className="flex flex-col">
                <span className="font-serif text-xs font-semibold text-brand-maroon">Kavita Shekhawat</span>
                <span className="text-[10px] text-brand-chocolate/40 uppercase tracking-widest mt-0.5">Mandawa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-24 bg-brand-warm/20 border-t border-brand-beige/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold">Common Queries</span>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-chocolate font-light mt-1">Frequently Asked Questions</h2>
            <div className="gold-line mt-4 max-w-xs mx-auto" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-brand-beige p-4 transition-all">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-serif text-sm font-semibold text-brand-chocolate"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-brand-gold transform transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${activeFaq === idx ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="font-sans text-xs text-brand-chocolate/70 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating AI Helper Button */}
      <button 
        onClick={() => setIsAiRecommenderOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-brand-maroon hover:bg-brand-chocolate text-brand-cream border border-brand-gold/30 p-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
        title="AI Gift Recommender"
      >
        <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
        <span className="text-[10px] uppercase tracking-luxury font-bold pr-1 hidden sm:inline">AI Gift Planner</span>
      </button>

      {/* Recommender Modal */}
      <AIGiftRecommender 
        isOpen={isAiRecommenderOpen} 
        onClose={() => setIsAiRecommenderOpen(false)} 
        onCartOpen={onCartOpen}
      />

    </div>
  );
};
export default Home;
