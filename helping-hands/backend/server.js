const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Helping Hands Backend is Running Successfully!");
});
// Routes
const donationRoutes = require("./routes/donations");
const volunteerRoutes = require('./routes/volunteers');
const paymentRoutes = require('./routes/payments');
const contactRoutes = require('./routes/contact');
app.use("/api/donations", donationRoutes);
app.use("/api/donations", require("./routes/donations"));

app.use('/api/admin-auth', require('./routes/adminAuth'));
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Helping Hands API is running ",
    timestamp: new Date()
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});