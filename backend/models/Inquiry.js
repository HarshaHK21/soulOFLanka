const mongoose = require('mongoose');
const { Schema } = mongoose;

const InquirySchema = new Schema({
  customer: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Changed to false to allow guest inquiries if needed
  },
  customerName: {
    type: String,
    required: true,
  },
  subject: {        
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {       
    type: String,
    enum: ['new', 'replied', 'closed'],
    default: 'new',
  },
  assignedTo: {     
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);
