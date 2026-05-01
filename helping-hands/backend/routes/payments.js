const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Initialize Razorpay (lazy load to avoid crash without keys)
let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {}

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// POST /api/payments/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', donationType, donorName } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const razorpay = getRazorpay();

    // Demo mode: return mock order if no Razorpay keys
    if (!razorpay) {
      const mockOrder = {
        id: `order_demo_${Date.now()}`,
        amount: amount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
        status: 'created',
        demo: true
      };
      return res.json({ success: true, order: mockOrder, key: 'demo_key' });
    }

    const options = {
      amount: amount * 100, // paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        donationType,
        donorName,
        platform: 'HelpingHands'
      }
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Payment order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
});

// POST /api/payments/verify
router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Demo mode
    if (!process.env.RAZORPAY_KEY_SECRET || razorpay_order_id.startsWith('order_demo')) {
      return res.json({ success: true, message: 'Payment verified (demo mode)', paymentId: razorpay_payment_id || `pay_demo_${Date.now()}` });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: 'Payment verified successfully', paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'Verification error' });
  }
});

// GET /api/payments/donations-stats
router.get('/donations-stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalDonations: 2847,
      totalAmount: 1284500,
      bloodUnits: 634,
      mealsServed: 12400,
      clothesKg: 3200,
      volunteers: 891
    }
  });
});

module.exports = router;
