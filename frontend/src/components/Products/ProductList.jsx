import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...filters
      });
      
      const response = await axios.get(`/api/products?${params}`);
      
      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div className="product-list-container">
      <div className="product-header">
        <h1>Khóa học trực tuyến</h1>
        <p>Khám phá hơn {products.length} khóa học chất lượng cao</p>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Tìm kiếm khóa học..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍 Tìm kiếm
          </button>
        </form>

        <div className="filters">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Tất cả danh mục</option>
            <option value="Programming">Lập trình</option>
            <option value="Data Science">Data Science</option>
            <option value="Design">Thiết kế</option>
            <option value="Business">Kinh doanh</option>
            <option value="Marketing">Marketing</option>
          </select>

          <div className="price-filter">
            <input
              type="number"
              name="minPrice"
              placeholder="Giá từ"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="price-input"
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Giá đến"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="price-input"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="no-products">
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ← Trước
          </button>
          <span className="page-info">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
