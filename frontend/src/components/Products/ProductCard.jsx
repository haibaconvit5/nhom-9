import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Dispatch add to cart action (will be implemented in cart feature)
    console.log('Add to cart:', product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="product-card" onClick={handleViewDetails}>
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
        {product.stock === 0 && (
          <div className="out-of-stock-badge">Hết hàng</div>
        )}
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">
          {product.description.length > 80
            ? `${product.description.substring(0, 80)}...`
            : product.description}
        </p>

        <div className="product-meta">
          <div className="product-rating">
            ⭐ {product.rating.toFixed(1)}
            <span className="students-count">
              ({product.students.toLocaleString()} học viên)
            </span>
          </div>
          <div className="product-duration">
            ⏱ {product.duration}h
          </div>
        </div>

        <div className="product-footer">
          <div className="product-price">{formatPrice(product.price)}</div>
          <button
            className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Hết hàng' : '🛒 Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
