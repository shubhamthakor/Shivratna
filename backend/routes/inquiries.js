const router   = require('express').Router();
const Inquiry  = require('../models/Inquiry');
const protect  = require('../middleware/auth');
const sgMail   = require('@sendgrid/mail');

// ✅ SET API KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ── EMAIL FUNCTION ───────────────────────────────────────────────
async function sendInquiryEmail(inquiry) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('⚠️ SendGrid not configured');
    return;
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#e879a0,#0ea5e9);padding:24px 32px">
        <h2 style="color:#fff;margin:0;font-size:20px">💎 New Inquiry — Shivratna Gemstone</h2>
        <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px">You have a new customer inquiry</p>
      </div>
      <div style="padding:32px">
        <p><b>Name:</b> ${inquiry.name}</p>
        <p><b>Phone:</b> ${inquiry.phone}</p>
        <p><b>Email:</b> ${inquiry.email || "N/A"}</p>
        <p><b>Gem:</b> ${inquiry.gemName}</p>
        <p><b>Message:</b> ${inquiry.message || "N/A"}</p>
      </div>
    </div>
  `;

    const msg = {
      to: process.env.EMAIL_TO,
      from: process.env.EMAIL_USER,
      replyTo: inquiry.email || process.env.EMAIL_TO, // 🔥 IMPORTANT
      subject: `New Inquiry - ${Date.now()}`,
      html,
    };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent via SendGrid for ${inquiry.name}`);
  } catch (error) {
    console.error("❌ SENDGRID ERROR:", error.response?.body || error.message);
  }
}

// ── PUBLIC — submit inquiry ─────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { gemName, name, phone, email, carat, message, source } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required.' });
    }

    const inquiry = await Inquiry.create({ gemName, name, phone, email, carat, message, source });

    // non-blocking email
    sendInquiryEmail(inquiry);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted! We will contact you within 24 hours.'
    });

  } catch (err) {
    console.error('Inquiry error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit inquiry.' });
  }
});

// ── ADMIN ROUTES (UNCHANGED) ─────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      inquiries,
      total,
      unread: await Inquiry.countDocuments({ status: 'new' })
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries.' });
  }
});

router.patch('/:id/read', protect, async (req, res) => {
  try {
    const inq = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: 'read', readAt: new Date() },
      { new: true }
    );

    if (!inq) return res.status(404).json({ success: false, message: 'Not found.' });

    res.json({ success: true, inquiry: inq });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed.' });
  }
});

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

router.delete('/:id', protect, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted.' });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed.' });
  }
});

module.exports = router;