require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming origin:", origin);

    if (!origin) return callback(null, true);

    // normalize origin (remove trailing slash)
    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    } else {
      console.log("❌ CORS BLOCKED:", normalizedOrigin);
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/gems',      require('./routes/gems'));
app.use('/api/inquiries', require('./routes/inquiries'));

app.get('/api/health', (_, res) => res.json({ success: true, message: 'Shivratna API running ✅' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
