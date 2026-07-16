import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environmental variables
dotenv.config();

// Controllers
import * as authController from './controllers/authController.js';
import * as shopController from './controllers/shopController.js';
import * as orderController from './controllers/orderController.js';
import * as adminController from './controllers/adminController.js';

// Middlewares
import { verifyToken, optionalToken, isAdmin } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());

// Set up Static folders
// If the frontend has been compiled, we serve it
const frontendDistPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDistPath));

// API Routes

// 1. Authentication
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/otp/request', authController.requestOTP);
app.post('/api/auth/otp/verify', authController.verifyOTP);

// 2. Shop & Menu Catalog
app.get('/api/products', shopController.getProducts);
app.get('/api/products/:id', shopController.getProductById);
app.post('/api/bookings', shopController.createBooking);
app.post('/api/catering', shopController.createCateringInquiry);
app.post('/api/reviews', shopController.submitReview);
app.get('/api/reviews', shopController.getReviews);

// 3. Orders & Tracking
app.post('/api/orders', optionalToken, orderController.createOrder);
app.get('/api/orders/:id', verifyToken, orderController.getOrderById);
app.get('/api/orders/:id/track', orderController.trackOrder);
app.get('/api/orders/:id/invoice', orderController.downloadInvoice);

// 4. Admin Management Dashboard
app.get('/api/admin/stats', verifyToken, isAdmin, adminController.getDashboardStats);
app.get('/api/admin/orders', verifyToken, isAdmin, adminController.getOrders);
app.post('/api/admin/orders/status', verifyToken, isAdmin, adminController.updateOrderStatus);
app.post('/api/admin/products/stock', verifyToken, isAdmin, adminController.updateProductStock);
app.post('/api/admin/products/create', verifyToken, isAdmin, adminController.createProduct);
app.post('/api/admin/products/edit', verifyToken, isAdmin, adminController.editProduct);
app.post('/api/admin/products/delete', verifyToken, isAdmin, adminController.deleteProduct);
app.get('/api/admin/customers', verifyToken, isAdmin, adminController.getCustomersList);
app.get('/api/admin/catering', verifyToken, isAdmin, adminController.getCateringInquiries);
app.post('/api/admin/catering/status', verifyToken, isAdmin, adminController.updateCateringStatus);
app.get('/api/admin/bookings', verifyToken, isAdmin, adminController.getBookings);
app.get('/api/admin/reviews', verifyToken, isAdmin, adminController.getReviewsModerationList);
app.post('/api/admin/reviews/moderate', verifyToken, isAdmin, adminController.moderateReview);

// Catch-all route to serve the SPA index.html in production
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('New Jodhpur Sweet Home Mandawa API is running. Client build not detected yet.');
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n=======================================================\n[SERVER START] Running on http://localhost:${PORT}\n=======================================================\n`);
});
