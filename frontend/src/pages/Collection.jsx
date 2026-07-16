import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Sparkles, Filter, SlidersHorizontal, Search } from 'lucide-react';
import { api } from '../utils/api.js';
import { useCart } from '../context/CartContext.jsx';

export const Collection = () => {
  const { category } = useParams();
  const { addToCart, toggleWishlist, wishlistItems } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  
  // AI Sweet Finder state
  const [showAiFinder, setShowAiFinder] = useState(false);
  const [aiPreference, setAiPreference] = useState({
    sweetness: 'any', // low, medium, high, any
    ingredients: 'any', // dry-fruits, milk-solids, flour, any
    allergens: 'none' // nut-free, gluten-free, none
  });

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts();
        
        let filtered = [];
        if (category === 'sweets' || category === 'namkeen') {
          filtered = data.filter(p => p.category === category);
        } else if (category === 'hampers' || category === 'corporate' || category === 'wedding') {
          filtered = data.filter(p => p.category === 'hampers');
        } else if (category === 'festival') {
          // Show hampers & best sweets for festivals
          filtered = data.filter(p => p.isFeatured || p.category === 'hampers');
        } else {
          filtered = data;
        }

        setProducts(filtered);
        setFilteredProducts(filtered);
      } catch (err) {
        console.error('Error fetching collection products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [category]);

  // Handle standard search & sorting
  useEffect(() => {
    let result = [...products];

    // 1. Text Search Filter
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. AI Sweet Finder filters
    if (aiPreference.sweetness === 'low') {
      // Sweets/namkeens with low sugar content. Namkeens have 0 sugar, cashew has low sugar.
      result = result.filter(p => p.category === 'namkeen' || p.id === 'kaju-katli' || p.id === 'rajputana-hamper');
    }
    
    if (aiPreference.ingredients === 'dry-fruits') {
      result = result.filter(p => p.ingredients.some(i => i.toLowerCase().includes('cashew') || i.toLowerCase().includes('almond') || i.toLowerCase().includes('pistachio')));
    } else if (aiPreference.ingredients === 'milk-solids') {
      result = result.filter(p => p.ingredients.some(i => i.toLowerCase().includes('mawa') || i.toLowerCase().includes('khoya') || i.toLowerCase().includes('milk') || i.toLowerCase().includes('chenna')));
    }

    if (aiPreference.allergens === 'nut-free') {
      result = result.filter(p => !p.allergens.includes('Nuts'));
    } else if (aiPreference.allergens === 'gluten-free') {
      result = result.filter(p => !p.allergens.includes('Gluten'));
    }

    // 3. Sorting
    if (sortOption === 'price-low') {
      result.sort((a, b) => a.priceVariants[0].price - b.priceVariants[0].price);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.priceVariants[0].price - a.priceVariants[0].price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [sortOption, searchTerm, products, aiPreference]);

  const handleQuickAdd = (product) => {
    const defaultVariant = product.priceVariants[0];
    addToCart(product, defaultVariant.weight, defaultVariant.price, 1);
  };

  const getCollectionTitle = () => {
    switch(category) {
      case 'sweets': return 'Royal Sweets (Mithai)';
      case 'namkeen': return 'Jodhpuri Savory (Namkeen)';
      case 'wedding': return 'The Royal Wedding Collection';
      case 'corporate': return 'Corporate Gifting Suites';
      case 'festival': return 'Festive Specials & Hampers';
      default: return 'Royal Confectionery';
    }
  };

  const getCollectionBannerText = () => {
    switch(category) {
      case 'sweets': return 'Melt-in-the-mouth cashews, saffron-infused syrups, and pure ghee slow-cooked milk solids.';
      case 'namkeen': return 'Crispy fried pastries filled with caramelized spiced onions, paneer cubes, and traditional savories.';
      case 'wedding': return 'Custom velvet-padded and gold-leaf invitation boxes packed with premium dry fruits and mithais.';
      case 'corporate': return 'Elegant gift hampers displaying royal corporate gratitude with custom embossing.';
      case 'festival': return 'Traditional assortments celebrating Holi, Diwali, and Raksha Bandhan with pure Rajasthani fervor.';
      default: return 'Generations of heritage recipes crafted with local ingredients and zero preservatives.';
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen pb-24">
      
      {/* Editorial Header Banner */}
      <section className="bg-brand-chocolate text-brand-cream py-16 border-b border-brand-gold/15">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold">Shekhawati Luxury</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-cream">{getCollectionTitle()}</h1>
          <p className="font-sans text-xs font-light text-brand-cream/70 max-w-xl mx-auto leading-relaxed">{getCollectionBannerText()}</p>
        </div>
      </section>

      {/* Filter and Shop Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters & AI Sweet Finder */}
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            
            {/* Standard Search */}
            <div className="bg-white border border-brand-beige p-5 rounded">
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate mb-3">Search Catalog</h3>
              <div className="flex items-center border border-brand-beige px-2.5 py-1.5 focus-within:border-brand-gold transition-all">
                <Search className="w-4 h-4 text-brand-chocolate/45 mr-1.5 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Kaju, Kachori, etc." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs text-brand-chocolate w-full border-none focus:outline-none focus:ring-0 p-0"
                />
              </div>
            </div>

            {/* AI Sweet Finder Widget */}
            <div className="bg-brand-maroon text-brand-cream p-5 rounded border border-brand-gold/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-brand-gold/5 text-[90px] font-serif select-none pointer-events-none -mt-4 -mr-4">
                AI
              </div>
              <div className="flex items-center space-x-1.5 mb-4">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <h3 className="font-serif text-sm font-semibold text-brand-cream tracking-wider uppercase">AI Sweet Finder</h3>
              </div>
              
              <div className="space-y-4 text-xs">
                {/* Sweetness */}
                <div className="space-y-1.5">
                  <label className="text-brand-gold/80 block uppercase tracking-widest text-[9px]">Sweetness Preference</label>
                  <select 
                    value={aiPreference.sweetness}
                    onChange={(e) => setAiPreference({...aiPreference, sweetness: e.target.value})}
                    className="w-full bg-brand-chocolate border border-brand-gold/30 text-brand-cream p-2 text-xs rounded focus:outline-none"
                  >
                    <option value="any">Any Sweetness</option>
                    <option value="low">Less Sweet / Savory</option>
                  </select>
                </div>

                {/* Base Ingredients */}
                <div className="space-y-1.5">
                  <label className="text-brand-gold/80 block uppercase tracking-widest text-[9px]">Core Base Ingredient</label>
                  <select 
                    value={aiPreference.ingredients}
                    onChange={(e) => setAiPreference({...aiPreference, ingredients: e.target.value})}
                    className="w-full bg-brand-chocolate border border-brand-gold/30 text-brand-cream p-2 text-xs rounded focus:outline-none"
                  >
                    <option value="any">Any Ingredient</option>
                    <option value="dry-fruits">Dry Fruit Based</option>
                    <option value="milk-solids">Milk Solids / Khoya</option>
                  </select>
                </div>

                {/* Allergen Filters */}
                <div className="space-y-1.5">
                  <label className="text-brand-gold/80 block uppercase tracking-widest text-[9px]">Dietary / Allergens</label>
                  <select 
                    value={aiPreference.allergens}
                    onChange={(e) => setAiPreference({...aiPreference, allergens: e.target.value})}
                    className="w-full bg-brand-chocolate border border-brand-gold/30 text-brand-cream p-2 text-xs rounded focus:outline-none"
                  >
                    <option value="none">No Restrictions</option>
                    <option value="nut-free">Nut-Free</option>
                    <option value="gluten-free">Gluten-Free</option>
                  </select>
                </div>

                {/* Clear AI button */}
                {(aiPreference.sweetness !== 'any' || aiPreference.ingredients !== 'any' || aiPreference.allergens !== 'none') && (
                  <button 
                    onClick={() => setAiPreference({ sweetness: 'any', ingredients: 'any', allergens: 'none' })}
                    className="w-full py-1.5 bg-brand-gold text-brand-chocolate hover:bg-brand-gold/90 transition-colors text-[10px] uppercase font-bold text-center mt-2"
                  >
                    Reset Finder
                  </button>
                )}
              </div>
            </div>

            {/* Standard Sort */}
            <div className="bg-white border border-brand-beige p-5 rounded">
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate mb-3">Sort By</h3>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full border border-brand-beige bg-white text-brand-chocolate p-2 text-xs focus:outline-none focus:border-brand-gold"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>

          </div>

          {/* Catalog Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="text-center py-24">
                <div className="w-10 h-10 border-2 border-brand-gold border-t-brand-maroon rounded-full animate-spin mx-auto mb-4" />
                <span className="text-xs text-brand-chocolate/50 uppercase tracking-widest">Loading Collection...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-brand-beige rounded p-8">
                <h3 className="font-serif text-base text-brand-chocolate font-medium">No delicacies match your selection</h3>
                <p className="font-sans text-xs text-brand-chocolate/60 mt-1 max-w-sm mx-auto">
                  Try adjusting your search terms or resetting the AI Sweet Finder preferences to view more products.
                </p>
                <button 
                  onClick={() => { setSearchTerm(''); setAiPreference({ sweetness: 'any', ingredients: 'any', allergens: 'none' }); }}
                  className="mt-4 px-6 py-2 bg-brand-chocolate text-brand-cream hover:bg-brand-maroon text-xs uppercase tracking-luxury transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white border border-brand-beige hover:border-brand-gold/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-brand-warm/10 aspect-square border-b border-brand-beige/50">
                      <img 
                        src={`/${product.image}`}
                        alt={product.name} 
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
                      />
                      {product.isBestSeller && (
                        <span className="absolute top-3 left-3 bg-brand-maroon text-brand-cream text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border border-brand-gold/20">
                          Best Seller
                        </span>
                      )}
                    </Link>

                    <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-serif text-base text-brand-chocolate hover:text-brand-maroon transition-colors">
                          <Link to={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                        <div className="flex items-center space-x-1 mt-1 text-brand-gold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-[10px] font-semibold text-brand-chocolate/70">{product.rating} ({product.reviewCount} reviews)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-brand-beige/30">
                        <span className="text-xs font-semibold text-brand-maroon">
                          ₹{product.priceVariants[0].price} <span className="text-[10px] text-brand-chocolate/40 font-light">/ {product.priceVariants[0].weight}</span>
                        </span>
                        
                        <button 
                          onClick={() => handleQuickAdd(product)}
                          className="px-3 py-1.5 border border-brand-beige hover:border-brand-maroon hover:bg-brand-maroon hover:text-brand-cream transition-colors text-brand-chocolate/70 text-[10px] uppercase font-semibold tracking-wider flex items-center space-x-1"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
export default Collection;
