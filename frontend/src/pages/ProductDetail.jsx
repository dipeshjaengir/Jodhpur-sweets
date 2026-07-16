import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Plus, Minus, ShieldCheck, Truck, RefreshCw, AlertTriangle } from 'lucide-react';
import { api } from '../utils/api.js';
import { useCart } from '../context/CartContext.jsx';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlistItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Custom reviews list specific to the product
  const [reviews, setReviews] = useState([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const prodData = await api.getProductById(id);
        setProduct(prodData);
        setSelectedVariant(prodData.priceVariants[0]);
        setQuantity(1);

        // Fetch related products (items in same category)
        const allProds = await api.getProducts();
        setRelatedProducts(allProds.filter(p => p.category === prodData.category && p.id !== prodData.id).slice(0, 3));
        
        // Fetch reviews
        const allReviews = await api.getReviews();
        setReviews(allReviews.filter(r => r.productId === id || r.approved));
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-40 bg-brand-cream min-h-screen">
        <div className="w-10 h-10 border-2 border-brand-gold border-t-brand-maroon rounded-full animate-spin mx-auto mb-4" />
        <span className="text-xs text-brand-chocolate/50 uppercase tracking-widest">Opening royal recipe book...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-40 bg-brand-cream min-h-screen">
        <h2 className="font-serif text-2xl text-brand-chocolate font-light">Product not found</h2>
        <Link to="/collection/sweets" className="mt-4 inline-block text-xs uppercase tracking-luxury bg-brand-maroon text-brand-cream px-6 py-2.5">Back to sweets</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedVariant.weight, selectedVariant.price, quantity);
    alert(`${product.name} (${selectedVariant.weight}) added to your basket!`);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant.weight, selectedVariant.price, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) return;

    try {
      const response = await api.submitReview({
        name: newReviewName,
        rating: newReviewRating,
        comment: newReviewComment,
        productId: product.id
      });
      setReviewMessage(response.message);
      setNewReviewName('');
      setNewReviewComment('');
      setNewReviewRating(5);
    } catch (err) {
      alert('Error submitting review');
    }
  };

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  return (
    <div className="bg-brand-cream pb-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Main Product Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-brand-beige p-6 md:p-10 rounded-sm">
          
          {/* LHS: Image zoom container */}
          <div className="lg:col-span-6 relative aspect-square bg-brand-warm/10 overflow-hidden border border-brand-beige">
            <img 
              src={`/${product.image}`}
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-brand-maroon text-brand-cream border border-brand-gold/20 text-[10px] font-semibold uppercase tracking-wider px-3 py-1">
                House Special
              </span>
            )}
          </div>

          {/* RHS: Buy Details */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] text-brand-gold font-bold uppercase tracking-luxury block">{product.category} collection</span>
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-brand-chocolate font-light">{product.name}</h1>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-brand-gold">
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <span className="text-xs font-semibold text-brand-chocolate/80 ml-1">{product.rating}</span>
                </div>
                <span className="text-brand-chocolate/30 text-xs">|</span>
                <span className="text-xs text-brand-chocolate/65 font-light">{product.reviewCount} customer reviews</span>
              </div>

              <div className="gold-line" />
              
              <p className="font-sans text-xs text-brand-chocolate/75 leading-relaxed">
                {product.description}
              </p>

              {/* Weight selection */}
              <div className="space-y-3">
                <span className="font-serif text-xs font-semibold text-brand-chocolate block">Select Weight / Portion Size:</span>
                <div className="flex flex-wrap gap-3">
                  {product.priceVariants.map((v) => (
                    <button
                      key={v.weight}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 border transition-all text-xs font-semibold ${
                        selectedVariant?.weight === v.weight
                          ? 'border-brand-maroon bg-brand-maroon text-brand-cream'
                          : 'border-brand-beige hover:border-brand-chocolate text-brand-chocolate bg-white'
                      }`}
                    >
                      {v.weight} - ₹{v.price}
                    </button>
                  ))}
                </div>
                {selectedVariant && (
                  <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider block mt-1">
                    Stock status: {selectedVariant.stock > 0 ? `${selectedVariant.stock} boxes available` : 'Out of stock'}
                  </span>
                )}
              </div>

              {/* Quantity selectors */}
              <div className="flex items-center space-x-4 pt-3">
                <span className="font-serif text-xs font-semibold text-brand-chocolate">Quantity:</span>
                <div className="flex items-center border border-brand-beige bg-white">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-brand-chocolate hover:bg-brand-beige/25"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1.5 text-xs font-semibold select-none">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-1.5 text-brand-chocolate hover:bg-brand-beige/25"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Buying Action CTAs */}
            <div className="space-y-4 pt-4 border-t border-brand-beige/50">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="flex-1 py-3.5 border border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Basket</span>
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="flex-1 py-3.5 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors border border-brand-maroon"
                >
                  Buy It Now
                </button>

                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 border transition-colors ${
                    isWishlisted 
                      ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100' 
                      : 'border-brand-beige hover:border-brand-chocolate text-brand-chocolate/60'
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Security indicators */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-brand-chocolate/65 pt-2 border-t border-brand-beige/30 font-sans font-light">
                <div className="flex flex-col items-center space-y-1">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  <span>100% Ghee Cooked</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Truck className="w-4 h-4 text-brand-gold" />
                  <span>Express Fresh Ship</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <RefreshCw className="w-4 h-4 text-brand-gold" />
                  <span>Hygiene Certified</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Spec Details Section */}
        <div className="mt-12 bg-white border border-brand-beige rounded-sm">
          <div className="flex border-b border-brand-beige text-xs uppercase font-semibold tracking-wider text-brand-chocolate/60">
            <button 
              onClick={() => setActiveTab('details')}
              className={`px-6 py-4 border-r border-brand-beige transition-colors ${activeTab === 'details' ? 'bg-brand-warm/20 text-brand-maroon font-bold' : 'hover:bg-brand-warm/10'}`}
            >
              Recipe Details
            </button>
            <button 
              onClick={() => setActiveTab('nutrition')}
              className={`px-6 py-4 border-r border-brand-beige transition-colors ${activeTab === 'nutrition' ? 'bg-brand-warm/20 text-brand-maroon font-bold' : 'hover:bg-brand-warm/10'}`}
            >
              Nutritional Facts
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-4 transition-colors ${activeTab === 'shipping' ? 'bg-brand-warm/20 text-brand-maroon font-bold' : 'hover:bg-brand-warm/10'}`}
            >
              Shelf Life & Shipping
            </button>
          </div>

          <div className="p-6 md:p-8 text-xs text-brand-chocolate/75 leading-relaxed space-y-4">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <strong className="text-brand-chocolate block mb-1 text-sm font-serif">Ingredients List:</strong>
                  <p className="font-sans font-light">{product.ingredients.join(', ')}</p>
                </div>
                <div className="bg-red-50 border border-red-200/50 p-3 rounded text-red-800 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[10px] uppercase font-bold">Allergen Information:</strong>
                    <span className="font-sans font-light">Contains: {product.allergens.join(', ')}. Manufactured in a facility that processes nuts, dairy, and wheat products.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="max-w-xs space-y-2.5 font-sans">
                <h4 className="font-serif text-sm font-semibold text-brand-chocolate mb-2">Nutritional Information (Per 100g Approx.)</h4>
                <div className="flex justify-between pb-1.5 border-b border-brand-beige/50">
                  <span>Energy Value</span>
                  <strong>{product.nutritionalInfo.calories}</strong>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-brand-beige/50">
                  <span>Protein</span>
                  <strong>{product.nutritionalInfo.protein}</strong>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-brand-beige/50">
                  <span>Carbohydrates</span>
                  <strong>{product.nutritionalInfo.carbohydrates}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Fats (Desi Ghee Base)</span>
                  <strong>{product.nutritionalInfo.fat}</strong>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 font-sans font-light">
                <p>
                  <strong>Shelf Life:</strong> {product.shelfLife}
                </p>
                <p>
                  <strong>Storage Instructions:</strong> Do not expose to direct heat. Keep inside airtight containers to preserve visual shine and freshness.
                </p>
                <p>
                  <strong>Shipping Terms:</strong> Dispatched from Mandawa within 24 hours of baking. Delivered in safety shrink-wrapped royal packaging.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 bg-white border border-brand-beige p-6 md:p-8 rounded-sm">
          <h2 className="font-serif text-xl md:text-2xl text-brand-chocolate font-light mb-6">Delicacy Reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Reviews display list */}
            <div className="lg:col-span-8 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-brand-chocolate/50 italic py-4">Be the first to leave a review for this royal sweet.</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 border-b border-brand-beige/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="font-serif text-xs text-brand-chocolate">{rev.name}</strong>
                      <div className="flex items-center text-brand-gold space-x-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-brand-beige'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="font-sans font-light text-xs text-brand-chocolate/75 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-brand-chocolate/30 block mt-1">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>

            {/* Write a review form */}
            <div className="lg:col-span-4 bg-brand-warm/25 border border-brand-beige p-5 rounded-sm">
              <h3 className="font-serif text-sm font-semibold text-brand-chocolate mb-4">Write a Review</h3>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-medium">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="e.g. Aditi Rathore"
                    className="w-full bg-white border border-brand-beige p-2 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-medium">Rating Score</label>
                  <select 
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                    className="w-full bg-white border border-brand-beige p-2 text-xs focus:outline-none focus:border-brand-gold"
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                    <option value="2">2 Stars (Poor)</option>
                    <option value="1">1 Star (Terrible)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-medium">Review Comment</label>
                  <textarea 
                    required 
                    rows="3"
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Describe your taste experience..."
                    className="w-full bg-white border border-brand-beige p-2 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-brand-chocolate text-brand-cream hover:bg-brand-maroon text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Submit Review
                </button>
              </form>

              {reviewMessage && (
                <div className="mt-4 p-2.5 bg-green-50 border border-green-200 text-green-800 text-[10px] rounded text-center font-medium">
                  {reviewMessage}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* You may also like list */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-brand-beige pt-12">
            <h2 className="font-serif text-xl md:text-2xl text-brand-chocolate font-light text-center mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id} className="bg-white border border-brand-beige hover:border-brand-gold/40 transition-all p-4 text-center group">
                  <Link to={`/product/${p.id}`} className="block relative overflow-hidden aspect-square mb-4">
                    <img src={`/${p.image}`} alt={p.name} className="w-full h-full object-cover transform group-hover:scale-102 transition-transform" />
                  </Link>
                  <h3 className="font-serif text-sm font-semibold text-brand-chocolate hover:text-brand-maroon">
                    <Link to={`/product/${p.id}`}>{p.name}</Link>
                  </h3>
                  <span className="text-xs text-brand-maroon font-semibold block mt-1.5">₹{p.priceVariants[0].price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default ProductDetail;
