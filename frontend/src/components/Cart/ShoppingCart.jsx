import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartItem from './CartItem';
import './ShoppingCart.css';

const ShoppingCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get session ID for guest users
  const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart', {
        headers: {
          'x-session-id': getSessionId()
        }
      });
      setCart(response.data.data);
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update item quantity
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const response = await axios.put(
        `/api/cart/items/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            'x-session-id': getSessionId()
          }
        }
      );
      setCart(response.data.data);
    } catch (err) {
      alert('Failed to update quantity: ' + (err.response?.data?.message || err.message));
      console.error('Error updating quantity:', err);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      const response = await axios.delete(`/api/cart/items/${itemId}`, {
        headers: {
          'x-session-id': getSessionId()
        }
      });
      setCart(response.data.data);
    } catch (err) {
      alert('Failed to remove item: ' + (err.response?.data?.message || err.message));
      console.error('Error removing item:', err);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      const response = await axios.delete('/api/cart', {
        headers: {
          'x-session-id': getSessionId()
        }
      });
      setCart(response.data.data);
    } catch (err) {
      alert('Failed to clear cart: ' + (err.response?.data?.message || err.message));
      console.error('Error clearing cart:', err);
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (cart?.items?.length > 0) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return <div className="cart-loading">Loading cart...</div>;
  }

  if (error) {
    return <div className="cart-error">{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Add some products to your cart to get started!</p>
        <button 
          className="btn-continue-shopping"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button className="btn-clear-cart" onClick={handleClearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Total Items:</span>
            <span className="summary-value">{cart.totalItems}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span className="summary-value">
              {cart.totalAmount.toLocaleString('vi-VN')}₫
            </span>
          </div>
          <div className="summary-row summary-total">
            <span>Total:</span>
            <span className="summary-value">
              {cart.totalAmount.toLocaleString('vi-VN')}₫
            </span>
          </div>
          
          <button 
            className="btn-checkout"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
          
          <button 
            className="btn-continue-shopping-secondary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
