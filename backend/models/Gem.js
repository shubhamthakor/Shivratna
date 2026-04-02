const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  name:        { type: String, required: true, trim: true },
  hindi:       { type: String, trim: true },
  scientific:  { type: String, trim: true },
  category:    { type: String, required: true, enum: ['red','blue','green','yellow','white','purple'] },
  badge:       { type: String, enum: ['precious','semi'], default: 'semi' },
  vedic:       { type: Boolean, default: false },
  planet:      { type: String },
  hardness:    { type: Number, min: 1, max: 10 },
  priceMin:    { type: Number, required: true },
  priceMax:    { type: Number, required: true },
  priceDisplay:{ type: String },
  unit:        { type: String, default: 'per carat' },
  desc:        { type: String, required: true },
  specs: {
    Origin:     String,
    Hardness:   String,
    Clarity:    String,
    Treatment:  String,
    'Carat Rate': String
  },
  benefits: [{ type: String }],
  images:   [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt:{ type: Date, default: Date.now },
  updatedAt:{ type: Date, default: Date.now }
});

gemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.priceDisplay) {
    const fmt = n => '₹' + Number(n).toLocaleString('en-IN');
    this.priceDisplay = `${fmt(this.priceMin)} – ${fmt(this.priceMax)}`;
  }
  next();
});

module.exports = mongoose.model('Gem', gemSchema);
