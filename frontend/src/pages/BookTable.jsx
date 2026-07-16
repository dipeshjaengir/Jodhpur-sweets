import React, { useState } from 'react';
import { Clock, Users, Calendar, Sparkles, CheckCircle } from 'lucide-react';
import { api } from '../utils/api.js';

export const BookTable = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    date: '',
    time: '18:00',
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.createBooking(formData);
      setBookingDetails(response.booking);
      setSuccess(true);
    } catch (err) {
      alert('Error creating reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-cream pb-24">
      
      {/* Banner */}
      <section className="bg-brand-chocolate text-brand-cream py-16 border-b border-brand-gold/15 text-center space-y-4">
        <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Table Reservations</span>
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-cream">Reserve a Table</h1>
        <p className="font-sans text-xs font-light text-brand-cream/70 max-w-xl mx-auto leading-relaxed">
          Book your dine-in table at our Mandawa restaurant Mod branch. Experience warm hospitality alongside our signature kachoris, street snacks, and freshly prepared sweets.
        </p>
      </section>

      {/* Booking Form Layout */}
      <section className="max-w-xl mx-auto px-6 py-12">
        <div className="bg-white border border-brand-beige p-6 md:p-10 rounded-sm shadow-sm">
          
          {success && bookingDetails ? (
            <div className="text-center py-8 space-y-5">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <h2 className="font-serif text-2xl text-brand-chocolate font-light">Table Confirmed</h2>
              <p className="font-sans text-xs text-brand-chocolate/70 leading-relaxed max-w-sm mx-auto">
                Your reservation at **New Jodhpur Sweet Home Mandawa** has been confirmed. A table has been reserved for your party.
              </p>
              
              <div className="bg-brand-warm/20 border border-brand-beige p-4 text-xs font-sans text-brand-chocolate max-w-xs mx-auto space-y-2 text-left rounded">
                <div><strong>Booking ID:</strong> <span className="float-right text-brand-maroon font-semibold">{bookingDetails.id}</span></div>
                <div><strong>Name:</strong> <span className="float-right">{bookingDetails.name}</span></div>
                <div><strong>Guests:</strong> <span className="float-right">{bookingDetails.guests} Persons</span></div>
                <div><strong>Date:</strong> <span className="float-right">{new Date(bookingDetails.date).toLocaleDateString()}</span></div>
                <div><strong>Time Slot:</strong> <span className="float-right">{bookingDetails.time}</span></div>
              </div>

              <button 
                onClick={() => { setSuccess(false); setFormData({ name: '', email: '', phone: '', guests: '2', date: '', time: '18:00', specialRequests: '' }); }}
                className="mt-4 px-6 py-2.5 bg-brand-maroon text-brand-cream text-xs uppercase tracking-luxury transition-colors"
              >
                Make Another Booking
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs text-brand-chocolate">
              
              <div className="space-y-1">
                <label className="block font-semibold">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Shivraj Shekhawat"
                  className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold">Phone Contact Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. +91 99999 88888"
                    className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold">Email Address (Optional)</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. shivraj@inbox.com"
                    className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Guests</span>
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="block font-semibold flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Date</span>
                  </label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Time Slot</span>
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                  >
                    <option value="09:00">09:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="19:00">07:00 PM</option>
                    <option value="20:00">08:00 PM</option>
                    <option value="21:00">09:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold">Special Dining Requests (Optional)</label>
                <textarea 
                  rows="3"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  placeholder="Allergies, high chair, birthday decoration, quiet table..."
                  className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors mt-2"
              >
                {loading ? 'Confirming Table...' : 'Confirm Table Reservation'}
              </button>

            </form>
          )}

        </div>
      </section>

    </div>
  );
};
export default BookTable;
