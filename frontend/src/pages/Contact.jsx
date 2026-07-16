import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', query: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us. We will respond shortly.');
    setSuccess(true);
    setFormData({ name: '', email: '', phone: '', query: '' });
  };

  return (
    <div className="bg-brand-cream pb-24">
      
      {/* Banner */}
      <section className="bg-brand-chocolate text-brand-cream py-16 border-b border-brand-gold/15 text-center space-y-4">
        <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Connect With Us</span>
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-cream">Contact Our Store</h1>
        <p className="font-sans text-xs font-light text-brand-cream/70 max-w-xl mx-auto leading-relaxed">
          Visit our heritage sweet shop in Mandawa or reach out for catering orders, custom packaging requests, and wholesale sweets inquiries.
        </p>
      </section>

      {/* Main Details & Form */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LHS: Info Panels */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="space-y-4">
              <h2 className="font-serif text-xl md:text-2xl text-brand-chocolate font-light">New Jodhpur Sweet Home</h2>
              <p className="font-sans text-xs text-brand-chocolate/70 leading-relaxed font-light">
                Our primary sweet kitchen and restaurant dine-in branch is located in the historic haveli town of Mandawa. We serve fresh sweets and traditional Rajasthani snacks daily.
              </p>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start space-x-3 text-xs">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-semibold text-brand-chocolate">Store Location:</h4>
                  <span className="font-sans font-light text-brand-chocolate/75 block mt-0.5">
                    Mandawa Mod, Mandawa Road,<br />
                    Mandawa, Jhunjhunu District,<br />
                    Rajasthan - 333704, India
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3 text-xs">
                <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-semibold text-brand-chocolate">Call Us Directly:</h4>
                  <a href="tel:+919999999999" className="font-sans font-light text-brand-maroon hover:text-brand-gold transition-colors block mt-0.5">
                    [INSERT VERIFIED PHONE]
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3 text-xs">
                <Mail className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-semibold text-brand-chocolate">Email Inquiries:</h4>
                  <a href="mailto:info@jodhpursweetsmandawa.com" className="font-sans font-light text-brand-maroon hover:text-brand-gold transition-colors block mt-0.5">
                    info@jodhpursweetsmandawa.com
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3 text-xs">
                <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-semibold text-brand-chocolate">Opening Hours:</h4>
                  <span className="font-sans font-light text-brand-chocolate/75 block mt-0.5">
                    Open Daily: 8:00 AM - 10:00 PM
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RHS: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-brand-beige p-6 md:p-8 rounded-sm shadow-sm">
            <h3 className="font-serif text-lg text-brand-chocolate font-light mb-6">Send an Inquiry Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-brand-chocolate">
              
              <div className="space-y-1">
                <label className="block font-semibold">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Priyadarshini Rathore"
                  className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. priya@mailbox.com"
                    className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold">Phone Contact (Optional)</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. +91 99999 77777"
                    className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold">Your Query Message</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.query}
                  onChange={(e) => setFormData({...formData, query: e.target.value})}
                  placeholder="How can we assist you with our sweets or services?"
                  className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-chocolate hover:bg-brand-maroon text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>

            </form>
          </div>

        </div>

        {/* Map Section */}
        <div className="mt-16 border border-brand-beige bg-white p-3 rounded-sm shadow-sm">
          <h3 className="font-serif text-sm font-semibold text-brand-chocolate mb-3 px-1">Visual Map Directory</h3>
          <div className="w-full h-80 rounded overflow-hidden relative border border-brand-beige/50">
            {/* Embedded maps location for Mandawa Rajasthan */}
            <iframe 
              title="Google Maps Location - Jodhpur Sweet Home Mandawa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14112.593505193026!2d75.13289069502621!3d27.835948332158913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39134a65a25f9d77%3A0xe5a1b3be282f1b0a!2sMandawa%2C%20Rajasthan%20333704!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </section>

    </div>
  );
};
export default Contact;
