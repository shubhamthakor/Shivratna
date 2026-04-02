const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  gemName:   { type: String, default: 'General Inquiry' },
  name:      { type: String, required: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  email:     { type: String, trim: true },
  carat:     { type: String, default: '' },
  message:   { type: String, default: '' },
  source:    { type: String, enum: ['contact-form','gem-inquiry','consultation'], default: 'gem-inquiry' },
  status:    { type: String, enum: ['new','read','replied','closed'], default: 'new' },
  notes:     { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  readAt:    { type: Date },
  repliedAt: { type: Date },
});

module.exports = mongoose.model('Inquiry', inquirySchema);
