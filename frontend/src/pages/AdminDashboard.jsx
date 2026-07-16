import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, Sparkles, LogOut, DollarSign, ShoppingBag, 
  TableProperties, Send, Plus, Minus, Check, X, RefreshCw, Star,
  Search, Filter, Printer, FileDown, Clock, Calendar, User, Phone, BookOpen,
  Tag, Percent, Settings, Users, Grid, BarChart3, Edit, Trash2, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { toast } from '../utils/toast.js';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('metrics');
  const [loading, setLoading] = useState(true);
  
  // Dashboard states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [catering, setCatering] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Categories list mock
  const [categories, setCategories] = useState([
    { id: 'sweets', name: 'Traditional Mithai', count: 9 },
    { id: 'namkeen', name: 'Rajasthani Namkeen', count: 5 },
    { id: 'hampers', name: 'Royal Gift Hampers', count: 4 },
    { id: 'party', name: 'Celebration Accessories & Cakes', count: 6 }
  ]);

  // Coupons mock
  const [coupons, setCoupons] = useState([
    { code: 'ROYAL10', discount: '10% Off', description: 'Standard discount for luxury box builder orders', status: 'Active' },
    { code: 'MANDAWA20', discount: '20% Off', description: 'Special local tourism festive discount code', status: 'Active' },
    { code: 'WELCOME50', discount: '₹50 Off', description: 'New account welcome coupon code', status: 'Inactive' }
  ]);

  // Settings state
  const [systemSettings, setSystemSettings] = useState({
    storeOpenTime: '09:00 AM',
    storeCloseTime: '09:00 PM',
    autoApproveOrders: true,
    advanceMinimumPercent: '10%',
    supportPhone: '+91 99999 44444',
    announcementText: 'Experience slow-simmered pure ghee sweets in the painted town of Mandawa.'
  });

  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState(null); // null when listing, object/empty when editing/creating
  const [isEditingMode, setIsEditingMode] = useState(false); // false: Create, true: Edit
  
  // Product Form Bindings
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    category: 'sweets',
    description: '',
    image: 'assets/images/mawa_kachori.jpg',
    shelfLife: '7 days',
    ingredients: '',
    allergens: '',
    isFeatured: false,
    isBestSeller: false,
    status: 'enabled', // enabled, disabled
    priceVariants: [{ weight: '250g', price: 150, stock: 50 }]
  });

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all'); 

  const refreshDashboardData = async () => {
    try {
      const statsData = await api.getAdminStats();
      setStats(statsData);

      const ordersData = await api.getAdminOrders();
      const cleanedOrders = (ordersData || []).filter(o => o && o.id);
      setOrders(cleanedOrders);

      const productsData = await api.getProducts();
      setProducts(productsData);

      const cateringData = await api.getAdminCatering();
      setCatering(cateringData);

      const bookingsData = await api.getAdminBookings();
      setBookings(bookingsData);

      const reviewsData = await api.getAdminReviews();
      setReviews(reviewsData);

      const customersData = await api.getAdminCustomers();
      setCustomers(customersData);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      navigate('/auth?redirect=/admin');
      return;
    }

    const fetchAdminData = async () => {
      setLoading(true);
      await refreshDashboardData();
      setLoading(false);
    };
    fetchAdminData();
  }, [user, isAdmin, authLoading, navigate]);

  const handleUpdateOrderStatus = async (orderId, status, paymentStatus) => {
    try {
      await api.updateOrderStatus(orderId, status, paymentStatus);
      toast(`Order status updated to: ${status}`);
      await refreshDashboardData();
    } catch (err) {
      toast('Error updating order status: ' + err.message, 'error');
    }
  };

  const handleUpdateProductStock = async (productId, weight, diff) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const variant = product.priceVariants.find(v => v.weight === weight);
    if (!variant) return;

    const newStock = Math.max(0, variant.stock + diff);

    try {
      await api.updateProductStock(productId, weight, newStock);
      await refreshDashboardData();
    } catch (err) {
      toast('Error updating inventory stock', 'error');
    }
  };

  const handleModerateReview = async (reviewId, approved) => {
    try {
      await api.moderateReview(reviewId, approved);
      toast(approved ? 'Review approved for public' : 'Review hidden');
      await refreshDashboardData();
    } catch (err) {
      toast('Error moderating review', 'error');
    }
  };

  // Product CRUD Handlers
  const handleOpenCreateProduct = () => {
    setProductForm({
      id: 'prod-' + Date.now(),
      name: '',
      category: 'sweets',
      description: '',
      image: 'assets/images/mawa_kachori.jpg',
      shelfLife: '7 days',
      ingredients: '',
      allergens: '',
      isFeatured: false,
      isBestSeller: false,
      status: 'enabled',
      priceVariants: [{ weight: '250g', price: 150, stock: 50 }]
    });
    setIsEditingMode(false);
    setEditingProduct({});
  };

  const handleOpenEditProduct = (prod) => {
    setProductForm({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      description: prod.description || '',
      image: prod.image || 'assets/images/mawa_kachori.jpg',
      shelfLife: prod.shelfLife || '7 days',
      ingredients: Array.isArray(prod.ingredients) ? prod.ingredients.join(', ') : prod.ingredients || '',
      allergens: Array.isArray(prod.allergens) ? prod.allergens.join(', ') : prod.allergens || '',
      isFeatured: prod.isFeatured || false,
      isBestSeller: prod.isBestSeller || false,
      status: prod.status || 'enabled',
      priceVariants: prod.priceVariants ? [...prod.priceVariants] : [{ weight: '250g', price: 150, stock: 50 }]
    });
    setIsEditingMode(true);
    setEditingProduct(prod);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        ingredients: productForm.ingredients.split(',').map(i => i.trim()).filter(Boolean),
        allergens: productForm.allergens.split(',').map(i => i.trim()).filter(Boolean),
        priceVariants: productForm.priceVariants.map(v => ({
          ...v,
          price: parseFloat(v.price) || 0,
          stock: parseInt(v.stock) || 0
        }))
      };

      if (isEditingMode) {
        await api.editProduct(payload);
        toast(`Product "${payload.name}" updated successfully!`);
      } else {
        await api.createProduct(payload);
        toast(`Product "${payload.name}" created successfully!`);
      }

      setEditingProduct(null);
      await refreshDashboardData();
    } catch (err) {
      toast('Error saving product: ' + err.message, 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.deleteProduct(productId);
      toast('Product deleted successfully');
      await refreshDashboardData();
    } catch (err) {
      toast('Error deleting product: ' + err.message, 'error');
    }
  };

  const handleToggleProductStatus = async (prod) => {
    try {
      const updatedStatus = prod.status === 'disabled' ? 'enabled' : 'disabled';
      await api.editProduct({ ...prod, status: updatedStatus });
      toast(`Product ${prod.name} has been ${updatedStatus === 'enabled' ? 'enabled' : 'disabled'}`);
      await refreshDashboardData();
    } catch (err) {
      toast('Error toggling product status', 'error');
    }
  };

  const handleToggleProductFeatured = async (prod) => {
    try {
      await api.editProduct({ ...prod, isFeatured: !prod.isFeatured });
      toast(`Product featured status updated`);
      await refreshDashboardData();
    } catch (err) {
      toast('Error toggling product featured status', 'error');
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = productForm.priceVariants.map((v, i) => {
      if (i === index) {
        return { ...v, [field]: value };
      }
      return v;
    });
    setProductForm({ ...productForm, priceVariants: updatedVariants });
  };

  const handleAddVariant = () => {
    setProductForm({
      ...productForm,
      priceVariants: [...productForm.priceVariants, { weight: '500g', price: 280, stock: 50 }]
    });
  };

  const handleRemoveVariant = (index) => {
    if (productForm.priceVariants.length === 1) return;
    setProductForm({
      ...productForm,
      priceVariants: productForm.priceVariants.filter((_, i) => i !== index)
    });
  };

  const handlePrintOrder = (order) => {
    if (!order) return;
    const printWindow = window.open('', '_blank');
    const itemsListHTML = (order.items || []).map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name} [${item.weight}]</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
      <head>
        <title>Print Order - ${order.id}</title>
        <style>
          body { font-family: sans-serif; color: #2B1810; margin: 40px; }
          .receipt { border: 1px solid #C9A24B; padding: 20px; max-width: 600px; margin: auto; }
          h2 { color: #5C1A24; text-align: center; margin-bottom: 5px; }
          .meta-table { width: 100%; margin-bottom: 20px; }
          .meta-table td { padding: 4px 0; font-size: 13px; }
          .items-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .totals { text-align: right; margin-top: 20px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <h2>NEW JODHPUR SWEET HOME</h2>
          <div style="text-align: center; font-size: 11px; margin-bottom: 20px;">Mandawa Road, Rajasthan, India</div>
          <table class="meta-table">
            <tr>
              <td><strong>Booking ID:</strong> ${order.id}</td>
              <td style="text-align: right;"><strong>Date Booked:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Customer Name:</strong> ${order.contactInfo?.name || 'Guest'}</td>
              <td style="text-align: right;"><strong>Phone:</strong> ${order.contactInfo?.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Scheduled Pickup Date:</strong> ${order.pickupDate || 'N/A'}</td>
              <td style="text-align: right;"><strong>Scheduled Pickup Time:</strong> ${order.pickupTime || 'N/A'}</td>
            </tr>
          </table>
          <table class="items-table">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHTML}
            </tbody>
          </table>
          <div class="totals">
            <div>Order Total: ₹${order.total}</div>
            <div>Advance Paid: ₹${order.advancePayment || 0}</div>
            <div style="color: #5C1A24; font-size: 16px; margin-top: 5px;">Balance Due: ₹${order.total - (order.advancePayment || 0)}</div>
          </div>
          <div style="text-align: center; margin-top: 30px; font-size: 10px; color: #888;">
            Thank you for shopping with us. Crafted with pure Ghee.
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getMaxSalesVal = () => {
    if (!stats || !stats.salesByCategory) return 100;
    return Math.max(...Object.values(stats.salesByCategory), 100);
  };

  if (authLoading || loading) {
    return (
      <div className="text-center py-40 bg-brand-chocolate min-h-screen text-brand-cream flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-gold mb-4" />
        <span className="text-xs uppercase tracking-[0.2em] text-brand-gold">Loading Admin Console Database...</span>
      </div>
    );
  }

  // Filtered Orders Calculation
  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    const name = order.contactInfo?.name || '';
    const phone = order.contactInfo?.phone || '';
    const id = order.id || '';
    
    const matchesSearch = 
      id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      phone.includes(orderSearch);

    const matchesStatus = orderFilter === 'all' || order.status === orderFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Expanded Metrics Calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingPickups = orders.filter(o => ['placed', 'accepted', 'preparing', 'ready-for-pickup'].includes(o.status)).length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const canceledOrders = orders.filter(o => ['canceled', 'rejected'].includes(o.status)).length;
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className="bg-brand-chocolate min-h-screen text-brand-cream pb-24 font-sans">
      
      {/* Top Navbar */}
      <header className="border-b border-brand-gold/15 bg-brand-chocolate/90 sticky top-0 z-40 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          <Link to="/" className="flex flex-col items-center">
            <span className="font-serif text-lg tracking-[0.2em] text-brand-cream">NEW JODHPUR</span>
            <span className="font-serif text-[10px] tracking-[0.3em] text-brand-gold">ADMIN CONSOLE</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xs uppercase tracking-wider text-brand-cream/80 hover:text-brand-gold transition-colors">
              Return to Shop
            </Link>
            
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="text-xs uppercase tracking-wider text-red-400 hover:text-red-500 transition-colors flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LHS Tabs Menu */}
        <div className="lg:col-span-3 border border-brand-gold/15 bg-brand-chocolate/30 p-5 rounded space-y-4">
          <div className="text-center border-b border-brand-gold/10 pb-3">
            <span className="text-[10px] text-brand-gold uppercase tracking-[0.2em] block">Authenticated Staff</span>
            <strong className="text-xs text-brand-cream font-serif">{user?.name}</strong>
          </div>

          <div className="flex flex-col space-y-2 text-xs font-semibold uppercase tracking-wider text-left text-brand-cream/85">
            <button 
              onClick={() => { setActiveTab('metrics'); setEditingProduct(null); }}
              className={`p-2.5 rounded transition-colors text-left flex items-center space-x-2 ${activeTab === 'metrics' ? 'bg-brand-maroon text-brand-cream border border-brand-gold/10 font-bold' : 'hover:bg-brand-maroon/20'}`}
            >
              <BarChart3 className="w-4 h-4 text-brand-gold" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => { setActiveTab('orders'); setEditingProduct(null); }}
              className={`p-2.5 rounded transition-colors text-left flex items-center space-x-2 ${activeTab === 'orders' ? 'bg-brand-maroon text-brand-cream border border-brand-gold/10 font-bold' : 'hover:bg-brand-maroon/20'}`}
            >
              <ShoppingBag className="w-4 h-4 text-brand-gold" />
              <span>Orders Booking</span>
            </button>
            <button 
              onClick={() => { setActiveTab('inventory'); setEditingProduct(null); }}
              className={`p-2.5 rounded transition-colors text-left flex items-center space-x-2 ${activeTab === 'inventory' ? 'bg-brand-maroon text-brand-cream border border-brand-gold/10 font-bold' : 'hover:bg-brand-maroon/20'}`}
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>Products & Catalog</span>
            </button>
            <button 
              onClick={() => { setActiveTab('categories'); setEditingProduct(null); }}
              className={`p-2.5 rounded transition-colors text-left flex items-center space-x-2 ${activeTab === 'categories' ? 'bg-brand-maroon text-brand-cream border border-brand-gold/10 font-bold' : 'hover:bg-brand-maroon/20'}`}
            >
              <Grid className="w-4 h-4 text-brand-gold" />
              <span>Categories</span>
            </button>
            <button 
              onClick={() => { setActiveTab('customers'); setEditingProduct(null); }}
              className={`p-2.5 rounded transition-colors text-left flex items-center space-x-2 ${activeTab === 'customers' ? 'bg-brand-maroon text-brand-cream border border-brand-gold/10 font-bold' : 'hover:bg-brand-maroon/20'}`}
            >
              <Users className="w-4 h-4 text-brand-gold" />
              <span>Customer Ledger</span>
            </button>
            <button 
              onClick={() => { setActiveTab('reviews'); setEditingProduct(null); }}
              className={`p-2.5 rounded transition-colors text-left flex items-center space-x-2 ${activeTab === 'reviews' ? 'bg-brand-maroon text-brand-cream border border-brand-gold/10 font-bold' : 'hover:bg-brand-maroon/20'}`}
            >
              <Star className="w-4 h-4 text-brand-gold" />
              <span>Reviews Moderation</span>
            </button>
            <button 
              onClick={() => { setActiveTab('coupons'); setEditingProduct(null); }}
              className={`p-2.5 rounded transition-colors text-left flex items-center space-x-2 ${activeTab === 'coupons' ? 'bg-brand-maroon text-brand-cream border border-brand-gold/10 font-bold' : 'hover:bg-brand-maroon/20'}`}
            >
              <Percent className="w-4 h-4 text-brand-gold" />
              <span>Coupons & Promos</span>
            </button>
            <button 
              onClick={() => { setActiveTab('catering'); setEditingProduct(null); }}
              className={`p-2.5 rounded transition-colors text-left flex items-center space-x-2 ${activeTab === 'catering' ? 'bg-brand-maroon text-brand-cream border border-brand-gold/10 font-bold' : 'hover:bg-brand-maroon/20'}`}
            >
              <BookOpen className="w-4 h-4 text-brand-gold" />
              <span>Catering & Bookings</span>
            </button>
            <button 
              onClick={() => { setActiveTab('settings'); setEditingProduct(null); }}
              className={`p-2.5 rounded transition-colors text-left flex items-center space-x-2 ${activeTab === 'settings' ? 'bg-brand-maroon text-brand-cream border border-brand-gold/10 font-bold' : 'hover:bg-brand-maroon/20'}`}
            >
              <Settings className="w-4 h-4 text-brand-gold" />
              <span>Console Settings</span>
            </button>
          </div>
        </div>

        {/* RHS Tab Content Panel */}
        <div className="lg:col-span-9 border border-brand-gold/15 bg-brand-chocolate/20 p-6 md:p-8 rounded min-h-[500px]">
          
          {/* TAB 1: METRICS OVERVIEW */}
          {activeTab === 'metrics' && stats && (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div className="bg-brand-maroon/25 border border-brand-gold/20 p-5 text-center rounded space-y-2">
                  <DollarSign className="w-6 h-6 text-brand-gold mx-auto" />
                  <span className="text-[10px] text-brand-gold uppercase tracking-wider block">Total Sales Revenue</span>
                  <strong className="text-xl font-serif text-brand-cream font-light">₹{totalRevenue}</strong>
                </div>

                <div className="bg-brand-maroon/25 border border-brand-gold/20 p-5 text-center rounded space-y-2">
                  <ShoppingBag className="w-6 h-6 text-brand-gold mx-auto" />
                  <span className="text-[10px] text-brand-gold uppercase tracking-wider block">Today's Orders</span>
                  <strong className="text-xl font-serif text-brand-cream font-light">{todayOrders}</strong>
                </div>

                <div className="bg-brand-maroon/25 border border-brand-gold/20 p-5 text-center rounded space-y-2">
                  <Clock className="w-6 h-6 text-brand-gold mx-auto" />
                  <span className="text-[10px] text-brand-gold uppercase tracking-wider block">Pending Pickups</span>
                  <strong className="text-xl font-serif text-brand-cream font-light">{pendingPickups}</strong>
                </div>

                <div className="bg-brand-maroon/25 border border-brand-gold/20 p-5 text-center rounded space-y-2">
                  <Users className="w-6 h-6 text-brand-gold mx-auto" />
                  <span className="text-[10px] text-brand-gold uppercase tracking-wider block">Total Registered Users</span>
                  <strong className="text-xl font-serif text-brand-cream font-light">{customers.length}</strong>
                </div>
              </div>

              {/* Status Ratios */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-center text-xs">
                <div className="bg-brand-chocolate/40 p-4 border border-brand-gold/10 rounded">
                  <span className="text-green-400 font-bold block text-base">{completedOrders}</span>
                  <span className="text-[10px] text-brand-cream/60">Completed Orders</span>
                </div>
                <div className="bg-brand-chocolate/40 p-4 border border-brand-gold/10 rounded">
                  <span className="text-red-400 font-bold block text-base">{canceledOrders}</span>
                  <span className="text-[10px] text-brand-cream/60">Cancelled / Rejected</span>
                </div>
                <div className="bg-brand-chocolate/40 p-4 border border-brand-gold/10 rounded">
                  <span className="text-brand-gold font-bold block text-base">{stats.metrics.pendingCatering}</span>
                  <span className="text-[10px] text-brand-cream/60">Pending B2B Inquiries</span>
                </div>
              </div>

              {/* Custom SVG Charts */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-brand-gold/10 pt-8">
                <div className="md:col-span-8 space-y-4 col-span-12">
                  <h3 className="font-serif text-sm font-semibold text-brand-gold uppercase tracking-wider">Revenue Breakdown by Category</h3>
                  <div className="space-y-4 bg-brand-maroon/5 border border-brand-gold/10 p-5 rounded font-sans text-xs">
                    {Object.entries(stats.salesByCategory).map(([cat, val]) => {
                      const maxVal = getMaxSalesVal();
                      const widthPercent = Math.max(10, Math.min(100, (val / maxVal) * 100));
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between uppercase tracking-wider text-[10px] text-brand-gold/80">
                            <span>{cat}</span>
                            <span>₹{Math.round(val)}</span>
                          </div>
                          <div className="w-full h-3 bg-brand-chocolate rounded overflow-hidden">
                            <div className="h-full bg-brand-gold transition-all duration-1000" style={{ width: `${widthPercent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-4 col-span-12 space-y-4">
                  <h3 className="font-serif text-sm font-semibold text-brand-gold uppercase tracking-wider">Inventory Alerts</h3>
                  <div className="space-y-3">
                    {stats.lowStockAlerts.length === 0 ? (
                      <p className="text-xs text-brand-cream/40 italic">All stock levels satisfactory.</p>
                    ) : (
                      stats.lowStockAlerts.slice(0, 5).map((alert, i) => (
                        <div key={i} className="p-3 bg-red-950/20 border border-red-500/20 text-xs rounded text-left flex justify-between items-center">
                          <div>
                            <span className="font-serif font-bold block">{alert.name}</span>
                            <span className="text-[10px] text-brand-cream/50 font-light">Variant: {alert.weight}</span>
                          </div>
                          <span className="text-red-400 font-bold bg-red-900/30 px-2 py-0.5 rounded text-[10px]">{alert.stock} Left</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Orders inside Dashboard */}
              <div className="border-t border-brand-gold/10 pt-8 space-y-4">
                <h3 className="font-serif text-sm font-semibold text-brand-gold uppercase tracking-wider">Recent Orders Ledger</h3>
                <div className="space-y-2">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="p-3 border border-brand-gold/10 bg-brand-chocolate/40 rounded flex items-center justify-between text-xs font-sans">
                      <div>
                        <strong>{o.id}</strong> - {o.contactInfo?.name} ({o.contactInfo?.phone})
                        <div className="text-[10px] text-brand-cream/50 mt-0.5">Pickup: {o.pickupDate} at {o.pickupTime}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-brand-gold font-bold block">₹{o.total}</span>
                        <span className="text-[9px] uppercase text-brand-cream/70 font-semibold">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-gold/15">
                <h2 className="font-serif text-lg font-light text-brand-gold">Active Store Collection Registry</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  
                  {/* Search Bar */}
                  <div className="flex items-center bg-brand-chocolate/40 border border-brand-gold/20 px-2 py-1.5 text-xs text-brand-cream focus-within:border-brand-gold">
                    <Search className="w-3.5 h-3.5 text-brand-gold/60 mr-1.5 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Search ID, Client or Phone..." 
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="bg-transparent border-none text-xs text-brand-cream placeholder-brand-cream/40 focus:outline-none focus:ring-0 p-0 w-44"
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <div className="flex items-center bg-brand-chocolate/40 border border-brand-gold/20 px-2 py-1.5 text-xs text-brand-cream">
                    <Filter className="w-3.5 h-3.5 text-brand-gold/60 mr-1.5 shrink-0" />
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="bg-transparent border-none text-xs text-brand-cream focus:outline-none focus:ring-0 p-0 pr-4 select-dark"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="all">All States</option>
                      <option value="placed">Booked</option>
                      <option value="accepted">Accepted</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready-for-pickup">Ready for Pickup</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Cancelled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Order Lists */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <p className="text-xs text-brand-cream/40 italic text-center py-10">No matching orders logged in database.</p>
                ) : (
                  filteredOrders.map((order) => {
                    const balance = order.total - (order.advancePayment || 0);
                    return (
                      <div key={order.id} className="border border-brand-gold/15 bg-brand-chocolate/40 p-4 rounded text-xs space-y-3 relative">
                        
                        {/* Order Header info */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-2 border-b border-brand-gold/10 gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <strong className="font-serif text-sm text-brand-cream">{order.id}</strong>
                              <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold ${
                                order.status === 'completed' ? 'bg-green-700/20 text-green-400' 
                                : order.status === 'ready-for-pickup' ? 'bg-brand-maroon text-brand-cream border border-brand-gold/20'
                                : order.status === 'preparing' ? 'bg-yellow-500/20 text-yellow-400'
                                : order.status === 'canceled' || order.status === 'rejected' ? 'bg-red-500/20 text-red-400'
                                : 'bg-brand-gold/10 text-brand-gold'
                              }`}>{order.status}</span>
                            </div>
                            <span className="text-[10px] text-brand-cream/40 block font-sans font-light">Booked on: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase font-bold text-brand-gold bg-brand-gold/5 border border-brand-gold/20 px-2.5 py-0.5 rounded">₹{order.total}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${order.paymentStatus === 'paid' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {order.paymentStatus?.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Items Split Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 leading-relaxed font-sans font-light text-brand-cream/80 pt-1">
                          
                          {/* Col 1: Customer Details */}
                          <div className="space-y-1 border-r border-brand-gold/5 pr-4">
                            <h4 className="font-serif font-semibold text-[11px] text-brand-gold uppercase tracking-wider">Customer Details</h4>
                            <div className="flex items-center space-x-1.5"><User className="w-3.5 h-3.5 text-brand-gold/50 shrink-0" /> <span>{order.contactInfo?.name || 'Guest'}</span></div>
                            <div className="flex items-center space-x-1.5"><Phone className="w-3.5 h-3.5 text-brand-gold/50 shrink-0" /> <span>{order.contactInfo?.phone || 'N/A'}</span></div>
                            <div className="text-[10px] text-brand-cream/50 pt-1 font-light italic">Notes: "{order.pickupNotes || 'No instructions'}"</div>
                          </div>

                          {/* Col 2: Pickup details */}
                          <div className="space-y-1 border-r border-brand-gold/5 pr-4">
                            <h4 className="font-serif font-semibold text-[11px] text-brand-gold uppercase tracking-wider">Pickup details</h4>
                            <div className="flex items-center space-x-1.5"><Calendar className="w-3.5 h-3.5 text-brand-gold/50 shrink-0" /> <span>Date: {order.pickupDate}</span></div>
                            <div className="flex items-center space-x-1.5"><Clock className="w-3.5 h-3.5 text-brand-gold/50 shrink-0" /> <span>Time: {order.pickupTime}</span></div>
                            <div className="pt-1.5 text-[10px]">
                              <div>Advance Paid: <strong className="text-green-400">₹{order.advancePayment || 0}</strong></div>
                              <div>Due at Store: <strong className="text-brand-gold font-bold">₹{balance}</strong></div>
                            </div>
                          </div>

                          {/* Col 3: Ordered products */}
                          <div className="space-y-1">
                            <h4 className="font-serif font-semibold text-[11px] text-brand-gold uppercase tracking-wider">Products Booked</h4>
                            <div className="max-h-20 overflow-y-auto pr-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="text-[10px] border-b border-brand-gold/5 pb-1 mb-1">
                                  {item.name} {item.isCustomBox ? `(${item.contents?.map(c => `${c.name} x${c.qty}`).join(', ') || ''})` : `[${item.weight}]`} <strong className="text-brand-gold ml-1">x{item.quantity}</strong>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* Order Controls Bar */}
                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-brand-gold/10 justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handlePrintOrder(order)}
                              className="px-2.5 py-1 bg-brand-chocolate hover:bg-brand-maroon transition-colors text-[9px] uppercase font-bold border border-brand-gold/15 flex items-center space-x-1"
                              title="Print Order Receipt"
                            >
                              <Printer className="w-3.5 h-3.5 text-brand-gold" />
                              <span>Print</span>
                            </button>
                            <a
                              href={api.getInvoiceUrl(order.id)}
                              download
                              className="px-2.5 py-1 bg-brand-chocolate hover:bg-brand-maroon transition-colors text-[9px] uppercase font-bold border border-brand-gold/15 flex items-center space-x-1"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              <span>Invoice</span>
                            </a>
                          </div>

                          {/* State Transition controllers */}
                          <div className="flex flex-wrap gap-1.5">
                            {order.status === 'placed' && (
                              <>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'accepted', null)}
                                  className="px-2 py-1 bg-green-800 hover:bg-green-700 text-brand-cream text-[9px] uppercase font-bold rounded"
                                >
                                  Accept Order
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'rejected', null)}
                                  className="px-2 py-1 bg-red-800 hover:bg-red-700 text-brand-cream text-[9px] uppercase font-bold rounded"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {order.status === 'accepted' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'preparing', null)}
                                className="px-2 py-1 px-3 bg-yellow-700 hover:bg-yellow-600 text-brand-cream text-[9px] uppercase font-bold rounded"
                              >
                                Mark Preparing
                              </button>
                            )}

                            {order.status === 'preparing' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'ready-for-pickup', null)}
                                className="px-2.5 py-1 bg-brand-maroon hover:bg-brand-maroon/90 text-brand-cream text-[9px] uppercase font-bold rounded"
                              >
                                Ready for Pickup
                              </button>
                            )}

                            {order.status === 'ready-for-pickup' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'completed', 'paid')}
                                className="px-2.5 py-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-chocolate text-[9px] uppercase font-bold rounded"
                              >
                                Mark Completed
                              </button>
                            )}

                            {/* Cancel Button */}
                            {!['completed', 'canceled', 'rejected'].includes(order.status) && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'canceled', null)}
                                className="px-2 py-1 bg-brand-chocolate hover:bg-red-900 border border-brand-gold/15 text-brand-cream/60 hover:text-brand-cream text-[9px] uppercase font-bold rounded"
                              >
                                Cancel Order
                              </button>
                            )}

                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS & CATALOG CRUD */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              
              {editingProduct === null ? (
                // LISTING VIEW
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-brand-gold/15">
                    <h2 className="font-serif text-lg font-light text-brand-gold">Mithai & Namkeen Catalog Manager</h2>
                    <button
                      onClick={handleOpenCreateProduct}
                      className="px-3 py-1.5 bg-brand-maroon hover:bg-brand-maroon/90 border border-brand-gold/25 text-brand-cream text-[10px] uppercase font-bold flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Create Product</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="border border-brand-gold/15 bg-brand-chocolate/40 p-4 rounded text-xs space-y-3 relative">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <img src={`/${product.image}`} alt={product.name} className="w-10 h-10 object-cover border border-brand-gold/15 rounded" />
                            <div>
                              <h4 className="font-serif text-sm font-semibold text-brand-cream">{product.name}</h4>
                              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-light">{product.category}</span>
                            </div>
                          </div>
                          
                          {/* Badges */}
                          <div className="flex items-center space-x-2">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold ${product.status === 'disabled' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-green-950 text-green-400 border border-green-800'}`}>
                              {product.status === 'disabled' ? 'Hidden' : 'Visible'}
                            </span>
                            {product.isFeatured && (
                              <span className="bg-brand-gold text-brand-chocolate px-1.5 py-0.5 rounded text-[8px] uppercase font-bold">Featured</span>
                            )}
                          </div>
                        </div>

                        {/* Variants display */}
                        <div className="space-y-1 border-t border-brand-gold/10 pt-2 font-mono text-[10px]">
                          {product.priceVariants?.map((v) => (
                            <div key={v.weight} className="flex justify-between items-center text-brand-cream/80">
                              <span>{v.weight} - ₹{v.price}</span>
                              <div className="flex items-center space-x-2">
                                <button onClick={() => handleUpdateProductStock(product.id, v.weight, -5)} className="p-0.5 hover:bg-brand-maroon/30 text-brand-gold"><Minus className="w-3 h-3" /></button>
                                <span className={v.stock < 15 ? 'text-red-400 font-bold' : ''}>{v.stock} pcs</span>
                                <button onClick={() => handleUpdateProductStock(product.id, v.weight, 5)} className="p-0.5 hover:bg-brand-maroon/30 text-brand-gold"><Plus className="w-3 h-3" /></button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-brand-gold/10">
                          <button
                            onClick={() => handleToggleProductStatus(product)}
                            className="p-1.5 bg-brand-chocolate hover:bg-brand-maroon text-brand-cream text-[10px] border border-brand-gold/20 flex items-center space-x-1"
                            title={product.status === 'disabled' ? 'Enable Visibility' : 'Disable Visibility'}
                          >
                            {product.status === 'disabled' ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
                          </button>
                          <button
                            onClick={() => handleToggleProductFeatured(product)}
                            className="p-1.5 bg-brand-chocolate hover:bg-brand-maroon text-brand-gold text-[10px] border border-brand-gold/20 flex items-center space-x-1"
                            title="Toggle Featured Status"
                          >
                            <Star className={`w-3.5 h-3.5 ${product.isFeatured ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleOpenEditProduct(product)}
                            className="p-1.5 bg-brand-chocolate hover:bg-brand-maroon text-brand-cream text-[10px] border border-brand-gold/20 flex items-center space-x-1"
                            title="Edit Product details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 bg-red-950/20 hover:bg-red-800 text-red-400 hover:text-brand-cream text-[10px] border border-red-500/20 flex items-center space-x-1"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                // CREATE OR EDIT FORM VIEW
                <form onSubmit={handleSaveProduct} className="space-y-6 text-xs animate-[fadeIn_0.3s_ease-out]">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-gold/15">
                    <h2 className="font-serif text-lg font-light text-brand-gold">
                      {isEditingMode ? `Modify "${productForm.name}"` : 'Create Royal Sweet / Snack'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-3 py-1.5 bg-brand-chocolate hover:bg-brand-maroon border border-brand-gold/20 text-brand-cream text-[10px] uppercase font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-brand-gold/85 font-semibold">Product UID (Unique String)</label>
                        <input 
                          type="text" 
                          required
                          disabled={isEditingMode}
                          value={productForm.id}
                          onChange={(e) => setProductForm({ ...productForm, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                          placeholder="e.g. kesar-kaju-katli"
                          className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-brand-gold/85 font-semibold">Sweet Name</label>
                        <input 
                          type="text" 
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="e.g. Saffron Kaju Katli"
                          className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-brand-gold/85 font-semibold">Menu Classification Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold select-dark"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="sweets">Traditional Sweets (Mithai)</option>
                          <option value="namkeen">Savory Snacks (Namkeen)</option>
                          <option value="hampers">Gift Hampers</option>
                          <option value="party">Celebration Accessories & Cakes</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-brand-gold/85 font-semibold">Image Asset Path / URL</label>
                        <input 
                          type="text" 
                          required
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          placeholder="assets/images/kaju_katli.jpg"
                          className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-brand-gold/85 font-semibold">Shelf Life Info</label>
                        <input 
                          type="text" 
                          value={productForm.shelfLife}
                          onChange={(e) => setProductForm({ ...productForm, shelfLife: e.target.value })}
                          placeholder="e.g. 15 days in airtight box"
                          className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-brand-gold/85 font-semibold">Sweets Description</label>
                        <textarea 
                          rows="3"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Explain taste, aroma, slow-cooking process..."
                          className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-brand-gold/85 font-semibold">Ingredients List (Comma-separated)</label>
                        <input 
                          type="text" 
                          value={productForm.ingredients}
                          onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                          placeholder="e.g. Milk solids, Saffron, Sugar, Ghee"
                          className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-brand-gold/85 font-semibold">Allergens Alert (Comma-separated)</label>
                        <input 
                          type="text" 
                          value={productForm.allergens}
                          onChange={(e) => setProductForm({ ...productForm, allergens: e.target.value })}
                          placeholder="e.g. Nuts, Milk, Gluten"
                          className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="flex gap-4 pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={productForm.isFeatured}
                            onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                            className="rounded border-brand-gold/30 text-brand-maroon focus:ring-0 focus:ring-offset-0 bg-transparent"
                          />
                          <span>Featured Product</span>
                        </label>
                        
                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={productForm.isBestSeller}
                            onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                            className="rounded border-brand-gold/30 text-brand-maroon focus:ring-0 focus:ring-offset-0 bg-transparent"
                          />
                          <span>Bestseller Item</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Weight Variants Manager */}
                  <div className="border-t border-brand-gold/10 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif text-xs font-bold text-brand-gold uppercase tracking-wider">Weight & Price Variants</h4>
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        className="px-2 py-1 bg-brand-chocolate border border-brand-gold/20 text-brand-gold hover:bg-brand-maroon hover:text-brand-cream text-[10px] uppercase font-bold flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Variant</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {productForm.priceVariants.map((variant, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-center bg-brand-chocolate/30 p-3 border border-brand-gold/10 rounded">
                          <div className="col-span-4 space-y-1">
                            <label className="block text-[9px] uppercase tracking-wider text-brand-gold/80">Weight Variant</label>
                            <input 
                              type="text" 
                              required
                              value={variant.weight}
                              onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                              placeholder="e.g. 500g or Box of 12"
                              className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-1.5 focus:outline-none focus:border-brand-gold text-[11px]"
                            />
                          </div>
                          
                          <div className="col-span-3 space-y-1">
                            <label className="block text-[9px] uppercase tracking-wider text-brand-gold/80">Price (₹)</label>
                            <input 
                              type="number" 
                              required
                              value={variant.price}
                              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                              placeholder="₹"
                              className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-1.5 focus:outline-none focus:border-brand-gold text-[11px]"
                            />
                          </div>

                          <div className="col-span-3 space-y-1">
                            <label className="block text-[9px] uppercase tracking-wider text-brand-gold/80">Initial Stock</label>
                            <input 
                              type="number" 
                              required
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                              placeholder="Stock"
                              className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-1.5 focus:outline-none focus:border-brand-gold text-[11px]"
                            />
                          </div>

                          <div className="col-span-2 text-center pt-4">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(index)}
                              className="p-1.5 bg-red-950/20 hover:bg-red-800 border border-red-500/20 text-red-400 hover:text-brand-cream rounded-sm text-[10px]"
                              disabled={productForm.priceVariants.length === 1}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-brand-gold/15 text-right">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-brand-maroon hover:bg-brand-maroon/90 border border-brand-gold/25 text-brand-cream text-[10px] uppercase font-bold tracking-wider"
                    >
                      {isEditingMode ? 'Apply Updates' : 'Add to Catalog'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex justify-between items-center pb-2 border-b border-brand-gold/15">
                <h2 className="font-serif text-lg font-light text-brand-gold">Menu Categories</h2>
                <button 
                  onClick={() => alert('Feature simulated: Create category popup')}
                  className="px-3 py-1.5 bg-brand-maroon hover:bg-brand-maroon/90 text-brand-cream text-[10px] uppercase font-bold flex items-center space-x-1 border border-brand-gold/20"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="p-4 border border-brand-gold/15 bg-brand-chocolate/40 rounded flex items-center justify-between text-xs">
                    <div>
                      <strong className="font-serif text-sm text-brand-cream block">{cat.name}</strong>
                      <span className="text-[10px] text-brand-gold/80 font-mono">Category ID: {cat.id}</span>
                    </div>
                    <span className="bg-brand-maroon border border-brand-gold/25 px-2.5 py-1 rounded text-[10px] font-bold text-brand-cream">{cat.count} Products</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER LEDGER */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <h2 className="font-serif text-lg font-light text-brand-gold pb-2 border-b border-brand-gold/15">Customer Ledger</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-brand-gold/20 text-brand-gold/85 bg-brand-chocolate/40 uppercase tracking-wider text-[9px]">
                      <th className="p-3">Customer Info</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Total Orders</th>
                      <th className="p-3">Total Spending</th>
                      <th className="p-3">Last Order</th>
                      <th className="p-3">Date Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id} className="border-b border-brand-gold/10 hover:bg-brand-maroon/10">
                        <td className="p-3">
                          <strong className="text-brand-cream block">{c.name}</strong>
                          <span className="text-[10px] text-brand-cream/55">{c.email}</span>
                        </td>
                        <td className="p-3 font-mono">{c.phone}</td>
                        <td className="p-3 font-mono text-center">{c.totalOrders || 0}</td>
                        <td className="p-3 font-mono text-brand-gold font-bold">₹{c.totalSpending || 0}</td>
                        <td className="p-3 font-mono text-brand-cream/80">{c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-3 text-brand-cream/70 font-mono">{c.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <h2 className="font-serif text-lg font-light text-brand-gold pb-2 border-b border-brand-gold/15">Customer Review Moderation</h2>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-brand-cream/40 italic text-center py-10">No client reviews filed.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="border border-brand-gold/15 bg-brand-chocolate/40 p-4 rounded text-xs space-y-2">
                      <div className="flex justify-between items-center border-b border-brand-gold/10 pb-1.5">
                        <div>
                          <strong className="font-serif text-brand-cream">{rev.name}</strong>
                          <div className="flex items-center text-brand-gold space-x-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-brand-chocolate'}`} />
                            ))}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold ${rev.approved ? 'bg-green-600/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {rev.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>

                      <p className="font-sans font-light leading-relaxed text-brand-cream/80 py-2">"{rev.comment}"</p>

                      <div className="flex justify-end gap-2 pt-2 border-t border-brand-gold/10">
                        {rev.approved ? (
                          <button
                            onClick={() => handleModerateReview(rev.id, false)}
                            className="px-2.5 py-1 bg-brand-maroon/20 hover:bg-brand-maroon text-brand-cream text-[9px] uppercase font-bold border border-brand-maroon"
                          >
                            Hide Review
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModerateReview(rev.id, true)}
                            className="px-2.5 py-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-chocolate text-[9px] uppercase font-bold"
                          >
                            Approve Public
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 7: COUPONS & PROMOS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex justify-between items-center pb-2 border-b border-brand-gold/15">
                <h2 className="font-serif text-lg font-light text-brand-gold">Promo Coupons Control</h2>
                <button 
                  onClick={() => alert('Feature simulated: Create coupon popup')}
                  className="px-3 py-1.5 bg-brand-maroon hover:bg-brand-maroon/90 text-brand-cream text-[10px] uppercase font-bold flex items-center space-x-1 border border-brand-gold/20"
                >
                  <Tag className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="space-y-3">
                {coupons.map(coupon => (
                  <div key={coupon.code} className="p-4 border border-brand-gold/15 bg-brand-chocolate/40 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <strong className="text-brand-gold font-mono text-sm tracking-wider">{coupon.code}</strong>
                        <span className="bg-brand-maroon text-brand-cream text-[9px] px-1.5 py-0.5 rounded font-bold">{coupon.discount}</span>
                      </div>
                      <p className="text-brand-cream/70 font-light">{coupon.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold ${coupon.status === 'Active' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                        {coupon.status}
                      </span>
                      <button
                        onClick={() => {
                          setCoupons(coupons.map(c => c.code === coupon.code ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
                        }}
                        className="px-2.5 py-1 bg-brand-chocolate hover:bg-brand-maroon border border-brand-gold/20 text-[9px] uppercase font-bold transition-colors"
                      >
                        Toggle Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CATERING & RESERVATIONS */}
          {activeTab === 'catering' && (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              {/* Catering */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-light text-brand-gold pb-2 border-b border-brand-gold/15">B2B Event Catering Inquiries</h3>
                {catering.length === 0 ? (
                  <p className="text-xs text-brand-cream/40 italic text-center py-6">No catering inquiries filed.</p>
                ) : (
                  catering.map((cat) => (
                    <div key={cat.id} className="border border-brand-gold/15 bg-brand-chocolate/40 p-4 rounded text-xs space-y-3">
                      <div className="flex justify-between items-center border-b border-brand-gold/10 pb-2">
                        <div>
                          <strong className="font-serif text-brand-cream">{cat.name}</strong>
                          <span className="text-[10px] text-brand-cream/50 ml-2">({cat.phone})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${cat.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-600/20 text-green-400'}`}>{cat.status}</span>
                      </div>
                      
                      <div className="font-sans font-light leading-relaxed text-brand-cream/80 space-y-1">
                        <div><strong>Event Type:</strong> <span className="uppercase text-brand-gold font-bold ml-1">{cat.eventType}</span></div>
                        <div><strong>Scheduled Date:</strong> {new Date(cat.eventDate).toLocaleDateString()} | Guests Estimate: {cat.expectedGuests}</div>
                        <div><strong>Special Notes:</strong> {cat.requirements || 'None'}</div>
                      </div>

                      {cat.status === 'pending' && (
                        <div className="text-right pt-2 border-t border-brand-gold/10">
                          <button
                            onClick={async () => {
                              await api.updateCateringStatus(cat.id, 'reviewed');
                              setCatering(catering.map(c => c.id === cat.id ? { ...c, status: 'reviewed' } : c));
                            }}
                            className="px-3 py-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-chocolate text-[10px] uppercase font-bold"
                          >
                            Mark Reviewed
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Reservations */}
              <div className="space-y-4 border-t border-brand-gold/10 pt-8">
                <h3 className="font-serif text-lg font-light text-brand-gold pb-2 border-b border-brand-gold/15">Table Reservations</h3>
                {bookings.length === 0 ? (
                  <p className="text-xs text-brand-cream/40 italic text-center py-6">No reservations booked.</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((book) => (
                      <div key={book.id} className="p-3 border border-brand-gold/10 bg-brand-chocolate/40 rounded text-xs flex justify-between items-center gap-4">
                        <div>
                          <strong className="font-serif text-brand-cream">{book.name}</strong>
                          <span className="text-[10px] text-brand-cream/50 ml-2">Phone: {book.phone}</span>
                          <p className="font-sans text-[10px] text-brand-cream/70 mt-1">
                            Table for {book.guests} Persons on {new Date(book.date).toLocaleDateString()} at {book.time}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-green-400 bg-green-600/10 border border-green-500/20 px-2.5 py-0.5 rounded">
                          {book.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <form 
              onSubmit={(e) => { e.preventDefault(); toast('Console settings saved successfully!'); }}
              className="space-y-6 animate-[fadeIn_0.3s_ease-out] text-xs text-brand-cream"
            >
              <h2 className="font-serif text-lg font-light text-brand-gold pb-2 border-b border-brand-gold/15">Console Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-brand-gold/80 font-bold uppercase tracking-wider text-[10px]">Store Opening Hour</label>
                  <input 
                    type="text" 
                    value={systemSettings.storeOpenTime}
                    onChange={(e) => setSystemSettings({...systemSettings, storeOpenTime: e.target.value})}
                    className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-brand-gold/80 font-bold uppercase tracking-wider text-[10px]">Store Closing Hour</label>
                  <input 
                    type="text" 
                    value={systemSettings.storeCloseTime}
                    onChange={(e) => setSystemSettings({...systemSettings, storeCloseTime: e.target.value})}
                    className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-brand-gold/80 font-bold uppercase tracking-wider text-[10px]">Minimum Advance Percentage</label>
                  <input 
                    type="text" 
                    value={systemSettings.advanceMinimumPercent}
                    onChange={(e) => setSystemSettings({...systemSettings, advanceMinimumPercent: e.target.value})}
                    className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-brand-gold/80 font-bold uppercase tracking-wider text-[10px]">Support Helpline Number</label>
                  <input 
                    type="text" 
                    value={systemSettings.supportPhone}
                    onChange={(e) => setSystemSettings({...systemSettings, supportPhone: e.target.value})}
                    className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-brand-gold/80 font-bold uppercase tracking-wider text-[10px]">Auto Approve Incoming Orders</label>
                <select
                  value={systemSettings.autoApproveOrders ? 'yes' : 'no'}
                  onChange={(e) => setSystemSettings({...systemSettings, autoApproveOrders: e.target.value === 'yes'})}
                  className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold select-dark"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="yes">Enabled (Auto-accept new bookings)</option>
                  <option value="no">Disabled (Manual confirmation required)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-brand-gold/80 font-bold uppercase tracking-wider text-[10px]">Store Announcement Text (Ticker)</label>
                <textarea 
                  rows="3"
                  value={systemSettings.announcementText}
                  onChange={(e) => setSystemSettings({...systemSettings, announcementText: e.target.value})}
                  className="w-full bg-brand-chocolate/40 border border-brand-gold/25 p-2.5 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-maroon hover:bg-brand-maroon/90 text-brand-cream border border-brand-gold/25 uppercase font-bold tracking-wider text-[10px]"
              >
                Save Settings
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
