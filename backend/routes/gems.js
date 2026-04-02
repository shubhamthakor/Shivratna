const router  = require('express').Router();
const Gem     = require('../models/Gem');
const protect = require('../middleware/auth');

const fmt = n => '₹' + Number(n).toLocaleString('en-IN');

// PUBLIC — main website fetches this
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { name:     { $regex: search, $options: 'i' } },
        { hindi:    { $regex: search, $options: 'i' } },
        { benefits: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }
    const gems = await Gem.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, gems });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch gems.' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const gem = await Gem.findOne({ id: req.params.id, isActive: true });
    if (!gem) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, gem });
  } catch { res.status(500).json({ success: false, message: 'Server error.' }); }
});

// ADMIN — protected
router.get('/admin/all', protect, async (req, res) => {
  try {
    const gems = await Gem.find().sort({ createdAt: 1 });
    res.json({ success: true, gems });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch.' }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.id) data.id = data.name.toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9]/g,'') + '_' + Date.now();
    data.priceDisplay = `${fmt(data.priceMin)} – ${fmt(data.priceMax)}`;
    data.specs = {
      Origin:       data.origin      || '',
      Hardness:     (data.hardness   || '') + ' Mohs',
      Clarity:      data.clarity     || '',
      Treatment:    data.treatment   || '',
      'Carat Rate': data.priceDisplay
    };
    if (typeof data.benefits === 'string')
      data.benefits = data.benefits.split(',').map(b => b.trim()).filter(Boolean);

    const gem = await Gem.create(data);
    res.status(201).json({ success: true, message: 'Gem added!', gem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.priceMin && data.priceMax)
      data.priceDisplay = `${fmt(data.priceMin)} – ${fmt(data.priceMax)}`;
    if (typeof data.benefits === 'string')
      data.benefits = data.benefits.split(',').map(b => b.trim()).filter(Boolean);
    data.specs = {
      Origin:       data.origin    || '',
      Hardness:     (data.hardness || '') + ' Mohs',
      Clarity:      data.clarity   || '',
      Treatment:    data.treatment || '',
      'Carat Rate': data.priceDisplay || ''
    };
    data.updatedAt = Date.now();
    const gem = await Gem.findOneAndUpdate({ id: req.params.id }, { $set: data }, { new: true });
    if (!gem) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Updated!', gem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const gem = await Gem.findOneAndDelete({ id: req.params.id });
    if (!gem) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: `${gem.name} deleted.` });
  } catch { res.status(500).json({ success: false, message: 'Delete failed.' }); }
});

router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const gem = await Gem.findOne({ id: req.params.id });
    if (!gem) return res.status(404).json({ success: false, message: 'Not found.' });
    gem.isActive = !gem.isActive;
    await gem.save();
    res.json({ success: true, message: `${gem.name} is now ${gem.isActive ? 'visible' : 'hidden'}.`, isActive: gem.isActive });
  } catch { res.status(500).json({ success: false, message: 'Toggle failed.' }); }
});

module.exports = router;
