require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// ✅ ULTIMATE CORS CONFIGURATION
const allowedOrigins = [
  'https://shivratna.vercel.app',
  'https://shivratnaweb.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow internal/non-browser requests
    if (!origin) return callback(null, true);

    // 2. Check if it's one of our main domains
    const isAllowedMain = allowedOrigins.includes(origin);

    // 3. Check if it's ANY Vercel subdomain (Regex check)
    const isVercel = /\.vercel\.app$/.test(origin);

    if (isAllowedMain || isVercel) {
      callback(null, true);
    } else {
      console.log("❌ CORS BLOCKED for origin:", origin);
      // Instead of throwing an error that crashes the log, 
      // we just tell CORS "No"
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/gems', require('./routes/gems'));
app.use('/api/inquiries', require('./routes/inquiries'));

app.get('/api/health', (_, res) =>
  res.json({ success: true, message: 'Shivratna API running ✅' })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);