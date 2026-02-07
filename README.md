# 🎓 E-Commerce Learning Platform

> Fullstack e-commerce application for online learning courses built with Node.js, Express, React, and MongoDB.

## ✨ Features

- 🛍️ Browse course catalog with filtering, search, and pagination
- 🛒 Shopping cart with guest session support
- 💳 Multi-step checkout with multiple payment methods
- 📦 Order history with status tracking and cancellation
- 📊 Order statistics dashboard
- 📱 Fully responsive design

## 🚀 Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose  
**Frontend:** React 18, React Router v6, Axios  
**Version Control:** Git with Feature Branch workflow

## 📁 Project Structure

```
online-learning/
├── backend/src/
│   ├── models/        # Mongoose schemas (Product, Cart, Order)
│   ├── controllers/   # Business logic
│   └── routes/        # API endpoints
├── frontend/src/
│   └── components/    # React components
├── PROJECT-SUMMARY.md # Detailed implementation guide
└── README.md
```

## 💻 Installation

### Prerequisites
- Node.js 14+
- MongoDB 4.4+
- Git

### Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/haibaconvit5/nhom-9.git
   cd nhom-9
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   echo "MONGODB_URI=mongodb://localhost:27017/ecommerce\nPORT=5000" > .env
   npm start
   ```

3. **Frontend setup** (new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### Products
- `GET /api/products` - List products (with query params: category, search, sort, page, limit)
- `GET /api/products/:id` - Get product details

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add item
- `PUT /api/cart/items/:itemId` - Update quantity
- `DELETE /api/cart/items/:itemId` - Remove item
- `DELETE /api/cart` - Clear cart

### Checkout
- `POST /api/checkout` - Create order
- `POST /api/checkout/preview` - Get price preview
- `GET /api/checkout/:orderId` - Get order details

### Orders
- `GET /api/orders` - List orders (with pagination and filtering)
- `GET /api/orders/stats` - Get statistics
- `PATCH /api/orders/:orderId/cancel` - Cancel order

## 🔄 Git Workflow

### Branch Strategy
```
main (production)
  └── develop (integration)
      ├── feature/products ✅
      ├── feature/cart ✅
      ├── feature/checkout ✅
      └── feature/order-history ✅
```

### Process
1. `git checkout develop`
2. `git checkout -b feature/your-feature`
3. Make changes & commit: `git commit -m "feat(scope): description"`
4. `git push -u origin feature/your-feature`
5. Create Pull Request on GitHub: feature/* → develop
6. Review & merge

## 👥 Team

- **[@haibaconvit5](https://github.com/haibaconvit5)** - Team Lead (Full implementation)
- **[@AnhPhu29](https://github.com/AnhPhu29)** - Developer (Code review & testing)

## 📊 Statistics

- **Files:** 25 files created
- **Code:** 4,507 lines
- **Features:** 4 major features
- **Commits:** 4 feature commits
- **Pull Requests:** 4 ready for merge

## 📝 Documentation

See [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) for detailed:
- Complete implementation guide
- Feature breakdown
- API documentation
- Code architecture
- Testing instructions

## 🎯 Next Steps

1. **Create Pull Requests:**
   - Products: https://github.com/haibaconvit5/nhom-9/pull/new/feature/products
   - Cart: https://github.com/haibaconvit5/nhom-9/pull/new/feature/cart
   - Checkout: https://github.com/haibaconvit5/nhom-9/pull/new/feature/checkout
   - Order History: https://github.com/haibaconvit5/nhom-9/pull/new/feature/order-history

2. **Merge all PRs to develop**

3. **Final PR: develop → main**

---

**Repository:** https://github.com/haibaconvit5/nhom-9  
**Status:** ✅ All features completed  
**Last Updated:** January 2024
