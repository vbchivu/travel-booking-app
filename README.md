# 🌍 Travel Booking & Support System

## 🚀 Overview
A modern **microservices-based** application for flight booking and customer support.  
Implements **React (Next.js)** for frontend, **Node.js (Express, TypeScript)** for backend, **PostgreSQL** for data, **RabbitMQ** for event-driven architecture, and **Observability tools (Grafana, Prometheus, Sentry).**

---

## 🛠 Tech Stack

| **Category**  | **Technology**  |
|--------------|----------------|
| **Frontend**  | Next.js, React, TypeScript |
| **Backend**   | Node.js, Express, GraphQL/REST APIs |
| **Database**  | PostgreSQL |
| **Messaging** | RabbitMQ |
| **Caching**   | Redis |
| **Monitoring** | Grafana, Prometheus, Datadog (Optional) |
| **Error Tracking** | Sentry |
| **CI/CD**  | GitHub Actions (Planned) |
| **Testing** | Jest, Cypress |

---

## 🏗 Running Locally

### 1️⃣ Install Dependencies
```sh
npm install
```

### 2️⃣ Start Infrastructure (Database, RabbitMQ)
```sh
docker-compose up -d
```

### 3️⃣ Start Backend Services & Frontend
```sh
cd services/user-service && npm i
```
```sh
npm install --save-dev typescript
```
```sh
npx prisma init && npx prisma migrate dev --name init
```
```sh
npm run build
```
```sh
npm run dev
```
```sh
cd ../frontend && npm run dev
```

### 4️⃣ Visit the Frontend
- **Frontend URL:** [http://localhost:3000](http://localhost:3000)

### 5️⃣ Access RabbitMQ UI
- **URL:** [http://localhost:15672](http://localhost:15672)  
- **Username:** `admin`  
- **Password:** `secret`  

---

## 📌 Steps

### ✅ **Step 1: Project Setup & Documentation**
✔️ **Git repository initialized**  
✔️ **Project folder structure set up**  
✔️ **ESLint & Prettier configured**  
✔️ **Docker Compose for PostgreSQL, Redis, RabbitMQ**  
✔️ **Initial README.md with documentation**  

### ✅ **Step 2: User Authentication & Authorization (User Service)**
✔️ **Implemented User Service with authentication (signup, login, and refresh tokens)**  
✔️ **Integrated JWT-based authentication and bcrypt for password hashing**  
✔️ **Configured Prisma ORM to manage user accounts in PostgreSQL**  
✔️ **Exposed authentication routes (/auth/signup, /auth/login, /auth/refresh)**  
✔️ **Added JWT middleware for secure route protection**  

### ✅ **Step 3: Booking Service (GraphQL & REST API)**
✔️ **Created Booking Service with PostgreSQL integration using Prisma ORM**  
✔️ **Implemented REST API and GraphQL resolvers for booking management**  
✔️ **Integrated RabbitMQ event publishing for booking.created**  
✔️ **Implemented structured logging with Winston**  
✔️ **Exposed routes for creating and retrieving bookings**

---
