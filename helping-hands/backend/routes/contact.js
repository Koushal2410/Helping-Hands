const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post('/send', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('message').trim().isLength({ min: 10 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { name, email, subject, message } = req.body;
  console.log(`📧 Contact from ${name} (${email}): ${subject}`);
  res.json({ success: true, message: `Thank you ${name}! We'll respond within 24 hours.` });
});

module.exports = router;
