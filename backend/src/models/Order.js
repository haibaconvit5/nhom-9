const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  image: String
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  ward: {
    type: String,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    index: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'bank-transfer', 'e-wallet', 'credit-card'],
    default: 'cod',
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  taxPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Format: ORD-YYYYMMDD-XXXXX (e.g., ORD-20240115-00001)
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    
    // Find last order of the day
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^ORD-${dateStr}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD-${dateStr}-${sequence.toString().padStart(5, '0')}`;
  }
  next();
});

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ sessionId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
