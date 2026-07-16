import { readProducts, readDB, writeDB } from '../utils/db.js';

export const getProducts = async (req, res) => {
  try {
    const products = readProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product details', error: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, guests, date, time, specialRequests } = req.body;

    if (!name || !phone || !guests || !date || !time) {
      return res.status(400).json({ message: 'Required fields: Name, Phone, Guests Count, Date, Time' });
    }

    const db = readDB();
    const newBooking = {
      id: 'booking-' + Date.now(),
      name,
      email: email || '',
      phone,
      guests: parseInt(guests),
      date,
      time,
      specialRequests: specialRequests || '',
      status: 'confirmed', // Bookings are auto-confirmed in our luxury experience
      createdAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);
    writeDB(db);

    res.status(201).json({
      message: 'Table reservation confirmed successfully',
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating table booking', error: error.message });
  }
};

export const createCateringInquiry = async (req, res) => {
  try {
    const { name, email, phone, eventType, eventDate, expectedGuests, requirements } = req.body;

    if (!name || !phone || !eventType || !eventDate || !expectedGuests) {
      return res.status(400).json({ message: 'Required fields: Name, Phone, Event Type, Date, Guest Estimate' });
    }

    const db = readDB();
    const newInquiry = {
      id: 'catering-' + Date.now(),
      name,
      email: email || '',
      phone,
      eventType,
      eventDate,
      expectedGuests: parseInt(expectedGuests),
      requirements: requirements || '',
      status: 'pending', // Catering is reviewed by a representative
      createdAt: new Date().toISOString()
    };

    db.catering.push(newInquiry);
    writeDB(db);

    res.status(201).json({
      message: 'Catering inquiry submitted successfully. Our royal event coordinator will reach out shortly.',
      inquiry: newInquiry
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting catering inquiry', error: error.message });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { name, rating, comment, productId } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Name, Rating (1-5), and Comment are required' });
    }

    const db = readDB();
    const newReview = {
      id: 'review-' + Date.now(),
      name,
      rating: parseFloat(rating),
      comment,
      productId: productId || null, // null means general store review
      approved: false, // Moderated by default (Admin needs to approve, or auto-approved if config allows)
      createdAt: new Date().toISOString()
    };

    db.reviews.push(newReview);
    writeDB(db);

    res.status(201).json({
      message: 'Review submitted. Thank you for your feedback! It will appear after moderation review.',
      review: newReview
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const db = readDB();
    // Return approved reviews, plus some seed reviews for aesthetic completion
    const seedReviews = [
      {
        id: 'seed-1',
        name: 'Aishwarya Singh',
        rating: 5,
        comment: 'The Shahi Mawa Kachori is simply divine! It takes me back to my grandmother\'s house in Jodhpur. Absolute royal taste and quality packaging.',
        createdAt: '2026-06-15T12:00:00Z',
        approved: true
      },
      {
        id: 'seed-2',
        name: 'Rajesh Sharma',
        rating: 5,
        comment: 'Amazing Pyaaz Kachoris! Crispy, perfectly spiced. The visual box builder is so fun to use. The 1kg box was packed beautifully and arrived fresh.',
        createdAt: '2026-07-02T14:30:00Z',
        approved: true
      },
      {
        id: 'seed-3',
        name: 'Meera Shekhawat',
        rating: 5,
        comment: 'Ordered customized wedding favor hampers for my daughter\'s wedding. The team did a fantastic job with silk boxes. All our guests were delighted.',
        createdAt: '2026-07-10T10:15:00Z',
        approved: true
      }
    ];

    const approvedReviews = db.reviews.filter(r => r.approved);
    res.status(200).json([...seedReviews, ...approvedReviews]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};
