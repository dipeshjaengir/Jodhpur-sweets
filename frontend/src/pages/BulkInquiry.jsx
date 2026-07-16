import React, { useState } from 'react';
import { Landmark, Compass, Award, ShieldCheck, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { api } from '../utils/api.js';

export const BulkInquiry = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'corporate', // corporate, wedding, institutional, other
    eventDate: '',
    expectedGuests: '',
    requirements: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      await api.createCatering(formData);
      setSuccess(true);
    } catch (err) {
      alert('Error submitting inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-cream pb-24">
      
      {/* Banner */}
      <section className="bg-brand-chocolate text-brand-cream py-16 border-b border-brand-gold/15 text-center space-y-4">
        <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold flex items-center justify-center space-x-1.5">
          <Landmark className="w-3.5 h-3.5" />
          <span>Bespoke Event catering</span>
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-cream">Bulk & Corporate Orders</h1>
        <p className="font-sans text-xs font-light text-brand-cream/70 max-w-xl mx-auto leading-relaxed">
          Configure customized gift boxes, select traditional silk hampers, and schedule bulk delivery for weddings, corporate celebrations, and festivals.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LHS: Value Proposition Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-brand-beige p-5 space-y-3">
              <Compass className="w-5 h-5 text-brand-gold" />
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate">Custom Branding</h3>
              <p className="font-sans text-[11px] text-brand-chocolate/70 leading-relaxed">
                Add your company logo, initials, or specific royal patterns embossed in gold foil on our packaging box covers.
              </p>
            </div>
            
            <div className="bg-white border border-brand-beige p-5 space-y-3">
              <Award className="w-5 h-5 text-brand-gold" />
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate">Curated Assortments</h3>
              <p className="font-sans text-[11px] text-brand-chocolate/70 leading-relaxed">
                Collaborate with our Master Halwai to curate sweet menus matching your guest list profiles and flavor choices.
              </p>
            </div>

            <div className="bg-white border border-brand-beige p-5 space-y-3">
              <ShieldCheck className="w-5 h-5 text-brand-gold" />
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate">Direct-to-Guest Shipping</h3>
              <p className="font-sans text-[11px] text-brand-chocolate/70 leading-relaxed">
                Provide us with a guest list, and we will package, label, and express-ship fresh boxes to multiple addresses across India.
              </p>
            </div>
          </div>

          {/* RHS: Step Form Wizard */}
          <div className="lg:col-span-7 bg-white border border-brand-beige p-6 md:p-8 rounded-sm shadow-sm">
            {success ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <h2 className="font-serif text-2xl text-brand-chocolate font-light">Royal Request Logged</h2>
                <p className="font-sans text-xs text-brand-chocolate/70 max-w-sm mx-auto leading-relaxed">
                  Thank you for submitting your bulk ordering request. Our event relationships coordinator will review your parameters and reach out within 24 hours.
                </p>
                <button 
                  onClick={() => { setSuccess(false); setStep(1); setFormData({ name: '', email: '', phone: '', eventType: 'corporate', eventDate: '', expectedGuests: '', requirements: '' }); }}
                  className="px-6 py-2 bg-brand-maroon text-brand-cream text-xs uppercase tracking-luxury transition-colors"
                >
                  New Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs text-brand-chocolate">
                
                {/* Wizard Navigation Progress */}
                <div className="flex items-center justify-between pb-4 border-b border-brand-beige/50 text-[10px] uppercase font-bold tracking-widest text-brand-chocolate/50">
                  <span className={step === 1 ? 'text-brand-maroon' : ''}>1. Contact</span>
                  <span>/</span>
                  <span className={step === 2 ? 'text-brand-maroon' : ''}>2. Event Details</span>
                  <span>/</span>
                  <span className={step === 3 ? 'text-brand-maroon' : ''}>3. Packaging</span>
                </div>

                {/* Step 1: Contact */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block font-semibold">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Vikramaditya Singh"
                        className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="e.g. vikram@royalraj.com"
                        className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold">Phone Contact Number</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Event Details */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block font-semibold">Event Classification</label>
                      <select
                        value={formData.eventType}
                        onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                        className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                      >
                        <option value="corporate">Corporate Celebration / Diwali Gifting</option>
                        <option value="wedding">Royal Wedding / Favor Box</option>
                        <option value="festival">Seasonal Festival Bulk Order</option>
                        <option value="other">Private Family Banquet</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold">Scheduled Date of Event</label>
                      <input 
                        type="date" 
                        required
                        value={formData.eventDate}
                        onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                        className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold">Expected Guests Count</label>
                      <input 
                        type="number" 
                        required
                        value={formData.expectedGuests}
                        onChange={(e) => setFormData({...formData, expectedGuests: e.target.value})}
                        placeholder="e.g. 150"
                        className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Packaging & Customizations */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block font-semibold">Custom Packaging Requirements & Customization Notes</label>
                      <textarea 
                        rows="5"
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                        placeholder="Mention box color choices, custom stickers/logo designs, dietary sweet requests, delivery details..."
                        className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-between items-center pt-4 border-t border-brand-beige/50">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-4 py-2 border border-brand-beige text-brand-chocolate hover:border-brand-chocolate text-xs uppercase tracking-wider transition-colors"
                    >
                      Back
                    </button>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors flex items-center space-x-1.5"
                  >
                    {loading ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>{step === 3 ? 'Submit Request' : 'Next Step'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
export default BulkInquiry;
