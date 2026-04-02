require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// ✅ SIMPLE CORS (FINAL)
app.use(cors({
  origin: true,
  credentials: true
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