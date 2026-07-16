import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Clock, Calendar, CheckCircle2, FileDown, ArrowRight, ShieldCheck, Ticket, QrCode } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { toast } from '../utils/toast.js';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotals, coupon, clearCart } = useCart();
  const { user } = useAuth();

  const { subtotal, discount, total } = getTotals();
  const [step, setStep] = useState(1); // 1: Pickup Info, 2: Payment, 3: Completed
  
  // Pickup states
  const [pickupDateOption, setPickupDateOption] = useState('today'); // today, tomorrow, custom
  const [customDate, setCustomDate] = useState('');
  const [pickupTimeOption, setPickupTimeOption] = useState('10:00 AM'); // time slots or custom
  const [customTime, setCustomTime] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');

  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('CARD'); // CARD, UPI, COD
  const [payAdvance, setPayAdvance] = useState(false);
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState('0');
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Credit Card Animation States
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cardFlipped, setCardFlipped] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // UPI Simulation States
  const [upiProcessing, setUpiProcessing] = useState(false);

  // Get final selected pickup date
  const getSelectedPickupDate = () => {
    if (pickupDateOption === 'today') return new Date().toLocaleDateString();
    if (pickupDateOption === 'tomorrow') {
      const tom = new Date();
      tom.setDate(tom.getDate() + 1);
      return tom.toLocaleDateString();
    }
    return customDate || new Date().toLocaleDateString();
  };

  // Get final selected pickup time
  const getSelectedPickupTime = () => {
    if (pickupTimeOption === 'custom') return customTime || '12:00 PM';
    return pickupTimeOption;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'CARD') {
      setProcessingPayment(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingPayment(false);
      toast('Payment authorized successfully!', 'success');
    } else if (paymentMethod === 'UPI') {
      setUpiProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setUpiProcessing(false);
      toast('UPI transfer confirmed!', 'success');
    }

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          weight: item.weight,
          price: item.price,
          quantity: item.quantity,
          isCustomBox: item.isCustomBox,
          contents: item.contents
        })),
        pickupDate: getSelectedPickupDate(),
        pickupTime: getSelectedPickupTime(),
        pickupNotes,
        advancePayment: payAdvance ? parseFloat(advancePaymentAmount) || 0 : 0,
        contactInfo,
        paymentMethod,
        couponCode: coupon?.code || ''
      };

      const response = await api.createOrder(orderPayload);
      setOrderConfirmed(response.order);
      clearCart();
      toast(`Order Booking ${response.order.id} placed successfully!`, 'success');
      setStep(3);
    } catch (err) {
      alert('Error creating order: ' + err.message);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="text-center py-40 bg-brand-cream min-h-screen">
        <h2 className="font-serif text-2xl text-brand-chocolate font-light">Your basket is empty</h2>
        <p className="text-xs text-brand-chocolate/50 mt-1">Please add items to your cart before booking.</p>
        <Link to="/collection/sweets" className="mt-6 inline-block px-6 py-2.5 bg-brand-maroon text-brand-cream text-xs uppercase tracking-luxury">Explore Mithai</Link>
      </div>
    );
  }

  const finalPickupDate = getSelectedPickupDate();
  const finalPickupTime = getSelectedPickupTime();
  const advance = payAdvance ? parseFloat(advancePaymentAmount) || 0 : 0;
  const balanceDue = total - advance;

  return (
    <div className="bg-brand-cream pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LHS: Multi-Step Forms */}
          <div className="lg:col-span-8 bg-white border border-brand-beige p-6 md:p-10 rounded-sm shadow-sm">
            
            {/* Step Wizard Header */}
            <div className="flex items-center justify-between pb-6 border-b border-brand-beige/50 mb-8 text-[10px] uppercase font-bold tracking-widest text-brand-chocolate/40">
              <span className={step === 1 ? 'text-brand-maroon' : ''}>1. Pickup Details</span>
              <span>/</span>
              <span className={step === 2 ? 'text-brand-maroon' : ''}>2. Payment Options</span>
              <span>/</span>
              <span className={step === 3 ? 'text-brand-maroon' : ''}>3. Booking Confirmation</span>
            </div>

            {/* STEP 1: Pickup Scheduler */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6 text-xs text-brand-chocolate">
                <h3 className="font-serif text-lg font-light">Customer Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                      placeholder="e.g. Aditi Rathore"
                      className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-semibold">Phone Contact (for pickup confirmation)</label>
                    <input 
                      type="tel" 
                      required
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      placeholder="e.g. +91 99999 44444"
                      className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    placeholder="e.g. client@royalmail.com"
                    className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <h3 className="font-serif text-lg font-light pt-4 border-t border-brand-beige/50">Store Pickup Scheduler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <label className="block font-semibold flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-brand-gold" />
                      <span>Choose Pickup Date:</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPickupDateOption('today')}
                        className={`py-2 border text-center transition-all ${pickupDateOption === 'today' ? 'border-brand-maroon bg-brand-maroon/5 text-brand-maroon font-bold' : 'border-brand-beige bg-white'}`}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickupDateOption('tomorrow')}
                        className={`py-2 border text-center transition-all ${pickupDateOption === 'tomorrow' ? 'border-brand-maroon bg-brand-maroon/5 text-brand-maroon font-bold' : 'border-brand-beige bg-white'}`}
                      >
                        Tomorrow
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickupDateOption('custom')}
                        className={`py-2 border text-center transition-all ${pickupDateOption === 'custom' ? 'border-brand-maroon bg-brand-maroon/5 text-brand-maroon font-bold' : 'border-brand-beige bg-white'}`}
                      >
                        Custom Date
                      </button>
                    </div>
                    {pickupDateOption === 'custom' && (
                      <input 
                        type="date"
                        required
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold mt-2"
                      />
                    )}
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <label className="block font-semibold flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-brand-gold" />
                      <span>Choose Pickup Time:</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={pickupTimeOption}
                        onChange={(e) => setPickupTimeOption(e.target.value)}
                        className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                      >
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                        <option value="06:30 PM">06:30 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                        <option value="custom">Other Time</option>
                      </select>
                    </div>
                    {pickupTimeOption === 'custom' && (
                      <input 
                        type="text"
                        required
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        placeholder="e.g. 12:45 PM"
                        className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold mt-2 font-mono"
                      />
                    )}
                  </div>

                </div>

                <div className="space-y-1">
                  <label className="block font-semibold">Special Instructions / Pickup Notes</label>
                  <textarea 
                    rows="3"
                    value={pickupNotes}
                    onChange={(e) => setPickupNotes(e.target.value)}
                    placeholder="E.g., Pack sweets separately, candles needed, ready extra early..."
                    className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors mt-4 flex items-center justify-center space-x-1.5"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* STEP 2: Payment Portal */}
            {step === 2 && (
              <div className="space-y-6 text-brand-chocolate">
                <h3 className="font-serif text-lg font-light">Select Payment Option</h3>
                
                {/* Method selector tabs */}
                <div className="grid grid-cols-3 gap-3 text-center text-xs font-semibold">
                  <button
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-3 border flex flex-col items-center space-y-1 transition-all ${paymentMethod === 'CARD' ? 'border-brand-maroon bg-brand-maroon/5 text-brand-maroon font-bold' : 'border-brand-beige hover:border-brand-chocolate bg-white'}`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit / Debit</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-3 border flex flex-col items-center space-y-1 transition-all ${paymentMethod === 'UPI' ? 'border-brand-maroon bg-brand-maroon/5 text-brand-maroon font-bold' : 'border-brand-beige hover:border-brand-chocolate bg-white'}`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI Scan QR</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('COD')}
                    className={`py-3 border flex flex-col items-center space-y-1 transition-all ${paymentMethod === 'COD' ? 'border-brand-maroon bg-brand-maroon/5 text-brand-maroon font-bold' : 'border-brand-beige hover:border-brand-chocolate bg-white'}`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Pay at Store</span>
                  </button>
                </div>

                {/* Optional Advance Payment */}
                <div className="bg-brand-warm/25 border border-brand-gold/15 p-4 rounded text-xs space-y-3 font-sans">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={payAdvance}
                      onChange={(e) => {
                        setPayAdvance(e.target.checked);
                        if (!e.target.checked) setAdvancePaymentAmount('0');
                      }}
                      className="rounded border-brand-beige text-brand-maroon focus:ring-brand-maroon shrink-0"
                    />
                    <strong className="text-brand-chocolate">Would you like to pay an advance deposit online?</strong>
                  </label>
                  {payAdvance && (
                    <div className="space-y-1 pt-1.5 animate-[fadeIn_0.3s_ease-out]">
                      <span className="block text-[10px] text-brand-gold uppercase tracking-wider font-semibold">Advance Payment Amount (₹)</span>
                      <input 
                        type="number"
                        min="1"
                        max={total}
                        value={advancePaymentAmount}
                        onChange={(e) => {
                          const val = Math.min(total, parseFloat(e.target.value) || 0);
                          setAdvancePaymentAmount(val.toString());
                        }}
                        className="w-full bg-white border border-brand-beige p-2 text-xs focus:outline-none focus:border-brand-gold max-w-[200px]"
                      />
                      <span className="block text-[9px] text-brand-chocolate/40 mt-1">Remaining balance due at store pickup: **₹{(total - parseFloat(advancePaymentAmount || 0)).toFixed(2)}**</span>
                    </div>
                  )}
                </div>

                {/* Sub-Panels based on Payment Method */}
                {paymentMethod === 'CARD' && (
                  <div className="space-y-6">
                    {/* Visual Card Flip Screen */}
                    <div className="flex justify-center py-4">
                      <div className="relative w-80 h-48 rounded-xl shadow-2xl transition-all duration-700 preserve-3d" style={{ transform: cardFlipped ? 'rotateY(180deg)' : 'none', transformStyle: 'preserve-3d' }}>
                        
                        {/* Front of Card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-maroon to-brand-chocolate text-brand-cream p-5 flex flex-col justify-between rounded-xl border border-brand-gold/30 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                          <div className="flex justify-between items-start">
                            <span className="font-serif text-sm italic tracking-widest text-brand-gold">New Jodhpur Royal Card</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded">Visa</span>
                          </div>
                          
                          <div className="font-sans text-lg tracking-widest my-4">
                            {cardDetails.number || '•••• •••• •••• ••••'}
                          </div>

                          <div className="flex justify-between text-[10px] uppercase font-light">
                            <div>
                              <span className="text-[7px] text-brand-cream/50 block">Card Holder</span>
                              <span>{cardDetails.name || 'FULL NAME'}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[7px] text-brand-cream/50 block">Expires</span>
                              <span>{cardDetails.expiry || 'MM/YY'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Back of Card */}
                        <div className="absolute inset-0 bg-gradient-to-bl from-brand-chocolate to-brand-maroon text-brand-cream rounded-xl border border-brand-gold/30 p-5 flex flex-col justify-between backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                          <div className="w-full h-8 bg-black -mx-5 mt-2" />
                          <div className="flex justify-end items-center space-x-2 mt-4">
                            <span className="text-[7px] text-brand-cream/50 uppercase tracking-widest">CVV Signature</span>
                            <span className="bg-white text-black px-3 py-1 font-mono text-xs rounded">{cardDetails.cvv || '•••'}</span>
                          </div>
                          <div className="text-[8px] text-brand-cream/40 leading-tight text-right">
                            Authentic Mithai Brand Cards. Private banking credentials.
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Inputs */}
                    <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="block font-semibold">Credit Card Number</label>
                        <input 
                          type="text" 
                          required
                          maxLength="19"
                          value={cardDetails.number}
                          onFocus={() => setCardFlipped(false)}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            value = value.match(/.{1,4}/g)?.join(' ') || value;
                            setCardDetails({...cardDetails, number: value});
                          }}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-semibold">Cardholder Name</label>
                        <input 
                          type="text" 
                          required
                          value={cardDetails.name}
                          onFocus={() => setCardFlipped(false)}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value.toUpperCase()})}
                          placeholder="VIKRAMADITYA SINGH"
                          className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block font-semibold">Expiry Date</label>
                          <input 
                            type="text" 
                            required
                            maxLength="5"
                            value={cardDetails.expiry}
                            onFocus={() => setCardFlipped(false)}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                              setCardDetails({...cardDetails, expiry: val});
                            }}
                            placeholder="MM/YY"
                            className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-semibold">CVV Code</label>
                          <input 
                            type="password" 
                            required
                            maxLength="3"
                            value={cardDetails.cvv}
                            onFocus={() => setCardFlipped(true)}
                            onBlur={() => setCardFlipped(false)}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                            placeholder="•••"
                            className="w-full bg-white border border-brand-beige p-2.5 text-xs focus:outline-none focus:border-brand-gold font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={processingPayment}
                        className="w-full py-3.5 bg-brand-maroon text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors mt-4 flex items-center justify-center space-x-1.5"
                      >
                        {processingPayment ? (
                          <span>Processing Security Portal (2s)...</span>
                        ) : (
                          <span>Secure Payment (₹{advance > 0 ? advance : total})</span>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div className="text-center py-6 space-y-6">
                    <div className="max-w-[220px] mx-auto bg-white border border-brand-beige p-4 rounded shadow-sm flex flex-col items-center">
                      <div className="w-40 h-40 bg-brand-warm/30 border border-brand-gold/30 rounded flex items-center justify-center mb-3">
                        <i className="fa-solid fa-qrcode text-5xl text-brand-maroon shrink-0" />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-brand-gold font-bold">BHIM UPI SCANNER</span>
                    </div>

                    <p className="font-sans text-xs text-brand-chocolate/75 max-w-sm mx-auto leading-relaxed">
                      Scan the simulated UPI code above to settle ₹{advance > 0 ? advance : total}. The portal will automatically complete checkout verification.
                    </p>

                    <button 
                      onClick={handlePlaceOrder}
                      disabled={upiProcessing}
                      className="px-8 py-3.5 bg-brand-maroon text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-all inline-block shadow-md"
                    >
                      {upiProcessing ? (
                        <span>Checking UPI Reconciliation (3s)...</span>
                      ) : (
                        <span>Verify Advance Payment</span>
                      )}
                    </button>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="space-y-4 text-center py-6">
                    <p className="font-sans text-xs text-brand-chocolate/75 max-w-md mx-auto leading-relaxed">
                      Pay at Store checkout option selected. No online deposit is required. You can pay **₹{total}** at the store counter in Mandawa using Cash, Card, or UPI during order pickup.
                    </p>
                    <button 
                      onClick={handlePlaceOrder}
                      className="px-8 py-3.5 bg-brand-maroon text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors shadow-md"
                    >
                      Confirm Order Booking
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 border border-brand-beige text-brand-chocolate hover:border-brand-chocolate text-xs uppercase tracking-wider transition-colors mt-2"
                >
                  Back to Pickup Details
                </button>
              </div>
            )}

            {/* STEP 3: Completed Receipt */}
            {step === 3 && orderConfirmed && (
              <div className="text-center py-10 space-y-6">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto animate-bounce" />
                
                <div className="space-y-2">
                  <span className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-bold">Booking Confirmed</span>
                  <h2 className="font-serif text-2xl md:text-3xl text-brand-chocolate font-light">Order Reserved Successfully</h2>
                  <p className="font-sans text-xs text-brand-chocolate/75 max-w-md mx-auto leading-relaxed">
                    Your order **{orderConfirmed.id}** has been registered. The Master Halwai has started prepping your items.
                  </p>
                </div>

                {/* Booking Receipt Card */}
                <div className="bg-brand-warm/25 border border-brand-beige p-5 text-xs font-sans text-brand-chocolate max-w-md mx-auto space-y-2.5 text-left rounded">
                  <div><strong>Booking ID:</strong> <span className="float-right text-brand-maroon font-bold">{orderConfirmed.id}</span></div>
                  <div><strong>Pickup Date:</strong> <span className="float-right font-semibold">{orderConfirmed.pickupDate}</span></div>
                  <div><strong>Pickup Time Slot:</strong> <span className="float-right font-semibold">{orderConfirmed.pickupTime}</span></div>
                  <div><strong>Total Amount:</strong> <span className="float-right">₹{orderConfirmed.total}</span></div>
                  <div><strong>Advance Paid:</strong> <span className="float-right text-green-700">₹{orderConfirmed.advancePayment || 0}</span></div>
                  <div className="border-t border-brand-beige pt-2 font-bold">
                    Balance Due at Store: <span className="float-right text-brand-maroon">₹{orderConfirmed.total - (orderConfirmed.advancePayment || 0)}</span>
                  </div>
                  <div className="gold-line my-1.5" />
                  <div className="text-[10px] text-center text-brand-gold/80 font-bold uppercase tracking-wider">
                    Store Collection: Mandawa Mod Branch
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto pt-4">
                  <a 
                    href={api.getInvoiceUrl(orderConfirmed.id)}
                    download 
                    className="w-full py-2.5 bg-brand-chocolate hover:bg-brand-maroon text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors flex items-center justify-center space-x-1.5 border border-brand-chocolate"
                  >
                    <FileDown className="w-4 h-4 text-brand-gold" />
                    <span>Download Invoice</span>
                  </a>

                  <Link 
                    to={`/account?track=${orderConfirmed.id}`}
                    className="w-full py-2.5 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors text-center block"
                  >
                    Track Status
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* RHS: Cart Summary Panel */}
          {step !== 3 && (
            <div className="lg:col-span-4 bg-white border border-brand-beige p-5 rounded-sm space-y-4 shadow-sm">
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate border-b border-brand-beige/50 pb-2">Order Items</h3>
              
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex justify-between items-start text-xs pb-3 border-b border-brand-beige/30">
                    <div>
                      <h4 className="font-serif font-semibold text-brand-chocolate">{item.name}</h4>
                      <span className="text-[10px] text-brand-chocolate/50 block mt-0.5">{item.weight} x{item.quantity}</span>
                    </div>
                    <span className="font-semibold text-brand-maroon shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Math */}
              <div className="space-y-2 text-xs text-brand-chocolate/85 pt-2 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount (10%)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="gold-line my-1" />
                <div className="flex justify-between text-sm font-semibold text-brand-maroon">
                  <span>Order Total</span>
                  <span>₹{total}</span>
                </div>
                {payAdvance && (
                  <>
                    <div className="flex justify-between text-green-700 text-[11px]">
                      <span>Online Deposit Advance</span>
                      <span>-₹{advancePaymentAmount}</span>
                    </div>
                    <div className="flex justify-between text-brand-chocolate/90 font-bold border-t border-dashed pt-1.5">
                      <span>Due at Counter</span>
                      <span>₹{balanceDue}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-brand-warm/20 border border-brand-gold/15 p-3 text-[10px] text-brand-chocolate/75 font-sans leading-relaxed rounded flex items-start space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Store Collection Info:</strong> Settle payment and pick up your items at our Mandawa Mod counter on <strong>{finalPickupDate}</strong> around <strong>{finalPickupTime}</strong>.
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
export default Checkout;
