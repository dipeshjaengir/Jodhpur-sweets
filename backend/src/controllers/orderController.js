import { readDB, writeDB, readProducts, writeProducts } from '../utils/db.js';

export const createOrder = async (req, res) => {
  try {
    const { items, pickupDate, pickupTime, pickupNotes, advancePayment, contactInfo, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0 || !pickupDate || !pickupTime || !contactInfo) {
      return res.status(400).json({ message: 'Order items, pickup details, and contact info are required' });
    }

    const db = readDB();
    const products = readProducts();

    let subtotal = 0;
    const orderItems = [];

    // Process and validate items
    for (const item of items) {
      if (item.isCustomBox) {
        subtotal += item.price * item.quantity;
        orderItems.push({
          id: 'custom-box-' + Date.now(),
          name: `Royal Custom Gift Box (${item.weight})`,
          weight: item.weight,
          price: item.price,
          quantity: item.quantity,
          contents: item.contents,
          isCustomBox: true
        });
        continue;
      }

      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }

      const variant = product.priceVariants.find(v => v.weight === item.weight);
      if (!variant) {
        return res.status(400).json({ message: `Weight variant ${item.weight} not found for ${product.name}` });
      }

      // Check and update stock
      if (variant.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name} (${item.weight}). Available: ${variant.stock}` });
      }

      variant.stock -= item.quantity;
      subtotal += variant.price * item.quantity;
      
      orderItems.push({
        id: product.id,
        name: product.name,
        weight: variant.weight,
        price: variant.price,
        quantity: item.quantity,
        isCustomBox: false
      });
    }

    // Save updated stock
    writeProducts(products);

    // Apply Coupon
    let discount = 0;
    if (couponCode) {
      const codeUpper = couponCode.toUpperCase();
      if (codeUpper === 'ROYAL10') {
        discount = subtotal * 0.1;
      } else if (codeUpper === 'MANDAWA20') {
        discount = subtotal * 0.2;
      }
    }

    const total = subtotal - discount;
    const advance = parseFloat(advancePayment) || 0;
    const remaining = total - advance;

    // Generate consecutive Order & Invoice IDs
    const year = new Date().getFullYear();
    const orderIndex = String((db.orders || []).length + 1).padStart(4, '0');
    const orderNum = `NJSH-${year}-${orderIndex}`;
    const invoiceNum = `INV-${year}-${orderIndex}`;

    const newOrder = {
      id: orderNum,
      invoiceNumber: invoiceNum,
      userId: req.user ? req.user.id : 'guest',
      items: orderItems,
      subtotal,
      discount,
      shippingCharge: 0,
      total,
      pickupDate,
      pickupTime,
      pickupNotes: pickupNotes || '',
      advancePayment: advance,
      remainingAmount: remaining,
      contactInfo,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      status: 'placed',
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);
    writeDB(db);

    console.log(`\n=========================================\n[ORDER BOOKING] New Order Logged: ${newOrder.id}\nTotal: ₹${total} | Advance: ₹${advance} | Balance: ₹${remaining}\nPickup: ${pickupDate} @ ${pickupTime}\n=========================================\n`);

    res.status(201).json({
      message: 'Order booking logged successfully',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing order booking', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const db = readDB();
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const db = readDB();
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const elapsedMinutes = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
    
    let currentStatus = order.status;
    if (order.status !== 'canceled' && order.status !== 'rejected' && order.status !== 'completed' && order.status !== 'ready-for-pickup') {
      if (elapsedMinutes >= 5) {
        currentStatus = 'ready-for-pickup';
      } else if (elapsedMinutes >= 2) {
        currentStatus = 'preparing';
      } else if (elapsedMinutes >= 1) {
        currentStatus = 'accepted';
      }

      if (currentStatus !== order.status) {
        order.status = currentStatus;
        writeDB(db);
      }
    }

    res.status(200).json({
      orderId: order.id,
      status: order.status,
      elapsedMinutes: Math.round(elapsedMinutes * 10) / 10,
      createdAt: order.createdAt,
      pickupDate: order.pickupDate,
      pickupTime: order.pickupTime,
      stages: [
        { key: 'placed', label: 'Order Booked', completed: true, timestamp: order.createdAt },
        { key: 'accepted', label: 'Accepted by Kitchen', completed: ['accepted', 'preparing', 'ready-for-pickup', 'completed'].includes(order.status), timestamp: order.createdAt },
        { key: 'preparing', label: 'Preparing', completed: ['preparing', 'ready-for-pickup', 'completed'].includes(order.status), timestamp: order.createdAt },
        { key: 'ready-for-pickup', label: 'Ready for Pickup', completed: ['ready-for-pickup', 'completed'].includes(order.status), timestamp: order.createdAt },
        { key: 'completed', label: 'Completed / Picked Up', completed: order.status === 'completed', timestamp: order.createdAt }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking order status', error: error.message });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const db = readDB();
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).send('<h1>Order not found</h1>');
    }

    const itemsHTML = (order.items || []).map(item => `
      <tr class="item">
        <td>${item.name} ${item.isCustomBox ? `(${item.contents?.map(c => `${c.name} x${c.qty}`).join(', ') || ''})` : `[${item.weight}]`}</td>
        <td style="text-align: right;">₹${item.price}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const balanceDue = order.total - (order.advancePayment || 0);

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${order.invoiceNumber || order.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2B1810; background-color: #FBF7F1; margin: 0; padding: 20px; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #E9DFCC; background: #FFF; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); }
          .header { border-bottom: 2px solid #5C1A24; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .logo { color: #5C1A24; font-size: 24px; font-weight: bold; font-family: Georgia, serif; }
          .title { font-size: 28px; color: #5C1A24; font-family: Georgia, serif; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .info-table td { padding: 5px; font-size: 14px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th { background: #5C1A24; color: #FFF; text-align: left; padding: 10px; font-size: 14px; }
          .items-table td { padding: 12px 10px; border-bottom: 1px solid #E9DFCC; font-size: 14px; }
          .items-table tr.item:last-child td { border-bottom: 2px solid #5C1A24; }
          .totals-table { width: 45%; margin-left: auto; border-collapse: collapse; }
          .totals-table td { padding: 8px 5px; font-size: 14px; }
          .totals-table .grand-total { font-weight: bold; color: #5C1A24; font-size: 18px; border-top: 2px solid #5C1A24; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #777; border-top: 1px solid #E9DFCC; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="logo">New Jodhpur Sweet Home</div>
              <div style="font-size: 12px; color: #777;">Mandawa, Rajasthan, India</div>
            </div>
            <div class="title">INVOICE</div>
          </div>
          
          <table class="info-table">
            <tr>
              <td style="width: 50%; vertical-align: top;">
                <strong>Customer Details:</strong><br>
                ${order.contactInfo?.name || 'Guest'}<br>
                Phone: ${order.contactInfo?.phone || 'N/A'}<br>
                Email: ${order.contactInfo?.email || 'N/A'}
              </td>
              <td style="text-align: right; vertical-align: top;">
                <strong>Order Number:</strong> ${order.id}<br>
                <strong>Invoice Number:</strong> ${order.invoiceNumber || 'INV-TEMP'}<br>
                <strong>Date Booked:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
                <strong>Scheduled Pickup:</strong> ${order.pickupDate} @ ${order.pickupTime}<br>
                <strong>Payment Method:</strong> ${order.paymentMethod}<br>
                <strong>Status:</strong> ${order.status.toUpperCase()}
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item Details</th>
                <th style="text-align: right; width: 15%;">Price</th>
                <th style="text-align: center; width: 10%;">Qty</th>
                <th style="text-align: right; width: 15%;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right;">₹${order.subtotal}</td>
            </tr>
            <tr>
              <td>Discount:</td>
              <td style="text-align: right; color: green;">-₹${order.discount}</td>
            </tr>
            <tr class="grand-total">
              <td>Total Price:</td>
              <td style="text-align: right;">₹${order.total}</td>
            </tr>
            <tr>
              <td>Advance Deposit:</td>
              <td style="text-align: right; color: green;">₹${order.advancePayment || 0}</td>
            </tr>
            <tr style="font-weight: bold; border-top: 2px solid #5C1A24;">
              <td>Balance Due at Pickup:</td>
              <td style="text-align: right; color: #5C1A24;">₹${balanceDue}</td>
            </tr>
          </table>

          <div class="footer">
            Thank you for ordering with New Jodhpur Sweet Home Mandawa.<br>
            Please collect your fresh sweets at our pickup counter.
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.invoiceNumber || order.id}.html`);
    res.send(invoiceHTML);
  } catch (error) {
    res.status(500).send('<h1>Server error generating invoice</h1>');
  }
};
