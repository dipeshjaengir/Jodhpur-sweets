import React, { useState } from 'react';
import { Sparkles, X, Gift, Check, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export const AIGiftRecommender = ({ isOpen, onClose, onCartOpen }) => {
  const { addToCart } = useCart();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    occasion: '', // wedding, corporate, festival, family
    budget: '', // low, medium, premium
    taste: '' // sweet, savory, assorted
  });

  const [recommendations, setRecommendations] = useState([]);

  if (!isOpen) return null;

  const handleSelect = (key, value) => {
    setSelections({ ...selections, [key]: value });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calculate Recommendations based on selections
      generateRecommendations();
      setStep(4);
    }
  };

  const generateRecommendations = () => {
    // Mock catalog matching seed products
    const catalog = [
      { id: 'mawa-kachori', name: 'Shahi Mawa Kachori', category: 'sweets', price: 420, weight: '500g (8 Pcs)', image: 'assets/images/mawa_kachori.jpg', tag: 'sweets', tier: 'medium' },
      { id: 'pyaaz-kachori', name: 'Jodhpuri Pyaaz Kachori', category: 'namkeen', price: 230, weight: '500g (8 Pcs)', image: 'assets/images/pyaaz_kachori.jpg', tag: 'savory', tier: 'low' },
      { id: 'kaju-katli', name: 'Premium Kaju Katli', category: 'sweets', price: 580, weight: '500g', image: 'assets/images/kaju_katli.jpg', tag: 'sweets', tier: 'medium' },
      { id: 'rajputana-hamper', name: 'Royal Rajputana Gifting Hamper', category: 'hampers', price: 1850, weight: 'Standard Luxury Size', image: 'assets/images/rajputana_hamper.jpg', tag: 'assorted', tier: 'premium' }
    ];

    let result = [];

    // Simple rule-based recommendation matching budget tier & taste
    if (selections.budget === 'premium' || selections.occasion === 'wedding' || selections.occasion === 'corporate') {
      result.push(catalog.find(p => p.id === 'rajputana-hamper'));
    }

    if (selections.taste === 'savory' || selections.taste === 'assorted') {
      result.push(catalog.find(p => p.id === 'pyaaz-kachori'));
    }

    if (selections.taste === 'sweet' || selections.taste === 'assorted') {
      result.push(catalog.find(p => p.id === 'mawa-kachori'));
      result.push(catalog.find(p => p.id === 'kaju-katli'));
    }

    // Filter duplicates and empty values
    const uniqueRecs = result.filter((item, index) => item && result.findIndex(i => i.id === item.id) === index);
    
    // Sort so premium appears first
    uniqueRecs.sort((a, b) => b.price - a.price);

    setRecommendations(uniqueRecs);
  };

  const handleAddRecToCart = (item) => {
    // Mock product model matching structure
    const mockProduct = {
      id: item.id,
      name: item.name,
      image: item.image,
      category: item.category,
      priceVariants: [{ weight: item.weight, price: item.price }]
    };
    addToCart(mockProduct, item.weight, item.price, 1);
    alert(`${item.name} added to your basket!`);
    onClose();
    onCartOpen();
  };

  const handleReset = () => {
    setSelections({ occasion: '', budget: '', taste: '' });
    setStep(1);
    setRecommendations([]);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border-2 border-brand-gold/30 w-full max-w-lg rounded-sm shadow-2xl relative p-6 md:p-8 text-xs text-brand-chocolate">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-brand-chocolate/50 hover:text-brand-maroon transition-colors"
        >
          <X className="w-5.5 h-5.5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="flex justify-center text-brand-gold">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="font-serif text-lg font-semibold tracking-wider uppercase text-brand-maroon">AI Gift Recommender</h2>
          <div className="w-24 h-[1px] bg-brand-gold/30 mx-auto" />
        </div>

        {/* STEP 1: Occasion */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold text-center text-brand-chocolate">What is the special occasion?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'wedding', label: 'Royal Wedding Favor', desc: 'Luxe wedding hampers' },
                { key: 'corporate', label: 'Corporate Appreciation', desc: 'Premium branded boxes' },
                { key: 'festival', label: 'Seasonal Festival', desc: 'Diwali & Holi specals' },
                { key: 'family', label: 'Family Banquet / Gathering', desc: 'Traditional assortments' }
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => handleSelect('occasion', opt.key)}
                  className={`p-3 border text-left rounded transition-all ${
                    selections.occasion === opt.key 
                      ? 'border-brand-maroon bg-brand-maroon/5 font-bold' 
                      : 'border-brand-beige hover:border-brand-chocolate bg-white'
                  }`}
                >
                  <strong className="block text-[11px]">{opt.label}</strong>
                  <span className="text-[9px] text-brand-chocolate/50 block font-light">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Budget */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold text-center text-brand-chocolate">What is your budget tier?</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'low', label: 'Standard', desc: 'Under ₹500' },
                { key: 'medium', label: 'Classic Luxury', desc: '₹500 - ₹1000' },
                { key: 'premium', label: 'Royal Imperial', desc: 'Over ₹1000' }
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => handleSelect('budget', opt.key)}
                  className={`p-4 border text-center rounded transition-all flex flex-col justify-between h-24 ${
                    selections.budget === opt.key 
                      ? 'border-brand-maroon bg-brand-maroon/5 font-bold' 
                      : 'border-brand-beige hover:border-brand-chocolate bg-white'
                  }`}
                >
                  <Gift className="w-5 h-5 text-brand-gold mx-auto mb-2" />
                  <strong className="block text-[10px]">{opt.label}</strong>
                  <span className="text-[9px] text-brand-chocolate/50 block font-light">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Taste */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold text-center text-brand-chocolate">What are your taste preferences?</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'sweet', label: 'Syrup & Sugar Sweets', desc: 'Ladoo, Pedas' },
                { key: 'savory', label: 'Rajasthani Savories', desc: 'Spicy Kachoris, Samosa' },
                { key: 'assorted', label: 'Assorted Mix Hampers', desc: 'Sweets & Namkeens' }
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => handleSelect('taste', opt.key)}
                  className={`p-4 border text-center rounded transition-all flex flex-col justify-between h-24 ${
                    selections.taste === opt.key 
                      ? 'border-brand-maroon bg-brand-maroon/5 font-bold' 
                      : 'border-brand-beige hover:border-brand-chocolate bg-white'
                  }`}
                >
                  <strong className="block text-[10px]">{opt.label}</strong>
                  <span className="text-[9px] text-brand-chocolate/50 block font-light text-center leading-tight mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Recommendations */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold text-center text-brand-chocolate">Our AI Curated Recommendations</h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {recommendations.length === 0 ? (
                <p className="text-center py-6 text-brand-chocolate/50 italic">No recommendations match your filters. Please reset.</p>
              ) : (
                recommendations.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2.5 border border-brand-beige rounded bg-brand-warm/15">
                    <div className="flex items-center space-x-3">
                      <img src={`/${item.image}`} alt={item.name} className="w-12 h-12 object-cover border border-brand-beige rounded shrink-0" />
                      <div>
                        <h4 className="font-serif font-bold text-xs text-brand-chocolate">{item.name}</h4>
                        <span className="text-[9px] text-brand-gold uppercase tracking-wider font-semibold block">{item.weight}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <strong className="text-brand-maroon text-xs shrink-0">₹{item.price}</strong>
                      <button 
                        onClick={() => handleAddRecToCart(item)}
                        className="px-2.5 py-1.5 bg-brand-maroon hover:bg-brand-chocolate text-brand-cream text-[9px] uppercase font-bold flex items-center space-x-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center border-t border-brand-beige/50 pt-4 mt-6">
          {step > 1 && step < 4 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-brand-beige text-brand-chocolate hover:border-brand-chocolate text-[10px] uppercase font-bold tracking-wider"
            >
              Back
            </button>
          ) : step === 4 ? (
            <button 
              onClick={handleReset}
              className="px-4 py-2 border border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-brand-cream text-[10px] uppercase font-bold tracking-wider"
            >
              Reset Recommender
            </button>
          ) : <div />}

          {step < 4 ? (
            <button 
              onClick={handleNext}
              disabled={(step === 1 && !selections.occasion) || (step === 2 && !selections.budget) || (step === 3 && !selections.taste)}
              className={`px-5 py-2 uppercase font-bold text-[10px] tracking-wider flex items-center space-x-1 ${
                (step === 1 && !selections.occasion) || (step === 2 && !selections.budget) || (step === 3 && !selections.taste)
                  ? 'bg-brand-beige text-brand-chocolate/40 cursor-not-allowed'
                  : 'bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream'
              }`}
            >
              <span>{step === 3 ? 'Generate Picks' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="px-5 py-2 bg-brand-chocolate hover:bg-brand-maroon text-brand-cream text-[10px] uppercase font-bold tracking-wider"
            >
              Close
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
export default AIGiftRecommender;
