const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

// Cart routes
router.route('/')
  .get(getCart)           // GET /api/cart - Get user cart
  .delete(clearCart);     // DELETE /api/cart - Clear cart

router.route('/items')
  .post(addItemToCart);   // POST /api/cart/items - Add item to cart

router.route('/items/:itemId')
  .put(updateCartItem)    // PUT /api/cart/items/:itemId - Update quantity
  .delete(removeCartItem); // DELETE /api/cart/items/:itemId - Remove item

module.exports = router;
