// ─────────────────────────────────────────────────────────────────────────────
// backend/routes/adminAuth.js
// Admin Password Reset API Routes
// ─────────────────────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();
const crypto  = require('crypto');

// ── In-memory store (replace with MongoDB in production) ──────────────────────
// Admin credentials — initially set from .env, can be reset
let adminCredentials = {
  username : process.env.ADMIN_USERNAME || 'KK',
  password : process.env.ADMIN_PASSWORD || 'Helpinghands2005',
  email    : process.env.ADMIN_EMAIL    || 'hellohelpinghands.org.in',
};

// Active reset tokens: { token -> { expiry, used } }
const resetTokens = new Map();

// Security: allow max 3 reset attempts per 15 min
const resetAttempts = new Map();  // ip -> { count, firstAttempt }

// ── HELPERS ───────────────────────────────────────────────────────────────────
const generateToken = () => crypto.randomBytes(32).toString('hex');

const isRateLimited = (ip) => {
  const now = Date.now();
  const entry = resetAttempts.get(ip);
  if (!entry) return false;
  // Reset window after 15 minutes
  if (now - entry.firstAttempt > 15 * 60 * 1000) {
    resetAttempts.delete(ip);
    return false;
  }
  return entry.count >= 3;
};

const recordAttempt = (ip) => {
  const now   = Date.now();
  const entry = resetAttempts.get(ip);
  if (!entry || now - entry.firstAttempt > 15 * 60 * 1000) {
    resetAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    entry.count++;
  }
};

// ── POST /api/admin-auth/forgot-password ─────────────────────────────────────
// Step 1: Admin enters their email → backend validates → returns token (in real
//         app this would be emailed; here we return it directly for demo)
router.post('/forgot-password', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;

  if (isRateLimited(ip)) {
    return res.status(429).json({
      success : false,
      message : 'Too many reset attempts. Please wait 15 minutes and try again.',
    });
  }

  recordAttempt(ip);

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  // Validate against registered admin email
  if (email.toLowerCase() !== adminCredentials.email.toLowerCase()) {
    // Don't reveal whether email exists (security best practice)
    return res.json({
      success : true,
      message : 'If that email is registered, a reset link has been sent.',
      demo    : false,
    });
  }

  // Generate token valid for 15 minutes
  const token  = generateToken();
  const expiry = Date.now() + 15 * 60 * 1000; // 15 min
  resetTokens.set(token, { expiry, used: false });

  console.log(`🔐 Password reset token generated for admin: ${token.slice(0,8)}...`);

  // In production: send email via Nodemailer
  // For demo: return token directly so it can be shown in UI
  res.json({
    success      : true,
    message      : 'Reset token generated successfully.',
    resetToken   : token,       // ← In production, send this via EMAIL only
    expiresInMin : 15,
    demo         : true,        // Flag to show token in frontend demo mode
  });
});

// ── POST /api/admin-auth/verify-token ────────────────────────────────────────
// Step 2: Validate that the token exists and hasn't expired/been used
router.post('/verify-token', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required.' });
  }

  const entry = resetTokens.get(token);
  if (!entry) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
  }
  if (entry.used) {
    return res.status(400).json({ success: false, message: 'This token has already been used.' });
  }
  if (Date.now() > entry.expiry) {
    resetTokens.delete(token);
    return res.status(400).json({ success: false, message: 'Reset token has expired. Please request a new one.' });
  }

  res.json({ success: true, message: 'Token is valid.' });
});

// ── POST /api/admin-auth/reset-password ──────────────────────────────────────
// Step 3: Set new password using valid token
router.post('/reset-password', (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const entry = resetTokens.get(token);
  if (!entry) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
  }
  if (entry.used) {
    return res.status(400).json({ success: false, message: 'This token has already been used.' });
  }
  if (Date.now() > entry.expiry) {
    resetTokens.delete(token);
    return res.status(400).json({ success: false, message: 'Token has expired. Please request a new one.' });
  }

  // Validate password strength
  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  // Update credentials
  adminCredentials.password = newPassword;

  // Mark token as used (one-time use)
  entry.used = true;

  console.log(`✅ Admin password reset successfully at ${new Date().toISOString()}`);

  res.json({
    success : true,
    message : 'Password has been reset successfully. You can now log in with your new password.',
  });
});

// ── POST /api/admin-auth/change-password ─────────────────────────────────────
// Change password while logged in (knows current password)
router.post('/change-password', (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  if (currentPassword !== adminCredentials.password) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'New passwords do not match.' });
  }
  if (currentPassword === newPassword) {
    return res.status(400).json({ success: false, message: 'New password must be different from current password.' });
  }

  adminCredentials.password = newPassword;
  console.log(`✅ Admin password changed successfully at ${new Date().toISOString()}`);

  res.json({ success: true, message: 'Password changed successfully!' });
});

// ── GET /api/admin-auth/credentials (for AuthContext validation) ──────────────
router.post('/validate', (req, res) => {
  const { username, password } = req.body;
  if (username === adminCredentials.username && password === adminCredentials.password) {
    return res.json({ success: true, username: adminCredentials.username });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials.' });
});

module.exports = router;
module.exports.getCredentials = () => adminCredentials; // Export for use in other routes
