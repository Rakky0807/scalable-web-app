# Scalable Web App with Authentication & Dashboard

A **full-stack web application** featuring JWT authentication, user profile management, and task CRUD operations.  
Built with **React**, **Node.js**, **Express**, and **MySQL**.

---

## Features

### Authentication
- User registration and login with JWT tokens  
- Password hashing using bcrypt  
- Protected routes requiring authentication  
- Automatic token refresh and logout  

### Profile Management
- View and update user profile  
- Real-time synchronization  
- Client + server-side validation  

### Task Management (CRUD)
- Create, read, update, and delete tasks  
- Fields: title, description, status, priority  
- Filters by **status** (`Pending`, `In Progress`, `Completed`)  
- Filters by **priority** (`Low`, `Medium`, `High`)  
- Search across title and description  

### UI / UX
- Built with **Material-UI**  
- Fully responsive (mobile, tablet, desktop)  
- Form validation with feedback  
- Loading indicators and toasts  

---

## Tech Stack

| Layer         | Technology  
|---------------|---------------------------------------------------------|
| **Frontend**  | React.js, Material-UI, React Router, Axios, Context API |
| **Backend**   | Node.js, Express.js, JWT, bcrypt, express-validator |
| **Database**  | MySQL with indexes and connection pooling |
| **Dev Tools** | Nodemon, Postman, Create React App |

---

## 📦 Prerequisites

- Node.js ≥ 14  
- MySQL ≥ 5.7  
- npm ≥ 6  

---

## 🚀 Quick Start

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Rakky0807/web_app.git
cd web_app
```

### 2️⃣ Database Setup

bashmysql -u root -p
sqlCREATE DATABASE scalable_web_app;
USE scalable_web_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_task_user ON tasks(user_id);
CREATE INDEX idx_task_status ON tasks(status);

### 3. Backend Setup

bashcd backend
npm install
Create backend/.env:
envPORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=scalable_web_app
JWT_SECRET=your_secret_key_min_32_chars

### 4. Frontend Setup

bashcd ../frontend
npm install
Create frontend/.env:
envREACT_APP_API_URL=http://localhost:5000/api

### 5. Run Application

Terminal 1 (Backend):
bashcd backend
npm run dev
Terminal 2 (Frontend):
bashcd frontend
npm start
Access: http://localhost:3000

📁 Project Structure
scalable-web-app/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL connection
│   ├── middleware/
│   │   └── auth.js               # JWT middleware
│   ├── routes/
│   │   ├── auth.js               # Auth endpoints
│   │   └── tasks.js              # Task CRUD
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/             # Login, Register
│   │   │   ├── Dashboard/        # Dashboard, Profile, Tasks
│   │   │   ├── Layout/           # Navbar, PrivateRoute
│   │   │   └── Common/           # TaskCard, TaskDialog
│   │   ├── services/
│   │   │   └── api.js            # Axios client
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state
│   │   └── App.js
│   └── .env
│
└── postman/
    └── Scalable_Web_App_API.postman_collection.json

📚 API Endpoints
MethodEndpointAuthDescriptionPOST/api/auth/register❌Register userPOST/api/auth/login❌Login userGET/api/auth/profile✅Get profilePUT/api/auth/profile✅Update profileGET/api/tasks✅Get all tasksPOST/api/tasks✅Create taskPUT/api/tasks/:id✅Update taskDELETE/api/tasks/:id✅Delete task
Query Parameters for GET /tasks:

status: Filter by status
priority: Filter by priority
search: Search in title/description


🔐 Security Features
✅ Password Hashing: bcrypt with 10 salt rounds
✅ JWT Authentication: Tokens expire in 7 days
✅ Input Validation: Client and server-side validation
✅ SQL Injection Prevention: Parameterized queries
✅ Protected Routes: Middleware authentication
✅ CORS: Configured for frontend-backend communication

## Scalability & Production Notes
Current Implementation
✅ Database connection pooling (10 connections)
✅ Indexed queries for performance
✅ JWT stateless authentication
✅ Modular code structure
✅ Error handling and logging


Production Scaling Strategy

## For 1,000-10,000 Users:
1. Caching Layer (Redis)
javascript// Cache frequently accessed data
const redis = require('redis');
const client = redis.createClient();

// Cache user profile for 5 minutes
app.get('/api/auth/profile', async (req, res) => {
  const cacheKey = `user:${req.user.userId}`;
  const cached = await client.get(cacheKey);
  
  if (cached) return res.json(JSON.parse(cached));
  
  const user = await fetchUserFromDB(req.user.userId);
  await client.setex(cacheKey, 300, JSON.stringify(user));
  res.json(user);
});

2. Load Balancing
bash# Use PM2 for multiple Node.js instances
npm install -g pm2
pm2 start server.js -i 4  # 4 instances

3. Database Optimization

Add read replicas for scaling reads
Implement pagination for large datasets
Add database query optimization and monitoring

4. Frontend Optimization
javascript// Code splitting
const Dashboard = React.lazy(() => import('./Dashboard'));

// Production build with optimization
npm run build  // Minified, tree-shaken bundle

5. CDN for Static Assets

Use CloudFlare or AWS CloudFront for serving static files
Reduces server load and improves global performance

## For 10,000+ Users:
6. Containerization (Docker)
dockerfile# Backend Dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]

7. Horizontal Scaling with Kubernetes

Deploy multiple backend instances
Auto-scaling based on CPU/memory usage
Health checks and automatic recovery

8. Microservices Architecture
API Gateway → Auth Service (Port 5001)
           → User Service (Port 5002)
           → Task Service (Port 5003)

9. Message Queue (RabbitMQ/Redis)

Handle asynchronous tasks (emails, notifications)
Prevent blocking main application flow

10. Monitoring & Logging

Implement Winston for structured logging
Use Sentry for error tracking
Set up Prometheus + Grafana for metrics

Key Improvements for Production:

Rate limiting (100 req/15min per IP)
HTTPS with SSL certificates
Environment-based configuration
Database backups and disaster recovery
CI/CD pipeline (GitHub Actions)
Security headers (Helmet.js)
Request compression (gzip)


🧪 Testing with Postman

Import collection: postman/Scalable_Web_App_API.postman_collection.json
Run "Register User" → Token auto-saves
Test all endpoints with saved token
Collection includes all API endpoints with examples


🐛 Troubleshooting
Backend won't start:

Check MySQL is running
Verify .env credentials
Ensure port 5000 is available

Frontend can't connect:

Check backend is running on port 5000
Verify REACT_APP_API_URL in frontend .env

Token expired:

Login again to get new token
Tokens expire after 7 days