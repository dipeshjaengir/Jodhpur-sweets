import { readDB, writeDB, readProducts, writeProducts } from '../utils/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const db = readDB();
    const products = readProducts();

    const orders = db.orders;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' || o.paymentMethod === 'COD' ? o.total : 0), 0);
    const pendingCatering = db.catering.filter(c => c.status === 'pending').length;
    const activeBookings = db.bookings.filter(b => b.status === 'confirmed').length;

    // Calculate sales breakdown by category
    const salesByCategory = { sweets: 0, namkeen: 0, hampers: 0, custom: 0 };
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.isCustomBox) {
          salesByCategory.custom += item.price * item.quantity;
        } else {
          const product = products.find(p => p.id === item.id);
          if (product) {
            salesByCategory[product.category] = (salesByCategory[product.category] || 0) + (item.price * item.quantity);
          }
        }
      });
    });

    // Create an inventory alert list
    const lowStockAlerts = [];
    products.forEach(product => {
      product.priceVariants.forEach(v => {
        if (v.stock < 15) {
          lowStockAlerts.push({
            id: product.id,
            name: product.name,
            weight: v.weight,
            stock: v.stock
          });
        }
      });
    });

    res.status(200).json({
      metrics: {
        totalRevenue,
        totalOrders,
        pendingCatering,
        activeBookings
      },
      salesByCategory,
      lowStockAlerts,
      recentOrders: orders.slice(-5).reverse()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error compiling dashboard statistics', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const db = readDB();
    res.status(200).json(db.orders.slice().reverse());
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders list', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, paymentStatus } = req.body;
    if (!orderId || (!status && !paymentStatus)) {
      return res.status(400).json({ message: 'Order ID and either status or paymentStatus are required' });
    }

    const db = readDB();
    const order = db.orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    writeDB(db);

    res.status(200).json({
      message: 'Order updated successfully by administrator',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

export const updateProductStock = async (req, res) => {
  try {
    const { productId, weight, newStock } = req.body;
    if (!productId || !weight || newStock === undefined) {
      return res.status(400).json({ message: 'productId, weight variant, and newStock count are required' });
    }

    const products = readProducts();
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const variant = product.priceVariants.find(v => v.weight === weight);
    if (!variant) {
      return res.status(404).json({ message: `Weight variant ${weight} not found for product` });
    }

    variant.stock = parseInt(newStock);
    writeProducts(products);

    res.status(200).json({
      message: `Stock updated for ${product.name} (${weight})`,
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock levels', error: error.message });
  }
};

export const getCateringInquiries = async (req, res) => {
  try {
    const db = readDB();
    res.status(200).json(db.catering.slice().reverse());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching catering list', error: error.message });
  }
};

export const updateCateringStatus = async (req, res) => {
  try {
    const { inquiryId, status } = req.body;
    const db = readDB();
    const inquiry = db.catering.find(c => c.id === inquiryId);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    inquiry.status = status;
    writeDB(db);
    res.status(200).json({ message: 'Catering status updated', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error updating catering status', error: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const db = readDB();
    res.status(200).json(db.bookings.slice().reverse());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings list', error: error.message });
  }
};

export const getReviewsModerationList = async (req, res) => {
  try {
    const db = readDB();
    res.status(200).json(db.reviews.slice().reverse());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review moderation queue', error: error.message });
  }
};

export const moderateReview = async (req, res) => {
  try {
    const { reviewId, approved } = req.body;
    if (!reviewId || approved === undefined) {
      return res.status(400).json({ message: 'reviewId and approved boolean are required' });
    }

    const db = readDB();
    const review = db.reviews.find(r => r.id === reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.approved = approved;
    writeDB(db);

    res.status(200).json({
      message: approved ? 'Review approved for public display' : 'Review hidden from public view',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Error moderating review', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const products = readProducts();
    const newProduct = {
      id: req.body.id || 'prod-' + Date.now(),
      rating: 5.0,
      reviewCount: 0,
      ...req.body
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.body.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    products[productIndex] = { ...products[productIndex], ...req.body };
    writeProducts(products);
    res.status(200).json({ message: 'Product updated successfully', product: products[productIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Error editing product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const products = readProducts();
    const { productId } = req.body;
    const filtered = products.filter(p => p.id !== productId);
    writeProducts(filtered);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

export const getCustomersList = async (req, res) => {
  try {
    const db = readDB();
    const users = db.users || [];
    const orders = db.orders || [];

    const customers = users.map(user => {
      const userOrders = orders.filter(o => o.userId === user.id);
      const totalSpending = userOrders.reduce((sum, o) => sum + o.total, 0);
      const lastOrder = userOrders.length > 0 ? userOrders[userOrders.length - 1].createdAt : 'N/A';
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        joined: user.joined || '2026-07-01',
        totalOrders: userOrders.length,
        totalSpending,
        lastOrder,
        status: 'Active'
      };
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving customer list', error: error.message });
  }
};

