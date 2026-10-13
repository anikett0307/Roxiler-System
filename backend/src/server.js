const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const initDB = require('./config/schema');
const seedDB = require('./config/seed');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Initialize DB Schema & Seed Sample Data
(async () => {
  await initDB();
  await seedDB();
})();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/', (req, res) => {
  res.send({ status: 'Active', message: 'Roxiler Multi-Role Store Rating Platform API v1.0 running.' });
});

// Global Centralized Error Middleware (Must be defined after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});