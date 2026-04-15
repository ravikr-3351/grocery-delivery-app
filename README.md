# 🛒 FreshCart - Grocery Delivery Application (MERN Stack)

A complete production-ready grocery delivery application with three user roles: **Customer**, **Admin**, and **Rider**.

---

## 📁 Folder Structure

```
grocery-delivery-app/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Image upload config
│   ├── controllers/
│   │   ├── authController.js  # Register/Login logic
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── riderController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT auth + role-based authorization
│   │   └── validate.js        # Input validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   └── riderRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js                # Sample data seeder
│   └── server.js              # Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ProductCard.js / .css
│   │   │   │   └── OrderStatusBadge.js / .css
│   │   │   └── layout/
│   │   │       └── Navbar.js / .css
│   │   ├── context/
│   │   │   ├── AuthContext.js     # Auth state management
│   │   │   └── CartContext.js     # Cart state management
│   │   ├── pages/
│   │   │   ├── HomePage.js / .css
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── CartPage.js / .css
│   │   │   ├── CheckoutPage.js / .css
│   │   │   ├── UserDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── RiderDashboard.js
│   │   │   ├── AuthPages.css
│   │   │   └── Dashboard.css
│   │   ├── services/
│   │   │   └── api.js            # Axios instance with JWT
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB** running locally or a MongoDB Atlas connection string
- **Cloudinary** account (optional, for image uploads)

### Step 1: Clone & Setup Backend

```bash
cd grocery-delivery-app/backend

# Copy environment file and fill in your values
cp .env.example .env

# Install dependencies
npm install

# Seed the database with sample data
node seed.js

# Start the backend server
npm run dev
```

The backend will run on **http://localhost:5000**

### Step 2: Setup Frontend

```bash
cd grocery-delivery-app/frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend will run on **http://localhost:3000**

---

## GitHub Pages Deployment (Frontend Only)

GitHub Pages can host only static frontend files. The Node/Express backend cannot run on GitHub Pages.

1. Push your source code once to GitHub (initial commit required):
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```
2. Deploy from the `frontend` folder (not project root):
```bash
cd frontend
npm install
npm run deploy
```
3. If PowerShell blocks `npm` with execution policy error, use:
```bash
npm.cmd run deploy
```
4. For production, set a hosted backend URL before deploy:
```env
REACT_APP_API_URL=https://your-backend-domain/api
```

---


## Render Deployment (Backend API)

Backend ke liye `render.yaml` add kiya gaya hai. Deploy steps:

1. Open: `https://render.com/deploy?repo=https://github.com/ravikr-3351/grocery-delivery-app`
2. Branch select karo: `deploy-ready` (ya jis branch me latest backend ho).
3. Required env vars set karo:
```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URLS=https://ravikr-3351.github.io,http://localhost:3000,http://localhost:3001
```
4. Deploy ke baad API health check:
`https://<your-render-service>.onrender.com/api/health`
5. Frontend `.env` update karke GitHub Pages ko re-deploy karo:
```env
REACT_APP_API_URL=https://<your-render-service>.onrender.com/api
```

---

## Default Login Credentials (after seeding)

| Role     | Email              | Password   |
|----------|--------------------|------------|
| Admin    | admin@grocery.com  | admin123   |
| Rider    | rider@grocery.com  | rider123   |
| Customer | user@grocery.com   | user123    |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint           | Description         | Access  |
|--------|-------------------|---------------------|---------|
| POST   | /api/auth/register | Register new user   | Public  |
| POST   | /api/auth/login    | Login user          | Public  |
| GET    | /api/auth/me       | Get current user    | Auth    |

### Products
| Method | Endpoint           | Description         | Access  |
|--------|-------------------|---------------------|---------|
| GET    | /api/products      | List products       | Public  |
| GET    | /api/products/:id  | Get single product  | Public  |
| POST   | /api/products      | Add product         | Admin   |
| PUT    | /api/products/:id  | Update product      | Admin   |
| DELETE | /api/products/:id  | Delete product      | Admin   |

### Cart
| Method | Endpoint              | Description       | Access  |
|--------|-----------------------|-------------------|---------|
| GET    | /api/cart             | Get user cart      | User    |
| POST   | /api/cart             | Add to cart        | User    |
| PUT    | /api/cart/:productId  | Update quantity    | User    |
| DELETE | /api/cart/:productId  | Remove item        | User    |
| DELETE | /api/cart             | Clear cart         | User    |

### Orders
| Method | Endpoint          | Description       | Access  |
|--------|-------------------|-------------------|---------|
| POST   | /api/orders       | Place order        | User    |
| GET    | /api/orders       | Get my orders      | User    |
| GET    | /api/orders/:id   | Get order details  | Auth    |

### Admin
| Method | Endpoint                        | Description         | Access |
|--------|---------------------------------|---------------------|--------|
| GET    | /api/admin/orders               | All orders          | Admin  |
| PUT    | /api/admin/orders/:id/status    | Update order status | Admin  |
| PUT    | /api/admin/orders/:id/assign    | Assign rider        | Admin  |
| GET    | /api/admin/riders               | List riders         | Admin  |
| GET    | /api/admin/stats                | Dashboard stats     | Admin  |

### Rider
| Method | Endpoint                         | Description           | Access |
|--------|----------------------------------|-----------------------|--------|
| GET    | /api/rider/orders                | Assigned orders       | Rider  |
| PUT    | /api/rider/orders/:id/status     | Update delivery status| Rider  |

---

## 📦 Sample API Requests (using curl)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grocery.com","password":"admin123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products?search=apple&category=Fruits&page=1
```

### Add to Cart (requires auth token)
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"productId":"PRODUCT_ID","quantity":2}'
```

---

## ✨ Features

- ✅ JWT authentication with role-based authorization
- ✅ bcrypt password hashing
- ✅ RESTful API design
- ✅ Search and filter products
- ✅ Pagination
- ✅ Shopping cart management
- ✅ Order tracking (Pending → Confirmed → Shipped → Delivered)
- ✅ Admin dashboard with stats
- ✅ Rider delivery management
- ✅ Cloudinary image upload support
- ✅ Input validation with express-validator
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Clean modular folder structure

---

## 🛠 Tech Stack

- **Frontend**: React.js, React Router, Context API, Axios, react-hot-toast
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT, bcryptjs
- **Upload**: Cloudinary + Multer
- **Validation**: express-validator

---

## 📝 .env Configuration

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/grocery-delivery
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
CLIENT_URLS=http://localhost:3000,http://localhost:3001,https://ravikr-3351.github.io
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
# Production:
# REACT_APP_API_URL=https://<your-render-service>.onrender.com/api
```



