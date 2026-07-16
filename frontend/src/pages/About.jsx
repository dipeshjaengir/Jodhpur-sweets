import React from 'react';
import { ArrowRight, Compass, Shield, Award, Sparkles } from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-brand-cream pb-24">
      
      {/* Editorial Header */}
      <section className="relative py-24 bg-brand-chocolate text-brand-cream overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="assets/images/banner.jpg" 
            alt="Rajasthani Havelis Background" 
            className="w-full h-full object-cover filter sepia brightness-50"
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-4">
          <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.3em] font-semibold">Our Heritage</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-cream">
            The Legend of New Jodhpur Sweet Home
          </h1>
          <p className="font-serif text-sm md:text-base italic text-brand-gold/80 max-w-2xl mx-auto">
            "Born in the Blue City of Jodhpur, matured amidst the painted frescoes of Mandawa."
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 max-w-5xl mx-auto px-6 space-y-16">
        
        {/* Row 1: The Shekhawati Haveli Inspiration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="font-sans text-[9px] text-brand-gold uppercase tracking-luxury font-bold">Historical Canvas</span>
            <h2 className="font-serif text-2xl text-brand-chocolate font-light">Mandawa - An Open Air Art Gallery</h2>
            <p className="font-sans text-xs text-brand-chocolate/75 leading-relaxed">
              Mandawa, nestled in the Shekhawati region of Rajasthan, was founded as a crucial trading outpost on the ancient Silk Road. Wealthy merchants built magnificent havelis (mansions) decorated with vibrant, intricate frescoes depicting local folklore, deities, and royal life. 
            </p>
            <p className="font-sans text-xs text-brand-chocolate/75 leading-relaxed">
              At **New Jodhpur Sweet Home**, we view confectionery as an extension of this artistic heritage. The geometry of our Kaju Katli cuts and the gold embellishments on our Mawa Kachoris mirror the detailed paintings and structural elegance of these heritage havelis.
            </p>
          </div>
          <div className="relative aspect-[4/3] bg-brand-warm overflow-hidden border border-brand-beige shadow-xl">
            <img 
              src="assets/images/rajputana_hamper.jpg" 
              alt="Mandawa Haveli architecture style" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        {/* Highlight quote */}
        <div className="py-12 border-t border-b border-brand-gold/15 text-center px-4 max-w-3xl mx-auto space-y-4">
          <p className="font-serif text-lg md:text-xl text-brand-maroon font-light leading-relaxed">
            "Our recipes are ancestral scriptures. We do not use commercial thickeners or hydrogenated fats. We use only organic whole milk, real saffron, and clean Desi Ghee."
          </p>
          <span className="font-sans text-[10px] text-brand-gold uppercase tracking-widest block font-bold">— Master Halwai, New Jodhpur Sweet Home</span>
        </div>

        {/* Row 2: Generation Recipes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative order-last md:order-first aspect-[4/3] bg-brand-warm overflow-hidden border border-brand-beige shadow-xl">
            <img 
              src="assets/images/mawa_kachori.jpg" 
              alt="Artisan sweets preparation" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="space-y-5">
            <span className="font-sans text-[9px] text-brand-gold uppercase tracking-luxury font-bold">Generational Craft</span>
            <h2 className="font-serif text-2xl text-brand-chocolate font-light">Cooking in Slow Motion</h2>
            <p className="font-sans text-xs text-brand-chocolate/75 leading-relaxed">
              Before the mechanical churns and gas ranges, royal halwais (chefs) cooked on wood-fired clay stoves (Chulhas). They understood that milk solids release their optimal caramel notes under slow, indirect heat. 
            </p>
            <p className="font-sans text-xs text-brand-chocolate/75 leading-relaxed">
              We continue this practice. Our milk is reduced for hours in wide copper cauldrons (Kadhai) to create the thick Rabdi and Mawa that populate our desserts. It is this refusal to rush that defines our luxury flavor profile.
            </p>
          </div>
        </div>

        {/* Row 3: Our Core Pillars */}
        <div className="pt-8">
          <div className="text-center mb-12">
            <span className="font-sans text-[9px] text-brand-gold uppercase tracking-luxury font-bold">Corporate Pillars</span>
            <h2 className="font-serif text-2xl text-brand-chocolate font-light mt-1">Our Guiding Core Principles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-brand-beige p-6 space-y-4 rounded-sm text-center">
              <div className="w-12 h-12 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-warm/30 text-brand-gold mx-auto">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate">Authentic Heritage</h3>
              <p className="font-sans text-[11px] text-brand-chocolate/70 leading-relaxed">
                We stay strictly loyal to Rajasthani culinary lineages. We do not compromise recipes to fit modern shipping schedules.
              </p>
            </div>
            
            <div className="bg-white border border-brand-beige p-6 space-y-4 rounded-sm text-center">
              <div className="w-12 h-12 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-warm/30 text-brand-gold mx-auto">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate">Uncompromising Quality</h3>
              <p className="font-sans text-[11px] text-brand-chocolate/70 leading-relaxed">
                If the cashew lot is not perfect, we return it. If the saffron is not fragrant, it is not used. Purity is our shield.
              </p>
            </div>

            <div className="bg-white border border-brand-beige p-6 space-y-4 rounded-sm text-center">
              <div className="w-12 h-12 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-warm/30 text-brand-gold mx-auto">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate">Royal Presentation</h3>
              <p className="font-sans text-[11px] text-brand-chocolate/70 leading-relaxed">
                A luxury culinary experience is visually validated. We package our sweets in boxes that feel like royal keepsakes.
              </p>
            </div>
          </div>
        </div>

      </section>
      
    </div>
  );
};
export default About;
