import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../utils/toast.js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Hydrate cart and wishlist on load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
  }, []);

  // Save changes to localstorage
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const saveWishlist = (items) => {
    setWishlistItems(items);
    localStorage.setItem('wishlist', JSON.stringify(items));
  };

  const addToCart = (product, weight, price, quantity = 1, isCustomBox = false, contents = []) => {
    const newCart = [...cartItems];
    const name = isCustomBox ? `Royal Custom Gift Box (${weight})` : product.name;
    
    const uniqueKey = isCustomBox 
      ? `custom-box-${weight}-${Date.now()}`
      : `${product.id}-${weight}`;

    const existingIndex = newCart.findIndex(item => 
      isCustomBox ? false : `${item.productId}-${item.weight}` === uniqueKey
    );

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        cartId: uniqueKey,
        productId: isCustomBox ? null : product.id,
        name,
        image: isCustomBox ? 'assets/images/gift_box.jpg' : product.image,
        weight,
        price,
        quantity,
        isCustomBox,
        contents
      });
    }

    saveCart(newCart);
    toast(`${name} added to basket!`);
  };

  const removeFromCart = (cartId) => {
    const item = cartItems.find(i => i.cartId === cartId);
    const updated = cartItems.filter(i => i.cartId !== cartId);
    saveCart(updated);
    if (item) {
      toast(`${item.name} removed from basket.`);
    }
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    const updated = cartItems.map(item => 
      item.cartId === cartId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon(null);
    setCouponError('');
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.some(item => item.id === product.id);
    let updated;
    if (exists) {
      updated = wishlistItems.filter(item => item.id !== product.id);
      toast(`${product.name} removed from wishlist.`);
    } else {
      updated = [...wishlistItems, product];
      toast(`${product.name} added to wishlist!`);
    }
    saveWishlist(updated);
  };

  const applyCoupon = (code) => {
    if (!code) {
      setCoupon(null);
      setCouponError('');
      return false;
    }

    if (code.toUpperCase() === 'ROYAL10') {
      setCoupon({ code: 'ROYAL10', discountPercent: 10 });
      setCouponError('');
      toast('Promo code ROYAL10 applied! (10% Off)');
      return true;
    } else if (code.toUpperCase() === 'MANDAWA20') {
      setCoupon({ code: 'MANDAWA20', discountPercent: 20 });
      setCouponError('');
      toast('Promo code MANDAWA20 applied! (20% Off)');
      return true;
    } else {
      setCouponError('Invalid Coupon Code');
      setCoupon(null);
      toast('Invalid promo code.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
    toast('Coupon code removed.');
  };

  const getTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = coupon ? subtotal * (coupon.discountPercent / 100) : 0;
    const shippingCharge = 0; // Store pickup only (no shipping charges)
    const total = subtotal - discount;

    return {
      subtotal,
      discount,
      shippingCharge,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      wishlistItems,
      coupon,
      couponError,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      applyCoupon,
      removeCoupon,
      getTotals
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
