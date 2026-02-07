const Order = require('../models/Order');

// @desc    Get all orders for a user/session
// @route   GET /api/orders
// @access  Public
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    const query = userId ? { user: userId } : { sessionId };
    
    // Get pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get filter params
    const { status, paymentStatus } = req.query;
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    // Query orders with pagination
    const orders = await Order.find(query)
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    // Get total count
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        ordersPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:orderId
// @access  Public
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.product', 'name image category');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization (user or session)
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    const isAuthorized = 
      (userId && order.user?.toString() === userId.toString()) ||
      (sessionId && order.sessionId === sessionId);
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
};

// @desc    Cancel an order
// @route   PATCH /api/orders/:orderId/cancel
// @access  Public
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    const isAuthorized = 
      (userId && order.user?.toString() === userId.toString()) ||
      (sessionId && order.sessionId === sessionId);
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }
    
    // Check if order can be cancelled
    if (order.orderStatus === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel delivered orders'
      });
    }
    
    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }
    
    // Update order status
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || 'Customer requested cancellation';
    
    // Restore product stock
    const Product = require('../models/Product');
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }
    
    await order.save();
    await order.populate('items.product', 'name image');
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Public
exports.getOrderStats = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    const query = userId ? { user: userId } : { sessionId };
    
    const stats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const result = stats.length > 0 ? stats[0] : {
      totalOrders: 0,
      totalSpent: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0
    };
    
    delete result._id;
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
};
