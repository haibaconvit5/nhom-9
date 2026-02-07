import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/checkout/${orderId}`);
      setOrder(response.data.data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      alert('Order not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="order-loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="order-error">Order not found</div>;
  }

  return (
    <div className="order-confirmation">
      <div className="confirmation-container">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="confirmation-message">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>

        <div className="order-number">
          <span>Order Number:</span>
          <strong>{order.orderNumber}</strong>
        </div>

        <div className="order-details">
          <div className="detail-section">
            <h2>Shipping Address</h2>
            <div className="address-info">
              <p><strong>{order.shippingAddress.fullName}</strong></p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {[
                  order.shippingAddress.ward,
                  order.shippingAddress.district,
                  order.shippingAddress.city
                ].filter(Boolean).join(', ')}
              </p>
              {order.shippingAddress.postalCode && (
                <p>Postal Code: {order.shippingAddress.postalCode}</p>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h2>Payment Information</h2>
            <div className="payment-info">
              <div className="info-row">
                <span>Payment Method:</span>
                <strong>
                  {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                  {order.paymentMethod === 'bank-transfer' && 'Bank Transfer'}
                  {order.paymentMethod === 'e-wallet' && 'E-Wallet'}
                  {order.paymentMethod === 'credit-card' && 'Credit/Debit Card'}
                </strong>
              </div>
              <div className="info-row">
                <span>Payment Status:</span>
                <span className={`status-badge status-${order.paymentStatus}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
              <div className="info-row">
                <span>Order Status:</span>
                <span className={`status-badge status-${order.orderStatus}`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>Order Items</h2>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img 
                      src={item.image || '/images/placeholder.jpg'} 
                      alt={item.name}
                    />
                  </div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2>Order Summary</h2>
            <div className="order-summary">
              <div className="summary-row">
                <span>Items Total:</span>
                <span>{order.itemsPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>
                  {order.shippingPrice === 0 ? (
                    <span className="free-text">FREE</span>
                  ) : (
                    `${order.shippingPrice.toLocaleString('vi-VN')}₫`
                  )}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>{order.taxPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total Paid:</span>
                <span>{order.totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="detail-section">
              <h2>Order Notes</h2>
              <p className="order-notes">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button 
            className="btn-view-orders"
            onClick={() => navigate('/order-history')}
          >
            View Order History
          </button>
          <button 
            className="btn-continue-shopping"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
