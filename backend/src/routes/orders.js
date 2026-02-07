const express = require('express');
const router = express.Router();
const {
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  getOrderStats
} = require('../controllers/orderController');

// Order routes
router.get('/stats', getOrderStats);               // GET /api/orders/stats - Get order statistics
router.get('/', getUserOrders);                    // GET /api/orders - Get all user orders
router.get('/:orderId', getOrderDetails);          // GET /api/orders/:orderId - Get order details
router.patch('/:orderId/cancel', cancelOrder);     // PATCH /api/orders/:orderId/cancel - Cancel order

module.exports = router;
