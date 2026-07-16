import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ClipboardList, Heart, Truck, User, FileDown, Sparkles, AlertTriangle, Clock, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../utils/api.js';

export const Account = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'history';
  const trackOrderParam = searchParams.get('track');

  const { user, logout, loading: authLoading } = useAuth();
  const { wishlistItems, addToCart, toggleWishlist } = useCart();

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  
  // Order Tracking States
  const [trackingId, setTrackingId] = useState(trackOrderParam || '');
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Redirect guest users to login page
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/account');
    }
  }, [user, authLoading, navigate]);

  // Fetch previous orders
  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const simOrders = JSON.parse(localStorage.getItem('sim_orders')) || [];
        setOrders(simOrders.filter(o => o.userId === user.id || o.userId === 'user-sim'));
      } catch (err) {
        console.error('Error fetching account orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user, activeTab]);

  // Fetch track order stats
  useEffect(() => {
    if (trackOrderParam) {
      handleTrackOrder(trackOrderParam);
    }
  }, [trackOrderParam]);

  const handleTrackOrder = async (idToTrack) => {
    if (!idToTrack) return;
    setTrackingLoading(true);
    setTrackingError('');
    try {
      const data = await api.trackOrder(idToTrack);
      setTrackingData(data);
      setActiveTab('tracker');
    } catch (err) {
      setTrackingError('Order not found or incorrect tracking ID');
      setTrackingData(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="text-center py-40 bg-brand-cream min-h-screen">
        <div className="w-10 h-10 border-2 border-brand-gold border-t-brand-maroon rounded-full animate-spin mx-auto mb-4" />
        <span className="text-xs text-brand-chocolate/50 uppercase tracking-widest">Entering Royal Chambers...</span>
      </div>
    );
  }

  const handleQuickAdd = (product) => {
    const defaultVariant = product.priceVariants[0];
    addToCart(product, defaultVariant.weight, defaultVariant.price, 1);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border border-green-200';
      case 'ready-for-pickup': return 'bg-brand-maroon text-brand-cream border border-brand-gold/20';
      case 'preparing': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'rejected':
      case 'canceled': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30';
    }
  };

  return (
    <div className="bg-brand-cream pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LHS: Navigation Menu */}
          <div className="lg:col-span-3 bg-white border border-brand-beige p-5 rounded-sm shadow-sm space-y-6">
            <div className="border-b border-brand-beige pb-4 text-center">
              <div className="w-16 h-16 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-warm/30 text-brand-gold mx-auto mb-3 font-serif text-2xl font-light">
                {user.name.charAt(0)}
              </div>
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate">{user.name}</h3>
              <span className="text-[10px] text-brand-chocolate/40 font-light">{user.email}</span>
            </div>

            <div className="flex flex-col space-y-2 text-xs font-semibold uppercase tracking-wider text-left text-brand-chocolate/75">
              <button 
                onClick={() => { setActiveTab('history'); navigate('/account?tab=history'); }}
                className={`flex items-center space-x-2.5 p-2 rounded transition-colors ${activeTab === 'history' ? 'bg-brand-maroon text-brand-cream' : 'hover:bg-brand-warm/30'}`}
              >
                <ClipboardList className="w-4.5 h-4.5 shrink-0" />
                <span>Order History</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('wishlist'); navigate('/account?tab=wishlist'); }}
                className={`flex items-center space-x-2.5 p-2 rounded transition-colors ${activeTab === 'wishlist' ? 'bg-brand-maroon text-brand-cream' : 'hover:bg-brand-warm/30'}`}
              >
                <Heart className="w-4.5 h-4.5 shrink-0" />
                <span>My Wishlist</span>
              </button>

              <button 
                onClick={() => { setActiveTab('tracker'); navigate('/account?tab=tracker'); }}
                className={`flex items-center space-x-2.5 p-2 rounded transition-colors ${activeTab === 'tracker' ? 'bg-brand-maroon text-brand-cream' : 'hover:bg-brand-warm/30'}`}
              >
                <Truck className="w-4.5 h-4.5 shrink-0" />
                <span>Collection Tracker</span>
              </button>

              <button 
                onClick={() => { setActiveTab('profile'); navigate('/account?tab=profile'); }}
                className={`flex items-center space-x-2.5 p-2 rounded transition-colors ${activeTab === 'profile' ? 'bg-brand-maroon text-brand-cream' : 'hover:bg-brand-warm/30'}`}
              >
                <User className="w-4.5 h-4.5 shrink-0" />
                <span>My Profile</span>
              </button>

              <div className="gold-line my-2" />
              
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center space-x-2.5 p-2 rounded hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
              >
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* RHS: Tab Content */}
          <div className="lg:col-span-9 bg-white border border-brand-beige p-6 md:p-8 rounded-sm shadow-sm min-h-[400px]">
            
            {/* 1. ORDER HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <h2 className="font-serif text-lg font-light text-brand-chocolate pb-2 border-b border-brand-beige/50">My Purchase Ledger</h2>
                
                {ordersLoading ? (
                  <div className="text-center py-10 text-xs text-brand-chocolate/40">Compiling order details...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-xs text-brand-chocolate/65">
                    No orders placed under this account yet.
                    <Link to="/collection/sweets" className="block text-brand-maroon underline font-semibold mt-2">Explore sweets catalog</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      const balanceDue = order.total - (order.advancePayment || 0);
                      return (
                        <div key={order.id} className="border border-brand-beige bg-white p-5 md:p-6 rounded-sm shadow-sm text-xs text-brand-chocolate space-y-4">
                          
                          {/* Order & Invoice Headers */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-beige/50 pb-3 gap-2">
                            <div className="space-y-0.5">
                              <h3 className="font-serif text-sm font-semibold tracking-wide text-brand-chocolate">
                                Order #{order.id}
                              </h3>
                              <p className="text-[10px] text-brand-chocolate/55 font-mono">
                                Invoice #{order.invoiceNumber || `INV-${order.id.split('-').pop()}`}
                              </p>
                              <p className="text-[9px] text-brand-chocolate/40 font-sans font-light">
                                Booked on: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                              </p>
                            </div>
                            
                            <div>
                              <span className={`px-3 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${getStatusBadgeClass(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* 3-Column Metadata Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 leading-relaxed font-sans text-brand-chocolate/80">
                            
                            {/* Column 1: Pickup Specifications */}
                            <div className="space-y-1 md:border-r border-brand-beige/35 md:pr-4">
                              <h4 className="font-serif font-bold text-[10px] text-brand-gold uppercase tracking-wider">Pickup details</h4>
                              <div>Date: <strong className="font-medium text-brand-chocolate">{order.pickupDate}</strong></div>
                              <div>Time: <strong className="font-medium text-brand-chocolate">{order.pickupTime}</strong></div>
                              <div className="text-[10px] text-brand-chocolate/55 font-light pt-1">
                                Location: <span className="italic">New Jodhpur Sweet Home, Mandawa Road, Rajasthan</span>
                              </div>
                            </div>

                            {/* Column 2: Financial Ledger */}
                            <div className="space-y-1 md:border-r border-brand-beige/35 md:pr-4">
                              <h4 className="font-serif font-bold text-[10px] text-brand-gold uppercase tracking-wider">Financial Breakdown</h4>
                              <div>Payment Method: <span className="font-medium">{order.paymentMethod}</span></div>
                              <div>Payment Status: <span className={`font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-green-700' : 'text-yellow-700'}`}>{order.paymentStatus}</span></div>
                              <div className="pt-1.5 text-[10px] space-y-0.5">
                                <div className="text-green-700">Total Paid (Advance): <strong>₹{order.advancePayment || 0}</strong></div>
                                <div className="text-brand-maroon font-bold">Remaining Balance: <strong>₹{balanceDue}</strong></div>
                              </div>
                            </div>

                            {/* Column 3: Collection Tracker Estimate */}
                            <div className="space-y-1">
                              <h4 className="font-serif font-bold text-[10px] text-brand-gold uppercase tracking-wider">Store Collection</h4>
                              <div>Estimated Pickup: <strong className="text-brand-chocolate">{order.pickupTime}</strong></div>
                              <div className="text-[10px] text-brand-chocolate/50 italic pt-1">
                                Notes: "{order.pickupNotes || 'No special instructions provided'}"
                              </div>
                            </div>

                          </div>

                          {/* Items Ordered List */}
                          <div className="border-t border-brand-beige/40 pt-3 bg-brand-warm/10 p-3 rounded-sm">
                            <h4 className="font-serif font-semibold text-[10px] text-brand-gold uppercase tracking-wider mb-2">Items Ordered</h4>
                            <div className="space-y-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-[10px] border-b border-brand-beige/20 pb-1 last:border-none last:pb-0">
                                  <span>
                                    {item.name} {item.isCustomBox ? `(${item.contents?.map(c => `${c.name} x${c.qty}`).join(', ') || ''})` : `[${item.weight}]`}
                                  </span>
                                  <strong className="text-brand-chocolate/90 font-mono">
                                    Qty: {item.quantity} | Subtotal: ₹{item.price * item.quantity}
                                  </strong>
                                </div>
                              ))}
                            </div>
                            <div className="text-right border-t border-brand-beige/30 pt-2 mt-2">
                              <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider">Grand Total: </span>
                              <strong className="text-sm font-serif text-brand-maroon ml-1">₹{order.total}</strong>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              onClick={() => handleTrackOrder(order.id)}
                              className="px-4 py-2 border border-brand-beige hover:border-brand-chocolate transition-colors font-semibold uppercase tracking-wider text-[9px] flex items-center space-x-1.5 rounded-sm"
                            >
                              <Clock className="w-3.5 h-3.5 text-brand-gold" />
                              <span>Track Live</span>
                            </button>

                            <a
                              href={api.getInvoiceUrl(order.id)}
                              download
                              className="px-4 py-2 bg-brand-maroon hover:bg-brand-maroon/90 text-brand-cream font-semibold uppercase tracking-wider text-[9px] flex items-center space-x-1.5 transition-colors rounded-sm"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              <span>Download Invoice</span>
                            </a>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="font-serif text-lg font-light text-brand-chocolate pb-2 border-b border-brand-beige/50">My Wishlist</h2>
                
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12 text-xs text-brand-chocolate/65">
                    Your wishlist is currently empty.
                    <Link to="/collection/sweets" className="block text-brand-maroon underline font-semibold mt-2">Explore sweets catalog</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((prod) => (
                      <div key={prod.id} className="bg-white border border-brand-beige p-3 text-center group relative">
                        <Link to={`/product/${prod.id}`} className="block relative aspect-square overflow-hidden mb-3 border border-brand-beige/50">
                          <img src={`/${prod.image}`} alt={prod.name} className="w-full h-full object-cover" />
                        </Link>
                        <h4 className="font-serif text-sm font-semibold text-brand-chocolate truncate">
                          <Link to={`/product/${prod.id}`}>{prod.name}</Link>
                        </h4>
                        <span className="text-xs text-brand-maroon font-semibold block mt-1">₹{prod.priceVariants[0].price}</span>
                        
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleQuickAdd(prod)}
                            className="flex-grow py-2 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-[10px] uppercase font-bold tracking-wider"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(prod)}
                            className="px-2 py-2 border border-brand-beige hover:border-red-600 hover:bg-red-50 text-red-500 text-xs font-bold"
                            title="Remove"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. ORDER TRACKER */}
            {activeTab === 'tracker' && (
              <div className="space-y-8">
                <h2 className="font-serif text-lg font-light text-brand-chocolate pb-2 border-b border-brand-beige/50">Store Collection Status Tracker</h2>
                
                {/* Search Bar */}
                <div className="max-w-md flex space-x-2">
                  <div className="flex-grow flex items-center border border-brand-beige bg-white px-2.5 py-1.5 focus-within:border-brand-gold">
                    <input 
                      type="text" 
                      placeholder="Enter Booking ID (e.g. RSH-123456)" 
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="bg-transparent text-xs text-brand-chocolate w-full border-none focus:outline-none focus:ring-0 p-0"
                    />
                  </div>
                  <button 
                    onClick={() => handleTrackOrder(trackingId)}
                    disabled={trackingLoading}
                    className="px-6 py-2 bg-brand-chocolate hover:bg-brand-maroon text-brand-cream text-xs uppercase tracking-wider font-semibold"
                  >
                    Track
                  </button>
                </div>

                {trackingLoading && <div className="text-center py-6 text-xs text-brand-chocolate/40">Locating coordinates...</div>}
                {trackingError && <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs text-center font-medium rounded font-sans">{trackingError}</div>}

                {/* Tracker Display */}
                {trackingData && (
                  <div className="space-y-6 pt-4 animate-[fadeIn_0.4s_ease-out]">
                    
                    {/* Status Banner */}
                    <div className="p-4 bg-brand-warm/30 border border-brand-gold/15 rounded flex items-center justify-between text-xs">
                      <div>
                        <strong>Order Status:</strong> <span className="uppercase text-brand-maroon font-bold ml-1">{trackingData.status}</span>
                      </div>
                      <div className="text-brand-chocolate/50 font-light">
                        Elapsed Time: {trackingData.elapsedMinutes} mins (Auto-progresses to Ready for Pickup in 5m)
                      </div>
                    </div>

                    {/* Progress Timeline Stepper */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-2">
                      {trackingData.stages.map((stage, i) => (
                        <div key={stage.key} className="flex flex-col items-center text-center space-y-2 relative">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                            stage.completed 
                              ? 'bg-brand-maroon border-brand-maroon text-brand-cream shadow-md' 
                              : 'bg-white border-brand-beige text-brand-chocolate/30'
                          }`}>
                            {stage.completed ? '✓' : i + 1}
                          </div>
                          
                          <div className="space-y-0.5">
                            <h4 className={`font-serif text-xs font-semibold ${stage.completed ? 'text-brand-chocolate' : 'text-brand-chocolate/40'}`}>{stage.label}</h4>
                            {stage.completed && (
                              <span className="text-[9px] text-brand-gold/80 block">Verified</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Kitchen Progress Pipeline Visualizer */}
                    <div className="border border-brand-beige p-6 bg-white rounded-sm shadow-inner mt-8">
                      <h4 className="font-serif text-xs font-semibold text-brand-chocolate mb-4 text-center uppercase tracking-luxury">Royal Kitchen Status Monitor</h4>
                      <div className="w-full h-40 bg-brand-warm/15 border border-brand-beige/50 rounded-sm relative flex items-center justify-around px-4">
                        
                        {/* Background connecting bar */}
                        <div className="absolute left-[10%] right-[10%] top-1/2 h-1 bg-brand-beige" />
                        <div 
                          className="absolute left-[10%] top-1/2 h-1 bg-brand-gold transition-all duration-1000" 
                          style={{
                            width: trackingData.status === 'placed' ? '0%'
                              : trackingData.status === 'accepted' ? '25%'
                              : trackingData.status === 'preparing' ? '50%'
                              : trackingData.status === 'ready-for-pickup' ? '75%'
                              : '80%'
                          }}
                        />

                        {/* Node 1: Logged */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${trackingData.status === 'placed' ? 'bg-brand-maroon text-brand-cream animate-pulse border-brand-gold' : 'bg-white border-brand-beige text-brand-chocolate'}`}>
                            <ClipboardList className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] mt-1 font-semibold">Booked</span>
                        </div>

                        {/* Node 2: Accepted */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${trackingData.status === 'accepted' ? 'bg-brand-maroon text-brand-cream animate-pulse border-brand-gold' : 'bg-white border-brand-beige text-brand-chocolate'}`}>
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] mt-1 font-semibold">Approved</span>
                        </div>

                        {/* Node 3: Kitchen */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${trackingData.status === 'preparing' ? 'bg-brand-maroon text-brand-cream animate-pulse border-brand-gold' : 'bg-white border-brand-beige text-brand-chocolate'}`}>
                            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                          </div>
                          <span className="text-[9px] mt-1 font-semibold">Preparing</span>
                        </div>

                        {/* Node 4: Ready */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${trackingData.status === 'ready-for-pickup' ? 'bg-brand-maroon text-brand-cream animate-bounce border-brand-gold' : 'bg-white border-brand-beige text-brand-chocolate'}`}>
                            <Sparkles className="w-5 h-5 text-brand-gold" />
                          </div>
                          <span className="text-[9px] mt-1 font-semibold">Ready</span>
                        </div>

                        {/* Node 5: Picked up */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${trackingData.status === 'completed' ? 'bg-green-700 text-brand-cream border-green-200' : 'bg-white border-brand-beige text-brand-chocolate'}`}>
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] mt-1 font-semibold">Collected</span>
                        </div>

                      </div>

                      {/* Info alert */}
                      <div className="mt-4 p-3 bg-brand-warm/20 border border-brand-gold/15 text-[10px] text-brand-chocolate/70 leading-relaxed rounded-sm font-sans flex items-start space-x-1.5">
                        <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                        <div>
                          <strong>Pickup details:</strong> Please arrive at our store counter on <strong>{trackingData.pickupDate}</strong> at <strong>{trackingData.pickupTime}</strong>. Ensure you have the Booking ID **{trackingData.orderId}** ready for verification.
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* 4. PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-serif text-lg font-light text-brand-chocolate pb-2 border-b border-brand-beige/50">My Profile Credentials</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-brand-chocolate">
                  <div className="space-y-4">
                    <h3 className="font-serif text-sm font-semibold text-brand-gold">Account Credentials</h3>
                    <div>
                      <span className="text-brand-chocolate/40 block font-light">Full Name:</span>
                      <strong className="text-sm font-serif">{user.name}</strong>
                    </div>
                    <div>
                      <span className="text-brand-chocolate/40 block font-light">Email Address:</span>
                      <strong className="text-sm font-serif">{user.email}</strong>
                    </div>
                    <div>
                      <span className="text-brand-chocolate/40 block font-light">Contact Number:</span>
                      <strong className="text-sm font-serif">{user.phone}</strong>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-serif text-sm font-semibold text-brand-gold">Access Details</h3>
                    <div>
                      <span className="text-brand-chocolate/40 block font-light">Access Status:</span>
                      <strong className="text-sm font-serif uppercase text-brand-maroon">{user.role} Account</strong>
                    </div>
                    <div>
                      <span className="text-brand-chocolate/40 block font-light">Account Registered:</span>
                      <strong className="text-sm font-sans font-light">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
export default Account;
