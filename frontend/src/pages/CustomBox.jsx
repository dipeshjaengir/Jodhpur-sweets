import React, { useState } from 'react';
import { Sparkles, Trash2, ShoppingCart, Plus, Minus, Info } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export const CustomBox = () => {
  const { addToCart } = useCart();
  const [boxSize, setBoxSize] = useState('500g'); // '500g' or '1kg'
  
  // Custom Box Slots config
  const capacity = boxSize === '500g' ? 16 : 32;
  const price = boxSize === '500g' ? 650 : 1200;

  // Selected sweet items filling the slots
  const [slots, setSlots] = useState([]);

  // Available sweet selections to populate
  const sweetMenu = [
    { id: 'kaju-katli', name: 'Kaju Katli', image: 'assets/images/kaju_katli.jpg', desc: 'Cashew fudge disc' },
    { id: 'kesar-pedha', name: 'Kesar Peda', image: 'assets/images/kesar_pedha.jpg', desc: 'Saffron milk fudge' },
    { id: 'motichoor-ladoo', name: 'Motichoor Ladoo', image: 'assets/images/motichoor_ladoo.jpg', desc: 'Fine ghee sweet ball' },
    { id: 'gulab-jamun', name: 'Gulab Jamun', image: 'assets/images/gulab_jamun.jpg', desc: 'Warm syrup mawa sphere' }
  ];

  const handleAddSweet = (sweet) => {
    if (slots.length >= capacity) {
      alert(`Your royal ${boxSize} box is already completely full! Remove some items or buy it now.`);
      return;
    }
    setSlots([...slots, sweet]);
  };

  const handleRemoveSlot = (index) => {
    const newSlots = [...slots];
    newSlots.splice(index, 1);
    setSlots(newSlots);
  };

  const handleClearBox = () => {
    setSlots([]);
  };

  // AI complete algorithm - fills remaining slots automatically with balanced assortments
  const handleAiAutoFill = (theme = 'royal') => {
    const emptyCount = capacity - slots.length;
    if (emptyCount <= 0) {
      alert('Your box is already full!');
      return;
    }

    let fillItems = [];
    if (theme === 'saffron') {
      // Saffron focus: Peda and Ladoo
      const saffronSweets = sweetMenu.filter(s => s.id === 'kesar-pedha' || s.id === 'motichoor-ladoo');
      for (let i = 0; i < emptyCount; i++) {
        fillItems.push(saffronSweets[i % saffronSweets.length]);
      }
    } else if (theme === 'premium') {
      // Cashew premium focus
      const kaju = sweetMenu.find(s => s.id === 'kaju-katli');
      for (let i = 0; i < emptyCount; i++) {
        fillItems.push(kaju);
      }
    } else {
      // Royal assorted mix: equal distribution
      for (let i = 0; i < emptyCount; i++) {
        fillItems.push(sweetMenu[i % sweetMenu.length]);
      }
    }

    setSlots([...slots, ...fillItems]);
  };

  const handleAddToBasket = () => {
    if (slots.length < capacity) {
      alert(`Please fill all ${capacity} compartments before adding to your basket. Current: ${slots.length}/${capacity}`);
      return;
    }

    // Summarize contents
    const summaryMap = {};
    slots.forEach(s => {
      summaryMap[s.name] = (summaryMap[s.name] || 0) + 1;
    });
    const contents = Object.entries(summaryMap).map(([name, qty]) => ({ name, qty }));

    // Add custom box item to cart context
    addToCart(
      null, // No single catalog product
      boxSize, // Weight identifier
      price, // Custom price
      1, // Qty
      true, // isCustomBox flag
      contents
    );

    alert(`Custom Box (${boxSize}) added to basket successfully!`);
    setSlots([]); // reset builder
  };

  // Calculate percentage filled
  const percentFilled = (slots.length / capacity) * 100;

  // Summarize count of individual items
  const getItemCounts = () => {
    const counts = {};
    slots.forEach(s => {
      counts[s.name] = (counts[s.name] || 0) + 1;
    });
    return Object.entries(counts);
  };

  return (
    <div className="bg-brand-cream pb-24">
      
      {/* Intro Header */}
      <section className="bg-brand-chocolate text-brand-cream py-16 border-b border-brand-gold/15 text-center space-y-4">
        <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Luxury customizer</span>
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-cream">Royal Gift Box Customizer</h1>
        <p className="font-sans text-xs font-light text-brand-cream/70 max-w-xl mx-auto leading-relaxed">
          Craft your own luxury assortment. Select box size, populate individual compartments with our house specialties, or let our AI Halwai complete the box for you.
        </p>
      </section>

      {/* Main customizer body */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LHS: Box size controls & sweets menu */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Box Size */}
            <div className="bg-white border border-brand-beige p-5 rounded-sm space-y-4">
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate">1. Choose Box Size</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <button
                  onClick={() => { setBoxSize('500g'); setSlots([]); }}
                  className={`p-4 border transition-all ${
                    boxSize === '500g'
                      ? 'border-brand-maroon bg-brand-maroon/5 text-brand-maroon font-bold'
                      : 'border-brand-beige bg-white text-brand-chocolate hover:border-brand-chocolate'
                  }`}
                >
                  <span className="block text-sm">Assorted 500g</span>
                  <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider block mt-1">16 Compartments</span>
                  <span className="text-xs font-bold block mt-1 text-brand-maroon">₹650</span>
                </button>

                <button
                  onClick={() => { setBoxSize('1kg'); setSlots([]); }}
                  className={`p-4 border transition-all ${
                    boxSize === '1kg'
                      ? 'border-brand-maroon bg-brand-maroon/5 text-brand-maroon font-bold'
                      : 'border-brand-beige bg-white text-brand-chocolate hover:border-brand-chocolate'
                  }`}
                >
                  <span className="block text-sm">Assorted 1kg</span>
                  <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider block mt-1">32 Compartments</span>
                  <span className="text-xs font-bold block mt-1 text-brand-maroon">₹1200</span>
                </button>
              </div>
            </div>

            {/* Sweets Selection Menu */}
            <div className="bg-white border border-brand-beige p-5 rounded-sm space-y-4">
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate">2. Select Sweets to Add</h3>
              <div className="space-y-3">
                {sweetMenu.map((sweet) => (
                  <div 
                    key={sweet.id} 
                    className="flex items-center justify-between p-2.5 border border-brand-beige hover:border-brand-gold/40 hover:bg-brand-warm/10 rounded transition-all cursor-pointer"
                    onClick={() => handleAddSweet(sweet)}
                  >
                    <div className="flex items-center space-x-3">
                      <img src={`/${sweet.image}`} alt={sweet.name} className="w-12 h-12 object-cover border border-brand-beige rounded" />
                      <div>
                        <h4 className="font-serif text-xs font-semibold text-brand-chocolate">{sweet.name}</h4>
                        <span className="text-[10px] text-brand-chocolate/55 font-light">{sweet.desc}</span>
                      </div>
                    </div>
                    <button 
                      className="p-1.5 bg-brand-maroon text-brand-cream hover:bg-brand-chocolate transition-colors text-[10px] uppercase font-bold"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RHS: Visual box representation */}
          <div className="lg:col-span-8 bg-white border border-brand-beige p-6 md:p-10 rounded-sm flex flex-col justify-between min-h-[500px]">
            
            {/* Box Header Status */}
            <div className="flex flex-col md:flex-row items-baseline md:items-center justify-between pb-4 border-b border-brand-beige/50 mb-6">
              <div>
                <h3 className="font-serif text-lg text-brand-chocolate font-light">Visualizing Box: Assorted {boxSize}</h3>
                <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider block mt-0.5">
                  Filled: {slots.length} of {capacity} compartments
                </span>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 md:mt-0 text-xs">
                {slots.length > 0 && (
                  <button 
                    onClick={handleClearBox}
                    className="text-brand-chocolate/40 hover:text-red-600 transition-colors flex items-center space-x-1 font-semibold uppercase tracking-wider text-[10px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Box</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visual Box Slot Grid */}
            <div className="flex-1 flex items-center justify-center py-6">
              <div 
                className={`grid gap-3 bg-brand-warm/30 border-2 border-brand-gold/30 p-6 rounded-md shadow-inner max-w-md w-full ${
                  boxSize === '500g' 
                    ? 'grid-cols-4 aspect-square' 
                    : 'grid-cols-4 md:grid-cols-8 aspect-video'
                }`}
              >
                {Array.from({ length: capacity }).map((_, idx) => {
                  const item = slots[idx];
                  return (
                    <div 
                      key={idx} 
                      className="aspect-square border border-brand-gold/15 bg-white flex items-center justify-center relative group overflow-hidden rounded shadow-sm"
                    >
                      {item ? (
                        <>
                          <img src={`/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemoveSlot(idx)}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-brand-cream transition-opacity text-[10px] uppercase font-bold"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <div className="text-[10px] text-brand-gold/20 font-serif font-semibold">{idx + 1}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom box builder stats details & AI controls */}
            <div className="pt-6 border-t border-brand-beige/50 mt-6 space-y-4">
              
              {/* Capacity Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-brand-chocolate/65 uppercase tracking-wider font-semibold">
                  <span>Box Capacity Filled</span>
                  <span>{Math.round(percentFilled)}%</span>
                </div>
                <div className="w-full h-1.5 bg-brand-beige/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-maroon transition-all duration-500" 
                    style={{ width: `${percentFilled}%` }}
                  />
                </div>
              </div>

              {/* Box items list summary */}
              {slots.length > 0 && (
                <div className="bg-brand-warm/20 border border-brand-beige p-3 text-xs text-brand-chocolate/75 flex flex-wrap gap-3 font-sans rounded">
                  <strong className="block w-full text-[10px] uppercase tracking-wider text-brand-gold">Current Assortment:</strong>
                  {getItemCounts().map(([name, qty]) => (
                    <span key={name} className="bg-white border border-brand-beige/40 px-2 py-0.5 rounded font-semibold">{name} x{qty}</span>
                  ))}
                </div>
              )}

              {/* AI Auto Fill Buttons */}
              {slots.length < capacity && (
                <div className="p-4 bg-brand-maroon/5 border border-brand-maroon/10 rounded flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-brand-gold shrink-0 animate-pulse" />
                    <div>
                      <h4 className="font-serif text-xs font-semibold text-brand-chocolate">Let the AI Halwai Complete it</h4>
                      <p className="text-[10px] text-brand-chocolate/60">Fill remaining {capacity - slots.length} slots instantly with professional choices</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
                    <button 
                      onClick={() => handleAiAutoFill('royal')}
                      className="px-3 py-1.5 bg-brand-chocolate hover:bg-brand-maroon text-brand-cream text-[10px] uppercase tracking-wider font-bold"
                    >
                      Assorted Mix
                    </button>
                    <button 
                      onClick={() => handleAiAutoFill('saffron')}
                      className="px-3 py-1.5 bg-brand-chocolate hover:bg-brand-maroon text-brand-cream text-[10px] uppercase tracking-wider font-bold"
                    >
                      Kesar Saffron
                    </button>
                    <button 
                      onClick={() => handleAiAutoFill('premium')}
                      className="px-3 py-1.5 bg-brand-chocolate hover:bg-brand-maroon text-brand-cream text-[10px] uppercase tracking-wider font-bold"
                    >
                      All Kaju Katli
                    </button>
                  </div>
                </div>
              )}

              {/* Add Custom box to basket */}
              <button
                onClick={handleAddToBasket}
                disabled={slots.length < capacity}
                className={`w-full py-3.5 uppercase font-semibold text-xs tracking-luxury flex items-center justify-center space-x-2 transition-colors ${
                  slots.length === capacity
                    ? 'bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream cursor-pointer shadow-lg'
                    : 'bg-brand-beige text-brand-chocolate/40 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Custom Assortment to Basket (₹{price})</span>
              </button>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
export default CustomBox;
