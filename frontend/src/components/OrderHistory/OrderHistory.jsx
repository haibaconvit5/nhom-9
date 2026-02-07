import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderHistory.css';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [currentPage, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 5
      });
      
      if (filterStatus) {
        params.append('status', filterStatus);
      }
      
      const response = await axios.get(`/api/orders?${params}`, {
        headers: {
          'x-session-id': getSessionId()
        }
      });
      
      setOrders(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/orders/stats', {
        headers: {
          'x-session-id': getSessionId()
        }
      });
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      await axios.patch(
        `/api/orders/${orderId}/cancel`,
        { reason: 'Customer requested cancellation' },
        {
          headers: {
            'x-session-id': getSessionId()
          }
        }
      );
      
      // Refresh orders
      fetchOrders();
      fetchStats();
      alert('Order cancelled successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
      console.error('Error cancelling order:', err);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order-confirmation/${orderId}`);
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !orders.length) {
    return <div className="order-history-loading">Loading orders...</div>;
  }

  return (
    <div className="order-history">
      <div className="order-history-container">
        <h1>Order History</h1>

        {/* Statistics Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalSpent.toLocaleString('vi-VN')}₫</div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.pendingOrders}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.deliveredOrders}</div>
              <div className="stat-label">Delivered</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="order-filters">
          <label htmlFor="statusFilter">Filter by status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {error && <div className="order-error">{error}</div>}

        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet.</p>
            <button 
              className="btn-start-shopping"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-number">
                      <strong>Order #{order.orderNumber}</strong>
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                    </div>
                    <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>

                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="item-preview">
                        <img 
                          src={item.image || '/images/placeholder.jpg'} 
                          alt={item.name}
                        />
                        <div className="item-preview-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">
                        +{order.items.length - 3} more item(s)
                      </div>
                    )}
                  </div>

                  <div className="order-summary-row">
                    <div className="order-info">
                      <span className="info-label">Total Items:</span>
                      <span className="info-value">{order.items.length}</span>
                    </div>
                    <div className="order-info">
                      <span className="info-label">Total Amount:</span>
                      <span className="info-value total-price">
                        {order.totalPrice.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>

                  <div className="order-actions">
                    <button 
                      className="btn-view-details"
                      onClick={() => handleViewOrder(order._id)}
                    >
                      View Details
                    </button>
                    {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
                      <button 
                        className="btn-cancel-order"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
