import React, { useState } from 'react';
import { X, Search, ZoomIn } from 'lucide-react';

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const galleryItems = [
    { id: 1, category: 'sweets', title: 'Shahi Mawa Kachori', image: 'assets/images/mawa_kachori.jpg' },
    { id: 2, category: 'sweets', title: 'Kesaria Motichoor Ladoo', image: 'assets/images/motichoor_ladoo.jpg' },
    { id: 3, category: 'namkeen', title: 'Jodhpuri Pyaaz Kachori', image: 'assets/images/pyaaz_kachori.jpg' },
    { id: 4, category: 'ambience', title: 'Mandawa Haveli Frescoes', image: 'assets/images/banner.jpg' },
    { id: 5, category: 'sweets', title: 'Premium Diamond Cashew Kaju Katli', image: 'assets/images/kaju_katli.jpg' },
    { id: 6, category: 'packaging', title: 'Royal Rajputana Hampers', image: 'assets/images/rajputana_hamper.jpg' },
    { id: 7, category: 'namkeen', title: 'Shahi Paneer Samosa', image: 'assets/images/shahi_samosa.jpg' },
    { id: 8, category: 'packaging', title: 'Gold Foil Gifting Cases', image: 'assets/images/gift_box.jpg' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="bg-brand-cream pb-24">
      
      {/* Banner */}
      <section className="bg-brand-chocolate text-brand-cream py-16 border-b border-brand-gold/15 text-center space-y-4">
        <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold">Brand Lookbook</span>
        <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-cream">Visual Gazette</h1>
        <p className="font-sans text-xs font-light text-brand-cream/70 max-w-xl mx-auto leading-relaxed">
          Glimpses of Jodhpur sweet craft, royal custom box packaging details, kitchen hygiene setups, and the frescoed havelis of Mandawa.
        </p>
      </section>

      {/* Grid Content */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider text-brand-chocolate/70">
          {['all', 'sweets', 'namkeen', 'packaging', 'ambience'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 border transition-all ${
                activeFilter === filter
                  ? 'border-brand-maroon bg-brand-maroon text-brand-cream font-bold shadow-md'
                  : 'border-brand-beige bg-white hover:border-brand-chocolate text-brand-chocolate'
              }`}
            >
              {filter === 'all' ? 'All Visuals' : filter}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-brand-beige p-3 group hover:border-brand-gold/40 hover:shadow-xl transition-all duration-300 relative cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-square bg-brand-warm/10 overflow-hidden relative border border-brand-beige/50">
                <img 
                  src={`/${item.image}`} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform duration-500 group-hover:scale-103" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-brand-cream">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>
              <div className="pt-3">
                <span className="text-[9px] text-brand-gold font-bold uppercase tracking-wider block">{item.category}</span>
                <h3 className="font-serif text-sm font-semibold text-brand-chocolate mt-0.5">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Lightbox Zoom Overlay */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-[120] flex items-center justify-center p-6">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-brand-cream hover:text-brand-gold"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="max-w-3xl w-full max-h-[85vh] flex flex-col items-center space-y-4">
            <img 
              src={`/${selectedImage.image}`} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[75vh] object-contain border border-brand-gold/25" 
            />
            <div className="text-center text-brand-cream">
              <span className="text-[10px] text-brand-gold uppercase tracking-widest font-semibold block">{selectedImage.category}</span>
              <h2 className="font-serif text-lg tracking-wide">{selectedImage.title}</h2>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Gallery;
