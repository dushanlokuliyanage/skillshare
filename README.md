# Inventory Express

A full-stack Inventory Management System built for a session demo. Features user authentication with email verification, product CRUD, and automated low-stock email alerts.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + Lucide React |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Email | Nodemailer via Mailtrap |
| Package Manager | Bun |

## Project Structure

```
inventory-express/
├── client/                  # React frontend
│   └── src/
│       ├── components/
│       │   ├── auth/        # LoginForm, RegisterForm
│       │   ├── inventory/   # ProductList, ProductForm, StockBadge
│       │   └── layout/      # Navbar, ProtectedRoute
│       ├── context/         # AuthContext (JWT + user state)
│       ├── hooks/           # useProducts (CRUD + stats)
│       ├── pages/           # LoginPage, RegisterPage, VerifyEmailPage, DashboardPage, InventoryPage
│       ├── services/        # api.ts (axios), authService, productService
│       └── types/           # TypeScript interfaces
│
├── server/                  # Express backend
│   └── src/
│       ├── config/          # db.js (MongoDB), env.js (validation)
│       ├── controllers/     # authController, productController
│       ├── middleware/      # authMiddleware (JWT), errorHandler
│       ├── models/          # User, Product (Mongoose schemas)
│       ├── routes/          # /api/auth, /api/products
│       └── services/        # emailService (verification + low-stock alerts)
│
└── package.json             # Root orchestrator (runs both servers)
```

## Features

- **Authentication** — Register, email verification (token link), login with JWT
- **Protected Routes** — Dashboard and Inventory require login; redirects to `/login` if unauthenticated
- **Product CRUD** — Add, edit, delete products with fields: name, SKU, category, price, quantity, min stock level
- **Search & Filter** — Search by name/SKU/category; filter by category
- **Dashboard** — Stats cards (total products, low-stock count, total value) + low-stock product list
- **Low-Stock Alerts** — Automated email to store owner when a product's quantity ≤ minimum stock level
- **Stock Status** — Color-coded badges: In Stock (green) / Low Stock (amber) / Out of Stock (red)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- A [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)
- A [Mailtrap](https://mailtrap.io) account (free — for testing emails)

### 1. Clone and install

```bash
# Install root dependencies (concurrently)
bun install

# Install client dependencies
bun install --cwd client

# Install server dependencies
bun install --cwd server
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/inventory?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# From Mailtrap: https://mailtrap.io → Email Testing → your inbox → SMTP Settings
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM="Inventory Express <noreply@inventoryexpress.com>"

CLIENT_URL=http://localhost:5173
STORE_OWNER_EMAIL=your@email.com
```

**Getting your credentials:**

- **MongoDB Atlas**: Create a free cluster → Database Access → create user → Network Access → allow `0.0.0.0/0` → get connection string
- **Mailtrap**: Sign up free → Email Testing → Inboxes → click your inbox → SMTP Settings tab → copy Username and Password

### 3. Run the app

```bash
bun run dev
```

This starts both servers simultaneously:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| GET | `/api/auth/verify/:token` | Verify email address | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Products

All product endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products (supports `?search=` and `?category=`) |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

## How It Works

### Email Verification Flow
1. User registers → verification email sent to their inbox (check Mailtrap)
2. User clicks the link in the email → email is verified
3. User can now log in

### Low-Stock Alert Flow
1. When a product is created or updated with `quantity ≤ minStockLevel`
2. An alert email is automatically sent to `STORE_OWNER_EMAIL`
3. Check Mailtrap inbox to see the alert

### JWT Authentication
- Token is stored in `localStorage` after login
- Attached as `Authorization: Bearer <token>` on every API request via axios interceptor
- On 401 response, token is cleared and user is redirected to `/login`

## Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start both frontend and backend in development mode |
| `bun run build` | Build the frontend for production |
| `bun run --cwd client dev` | Start frontend only |
| `bun run --cwd server dev` | Start backend only |
