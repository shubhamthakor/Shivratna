const router   = require('express').Router();
const Inquiry  = require('../models/Inquiry');
const protect  = require('../middleware/auth');
const nodemailer = require('nodemailer');

// ── EMAIL SETUP ───────────────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // IMPORTANT
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendInquiryEmail(inquiry) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email not configured — skipping email send');
    return;
  }
  const transporter = createTransporter();
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#e879a0,#0ea5e9);padding:24px 32px">
        <h2 style="color:#fff;margin:0;font-size:20px">💎 New Inquiry — Shivratna Gemstone</h2>
        <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px">You have a new customer inquiry</p>
      </div>
      <div style="padding:32px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;width:140px">Gemstone</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:600;color:#1e293b">${inquiry.gemName}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Customer Name</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:600;color:#1e293b">${inquiry.name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Phone / WhatsApp</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:600;color:#0ea5e9"><a href="tel:${inquiry.phone}" style="color:#0ea5e9">${inquiry.phone}</a></td></tr>
          ${inquiry.email ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Email</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#1e293b">${inquiry.email}</td></tr>` : ''}
          ${inquiry.carat ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">Carat Needed</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#1e293b">${inquiry.carat}</td></tr>` : ''}
          ${inquiry.message ? `<tr><td style="padding:10px 0;color:#64748b;font-size:13px;vertical-align:top">Message</td><td style="padding:10px 0;color:#1e293b">${inquiry.message}</td></tr>` : ''}
        </table>
        <div style="margin-top:28px;display:flex;gap:12px">
          <a href="https://wa.me/${inquiry.phone.replace(/\D/g,'')}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">💬 Reply on WhatsApp</a>
          ${inquiry.email ? `<a href="mailto:${inquiry.email}" style="display:inline-block;background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">📧 Reply by Email</a>` : ''}
        </div>
      </div>
      <div style="background:#f8fafc;padding:16px 32px;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0">
        Shivratna Gemstone · Khambhat, Gujarat · hemalthakor2011@gmail.com · +91 98258 99807
      </div>
    </div>
  `;
  await transporter.sendMail({
    from:    `"Shivratna Gemstone" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `💎 New Inquiry: ${inquiry.gemName} — ${inquiry.name}`,
    html,
  });
  console.log(`✅ Email sent for inquiry from ${inquiry.name}`);
}

// ── PUBLIC — submit inquiry ───────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { gemName, name, phone, email, carat, message, source } = req.body;
    if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and phone are required.' });

    const inquiry = await Inquiry.create({ gemName, name, phone, email, carat, message, source });

    // Send email (non-blocking — don't fail if email fails)
    sendInquiryEmail(inquiry).catch(err => console.error('Email error:', err.message));

    res.status(201).json({ success: true, message: 'Inquiry submitted! We will contact you within 24 hours.' });
  } catch (err) {
    console.error('Inquiry error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit inquiry.' });
  }
});

// ── ADMIN — get all inquiries ─────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    const total     = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, inquiries, total, unread: await Inquiry.countDocuments({ status: 'new' }) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries.' });
  }
});

// ADMIN — mark as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const inq = await Inquiry.findByIdAndUpdate(req.params.id, { status: 'read', readAt: new Date() }, { new: true });
    if (!inq) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, inquiry: inq });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed.' });
  }
});

// ADMIN — update status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = { status };
    if (notes !== undefined) update.notes = notes;
    if (status === 'replied') update.repliedAt = new Date();
    const inq = await Inquiry.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!inq) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, inquiry: inq });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed.' });
  }
});

// ADMIN — delete inquiry
router.delete('/:id', protect, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed.' });
  }
});

module.exports = router;
