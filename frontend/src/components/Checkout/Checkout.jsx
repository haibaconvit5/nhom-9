import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPreview, setOrderPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    postalCode: '',
    paymentMethod: 'cod',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  // Fetch order preview on component mount
  useEffect(() => {
    fetchOrderPreview();
  }, []);

  const fetchOrderPreview = async () => {
    try {
      const response = await axios.post('/api/checkout/preview', {}, {
        headers: {
          'x-session-id': getSessionId()
        }
      });
      setOrderPreview(response.data.data);
    } catch (err) {
      console.error('Failed to fetch order preview:', err);
      if (err.response?.status === 400) {
        alert('Your cart is empty!');
        navigate('/cart');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-11 digits)';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('/api/checkout', {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          ward: formData.ward,
          postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      }, {
        headers: {
          'x-session-id': getSessionId()
        }
      });
      
      const order = response.data.data;
      
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${order._id}`, {
        state: { order }
      });
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!orderPreview) {
    return <div className="checkout-loading">Loading...</div>;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-sections">
            {/* Shipping Information */}
            <div className="form-section">
              <h2>Shipping Information</h2>
              
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0123456789"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address, building, apartment, etc."
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="district">District</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ward">Ward</label>
                  <input
                    type="text"
                    id="ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="form-section">
              <h2>Payment Method</h2>
              
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-label">
                    <strong>Cash on Delivery (COD)</strong>
                    <small>Pay when you receive your order</small>
                  </span>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank-transfer"
                    checked={formData.paymentMethod === 'bank-transfer'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-label">
                    <strong>Bank Transfer</strong>
                    <small>Transfer to our bank account</small>
                  </span>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="e-wallet"
                    checked={formData.paymentMethod === 'e-wallet'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-label">
                    <strong>E-Wallet</strong>
                    <small>Momo, ZaloPay, VNPay</small>
                  </span>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-label">
                    <strong>Credit/Debit Card</strong>
                    <small>Visa, Mastercard, etc.</small>
                  </span>
                </label>
              </div>
              {errors.paymentMethod && <span className="error-message">{errors.paymentMethod}</span>}
            </div>
            
            {/* Order Notes */}
            <div className="form-section">
              <h2>Order Notes (Optional)</h2>
              <div className="form-group">
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Any special instructions for your order..."
                  maxLength="500"
                />
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Items Total:</span>
              <span>{orderPreview.itemsPrice.toLocaleString('vi-VN')}₫</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping:</span>
              <span>
                {orderPreview.shippingPrice === 0 ? (
                  <span className="free-shipping">FREE</span>
                ) : (
                  `${orderPreview.shippingPrice.toLocaleString('vi-VN')}₫`
                )}
              </span>
            </div>
            
            {orderPreview.itemsPrice < orderPreview.freeShippingThreshold && (
              <div className="shipping-notice">
                Add {(orderPreview.freeShippingThreshold - orderPreview.itemsPrice).toLocaleString('vi-VN')}₫ 
                more for FREE shipping!
              </div>
            )}
            
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>{orderPreview.taxPrice.toLocaleString('vi-VN')}₫</span>
            </div>
            
            <div className="summary-row summary-total">
              <span>Total:</span>
              <span>{orderPreview.totalPrice.toLocaleString('vi-VN')}₫</span>
            </div>
            
            <button 
              type="submit" 
              className="btn-place-order"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            
            <button 
              type="button"
              className="btn-back-to-cart"
              onClick={() => navigate('/cart')}
              disabled={loading}
            >
              Back to Cart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
