const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// In-memory store (replace with MongoDB in production)
const volunteers = [];

// POST /api/volunteers/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian phone required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('availability').isIn(['weekdays', 'weekends', 'both', 'flexible']).withMessage('Invalid availability'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, phone, location, availability, skills, message } = req.body;

  // Check duplicate email
  const exists = volunteers.find(v => v.email === email);
  if (exists) {
    return res.status(409).json({ success: false, message: 'Email already registered as volunteer' });
  }

  const volunteer = {
    id: `vol_${Date.now()}`,
    name, email, phone, location, availability,
    skills: skills || [],
    message: message || '',
    registeredAt: new Date().toISOString(),
    status: 'pending'
  };

  volunteers.push(volunteer);
  console.log(`✅ New volunteer: ${name} (${email})`);

  res.status(201).json({
    success: true,
    message: `Welcome aboard, ${name}! Your volunteer registration is received.`,
    volunteerId: volunteer.id
  });
});

// GET /api/volunteers/count
router.get('/count', (req, res) => {
  res.json({ success: true, count: volunteers.length + 891 }); // 891 = seed count
});

// GET /api/volunteers/list (admin)
router.get('/list', (req, res) => {
  res.json({ success: true, volunteers, total: volunteers.length });
});

module.exports = router;
