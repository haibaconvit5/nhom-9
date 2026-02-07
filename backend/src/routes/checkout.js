const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrderByNumber,
  getOrderPreview
} = require('../controllers/checkoutController');

// Checkout routes
router.post('/', createOrder);                          // POST /api/checkout - Create order
router.post('/preview', getOrderPreview);               // POST /api/checkout/preview - Get price preview
router.get('/:orderId', getOrderById);                  // GET /api/checkout/:orderId - Get order by ID
router.get('/order/:orderNumber', getOrderByNumber);    // GET /api/checkout/order/:orderNumber - Get by order number

module.exports = router;
