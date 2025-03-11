# Travel Booking and Support System

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
cd services/user-service && npm start
cd services/booking-service && npm start
cd frontend && npm run dev
```

### 4️⃣ Visit the Frontend
- **Frontend URL:** [http://localhost:3000](http://localhost:3000)

### 5️⃣ Access RabbitMQ UI
- **URL:** [http://localhost:15672](http://localhost:15672)  
- **Username:** `admin`  
- **Password:** `secret`  

---

## 📌 Steps

### ✅ **Step 1 Recap**
✔️ **Git repository initialized**  
✔️ **Project folder structure set up**  
✔️ **ESLint & Prettier configured**  
✔️ **Docker Compose for PostgreSQL, Redis, RabbitMQ**  
✔️ **Initial README.md with documentation**  

---

### 🔜 **Next Step: User Authentication Service**
