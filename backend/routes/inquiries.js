const router = require('express').Router();
const Inquiry = require('../models/Inquiry'); // Removed .default as we switched to CommonJS

// Create inquiry
router.post('/', async (req, res) => {
  console.log("POST /api/inquiries body:", req.body); // Debug log
  try {
    const { customer, customerName, subject, message, assignedTo } = req.body;

    // Required fields check
    if (!customerName || !message) {
      console.log("Validation failed: customerName or message missing");
      return res.status(400).json({ message: 'customerName and message are required' });
    }

    const inquiry = await Inquiry.create({
      customer: customer || null, // allow null for now if no JWT
      customerName,
      subject: subject || '',
      message,
      assignedTo: assignedTo || null,
    });
    
    console.log("Inquiry created:", inquiry._id); // Debug log

    // Emit real-time event
    if (req.io) {
        req.io.emit('new_inquiry', inquiry);
    }

    res.status(201).json(inquiry);
  } catch (e) {
    console.error("Error creating inquiry:", e.message);
    res.status(500).json({ message: e.message });
  }
});

// Get all inquiries for a customer (for testing)
router.get('/my', async (req, res) => {
  try {
    const { customer } = req.query;
    if (!customer) return res.status(400).json({ message: 'customer is required in query' });

    const list = await Inquiry.find({ customer }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    console.error("Error fetching inquiries:", e.message);
    res.status(500).json({ message: e.message });
  }
});

// Get all inquiries assigned to an agent
router.get('/agent/:agentId', async (req, res) => {
  try {
    const list = await Inquiry.find({ assignedTo: req.params.agentId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    console.error("Error fetching agent inquiries:", e.message);
    res.status(500).json({ message: e.message });
  }
});

// Update an inquiry (only while status is 'new')
router.patch('/:id', async (req, res) => {
  try {
    const { customer, subject, message } = req.body;

    if (!customer) {
      return res.status(400).json({ message: 'customer is required in body' });
    }

    const inq = await Inquiry.findOne({ _id: req.params.id, customer });
    if (!inq) return res.status(404).json({ message: 'Inquiry not found' });
    if (inq.status !== 'new') {
      return res.status(400).json({ message: 'Cannot edit after reply/closed' });
    }

    if (subject !== undefined) inq.subject = subject;
    if (message !== undefined) inq.message = message;

    await inq.save();

    if (req.io) {
      req.io.emit('update_inquiry', inq);
    }

    res.json(inq);
  } catch (e) {
    console.error("Error updating inquiry:", e.message);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
