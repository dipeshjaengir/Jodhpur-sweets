import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, Ticket, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    getTotals
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const { subtotal, discount, shippingCharge, total } = getTotals();

  if (!isOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    applyCoupon(couponCode);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-hidden">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Slide-out Panel */}
      <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-brand-cream shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Drawer Header */}
        <div className="px-6 py-5 bg-brand-chocolate text-brand-cream flex items-center justify-between border-b border-brand-gold/15">
          <div className="flex items-center space-x-2.5">
            <span className="font-serif text-lg tracking-[0.1em] text-brand-gold">Royal Basket</span>
            <span className="bg-brand-gold/25 text-brand-gold text-[10px] px-2 py-0.5 rounded-full font-bold">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} Items
            </span>
          </div>
          <button onClick={onClose} className="text-brand-cream/80 hover:text-brand-gold transition-colors">
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Drawer Content / List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 border border-brand-gold/20 rounded-full flex items-center justify-center bg-brand-warm/30 text-brand-gold">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-serif text-lg text-brand-chocolate font-light">Your basket is empty</h3>
              <p className="font-sans text-xs text-brand-chocolate/60 max-w-xs leading-relaxed">
                Add premium handcrafted sweets, Jodhpuri namkeens, or customize your own gift hamper boxes to begin.
              </p>
              <button 
                onClick={() => { onClose(); navigate('/collection/sweets'); }}
                className="mt-2 px-6 py-2.5 bg-brand-maroon text-brand-cream hover:bg-brand-maroon/95 text-xs uppercase tracking-luxury font-medium transition-all"
              >
                Explore Mithai
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex space-x-4 pb-4 border-b border-brand-beige/50 items-start">
                  {/* Product image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover border border-brand-beige bg-brand-warm/30 shrink-0" 
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-brand-chocolate font-medium truncate">{item.name}</h4>
                    
                    {/* Weight tag */}
                    <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider block mt-0.5">
                      {item.isCustomBox ? `Custom Box (${item.weight})` : `Weight: ${item.weight}`}
                    </span>

                    {/* Custom box contents display */}
                    {item.isCustomBox && item.contents && (
                      <div className="bg-brand-warm/50 border border-brand-beige/30 p-2 rounded mt-1.5 text-[10px] text-brand-chocolate/75 font-sans flex flex-wrap gap-x-2 gap-y-1">
                        {item.contents.map((c, i) => (
                          <span key={i} className="inline-block bg-brand-cream/80 px-1.5 py-0.5 border border-brand-gold/10 rounded">{c.name} x{c.qty}</span>
                        ))}
                      </div>
                    )}

                    {/* Controls & Price Row */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-brand-beige bg-white">
                        <button 
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="px-2 py-1 text-brand-chocolate hover:bg-brand-beige/20 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold select-none">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="px-2 py-1 text-brand-chocolate hover:bg-brand-beige/20 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xs text-brand-chocolate/50 font-light block">Unit: ₹{item.price}</span>
                        <span className="text-sm font-semibold text-brand-maroon">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button 
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-brand-chocolate/40 hover:text-red-600 p-1 transition-colors"
                    aria-label="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Controls */}
        {cartItems.length > 0 && (
          <div className="border-t border-brand-beige bg-brand-warm/30 p-6 space-y-4">
            
            {/* Promo Code System */}
            {!coupon ? (
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <div className="flex-1 flex items-center border border-brand-beige bg-white px-2.5 py-1.5 focus-within:border-brand-gold transition-all">
                  <Ticket className="w-4 h-4 text-brand-chocolate/40 mr-1.5 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Apply Coupon (e.g. ROYAL10)" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-transparent text-xs text-brand-chocolate w-full border-none focus:outline-none focus:ring-0 p-0 placeholder-brand-chocolate/40"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-brand-chocolate text-brand-cream hover:bg-brand-maroon text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 p-2.5 flex items-center justify-between text-xs text-green-800">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Coupon <strong>{coupon.code}</strong> applied (10% Off)</span>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="text-[10px] underline hover:text-red-600 font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
            {couponError && <p className="text-[10px] text-red-600 font-medium">{couponError}</p>}

            {/* Calculations */}
            <div className="space-y-2 text-xs text-brand-chocolate/85">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Royal Discount (10%)</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
              </div>
              <div className="gold-line my-1" />
              <div className="flex justify-between text-base font-semibold text-brand-maroon">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handleCheckout}
              className="w-full py-3 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-xs uppercase tracking-luxury font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-lg"
            >
              <span>Proceed to Royal Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
export default CartDrawer;
