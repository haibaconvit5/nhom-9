import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const navigate = useNavigate();
  const { product, quantity, price } = item;

  if (!product) {
    return null; // Product might be deleted
  }

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0 && newQuantity <= product.stock) {
      onUpdateQuantity(item._id, newQuantity);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      onUpdateQuantity(item._id, quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      onUpdateQuantity(item._id, quantity - 1);
    }
  };

  const handleRemove = () => {
    if (window.confirm(`Remove "${product.name}" from cart?`)) {
      onRemove(item._id);
    }
  };

  const handleProductClick = () => {
    navigate(`/products/${product._id}`);
  };

  const subtotal = price * quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image" onClick={handleProductClick}>
        <img 
          src={product.image || '/images/placeholder.jpg'} 
          alt={product.name}
        />
      </div>

      <div className="cart-item-info">
        <h3 className="cart-item-name" onClick={handleProductClick}>
          {product.name}
        </h3>
        <p className="cart-item-category">{product.category}</p>
        <p className="cart-item-price">
          {price.toLocaleString('vi-VN')}₫
        </p>
        <p className="cart-item-stock">
          {product.stock > 0 ? (
            <span className="in-stock">In Stock ({product.stock} available)</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </p>
      </div>

      <div className="cart-item-quantity">
        <label>Quantity:</label>
        <div className="quantity-controls">
          <button 
            className="quantity-btn" 
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={product.stock}
            className="quantity-input"
          />
          <button 
            className="quantity-btn" 
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-subtotal">
        <span className="subtotal-label">Subtotal:</span>
        <span className="subtotal-price">
          {subtotal.toLocaleString('vi-VN')}₫
        </span>
      </div>

      <button 
        className="cart-item-remove"
        onClick={handleRemove}
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;
