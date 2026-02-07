const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to get or create cart
const getOrCreateCart = async (userId, sessionId) => {
  const query = userId ? { user: userId } : { sessionId };
  let cart = await Cart.findOne(query).populate('items.product');
  
  if (!cart) {
    cart = await Cart.create({
      ...(userId ? { user: userId } : { sessionId }),
      items: [],
      totalAmount: 0,
      totalItems: 0
    });
  }
  
  return cart;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Public
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    const cart = await getOrCreateCart(userId, sessionId);
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Public
exports.addItemToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }
    
    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId);
    
    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product._id.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Public
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    const cart = await getOrCreateCart(userId, sessionId);
    
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    // Check stock
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }
    
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    
    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Public
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    const cart = await getOrCreateCart(userId, sessionId);
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    await cart.save();
    await cart.populate('items.product');
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Public
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    const cart = await getOrCreateCart(userId, sessionId);
    cart.items = [];
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};
