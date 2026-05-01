const express = require('express');
const router = express.Router();

const donations = [];

// POST /api/donations/record
router.post('/record', (req, res) => {
  const { type, amount, paymentId, donorName, donorEmail } = req.body;
  const donation = {
    id: `don_${Date.now()}`,
    type, amount, paymentId,
    donorName, donorEmail,
    createdAt: new Date().toISOString(),
    status: 'completed'
  };
  donations.push(donation);
  res.json({ success: true, donation, receiptId: `RCP-HH-${Date.now()}` });
});


// CREATE donation
router.post("/", async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();

    res.status(201).json({
      success: true,
      message: "Donation saved successfully",
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET all donations
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post("/record", async (req, res) => {
  try {
    console.log(req.body);

    res.json({
      success: true,
      message: "Donation saved"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

