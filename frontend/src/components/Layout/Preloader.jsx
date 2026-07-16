import React, { useEffect, useState } from 'react';

export const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Check if user has already loaded in this tab session
    const hasLoaded = sessionStorage.getItem('njsh_loaded');
    if (hasLoaded) {
      setVisible(false);
      return;
    }

    setAnimate(true);

    // Fade out timer
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('njsh_loaded', 'true');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-brand-chocolate z-[99999] flex flex-col items-center justify-center text-brand-cream">
      <div className={`transition-all duration-1000 transform flex flex-col items-center ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Luxury Monogram */}
        <div className="w-20 h-20 border border-brand-gold rounded-full flex items-center justify-center mb-6 relative overflow-hidden">
          <span className="font-serif text-2xl font-semibold tracking-wider text-brand-gold">N</span>
          <div className="absolute inset-0 border border-brand-gold rounded-full scale-90 opacity-40 animate-pulse" />
        </div>
        
        {/* Brand Name */}
        <h1 className="font-serif text-3xl font-light tracking-[0.2em] text-brand-cream text-center mb-2">
          NEW JODHPUR SWEET HOME
        </h1>
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-6">
          Mandawa, Rajasthan
        </p>

        {/* Fine gold drawing line progress */}
        <div className="w-48 h-[1px] bg-brand-maroon overflow-hidden relative">
          <div className="absolute inset-0 bg-brand-gold animate-[draw_1.5s_ease-out_forwards]" style={{ width: '100%', transformOrigin: 'left', transform: 'scaleX(0)' }} />
        </div>
      </div>
      
      {/* Keyframe injection for line draw */}
      <style>{`
        @keyframes draw {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};
export default Preloader;
