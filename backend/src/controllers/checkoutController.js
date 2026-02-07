const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to calculate shipping price
const calculateShippingPrice = (itemsPrice) => {
  if (itemsPrice >= 500000) return 0; // Free shipping for orders >= 500k VND
  return 30000; // Standard shipping fee
};

// Helper function to calculate tax
const calculateTax = (itemsPrice) => {
  return itemsPrice * 0.1; // 10% VAT
};

// @desc    Create new order from cart
// @route   POST /api/checkout
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    // Validate required fields
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address'
      });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please select a payment method'
      });
    }
    
    // Get user cart
    const query = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(query).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }
    
    // Validate stock availability and prepare order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product.name} no longer exists`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`
        });
      }
      
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: item.price,
        image: product.image
      });
    }
    
    // Calculate prices
    const itemsPrice = cart.totalAmount;
    const shippingPrice = calculateShippingPrice(itemsPrice);
    const taxPrice = calculateTax(itemsPrice);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    
    // Create order
    const order = await Order.create({
      user: userId || undefined,
      sessionId: !userId ? sessionId : undefined,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      notes: notes || ''
    });
    
    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Clear cart after successful order
    cart.items = [];
    await cart.save();
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/checkout/:orderId
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// @desc    Get order by order number
// @route   GET /api/checkout/order/:orderNumber
// @access  Public
exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderNumber: req.params.orderNumber 
    }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// @desc    Calculate order prices preview
// @route   POST /api/checkout/preview
// @access  Public
exports.getOrderPreview = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    const query = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(query);
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }
    
    const itemsPrice = cart.totalAmount;
    const shippingPrice = calculateShippingPrice(itemsPrice);
    const taxPrice = calculateTax(itemsPrice);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    
    res.status(200).json({
      success: true,
      data: {
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        freeShippingThreshold: 500000,
        taxRate: 0.1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate order preview',
      error: error.message
    });
  }
};
