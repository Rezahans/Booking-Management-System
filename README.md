# 📋 Booking Management System

A full-stack internal staff application for managing customer bookings, built with modern technologies.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![NestJS](https://img.shields.io/badge/NestJS-10.x-red?logo=nestjs)
![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma)

---

## 📖 Overview

This application is an **internal tool** for staff to:
- **Create Bookings** — Record customer name, email, select a service, and schedule date/time. End time is auto-calculated based on service duration.
- **View Booking List** — Browse all bookings with search, status filtering, service filtering, and sorting.
- **Update Booking Status** — Transition bookings through `PENDING → CONFIRMED → COMPLETED` or `CANCELLED`.
- **View Available Services** — Browse the pre-seeded service catalog with durations and pricing.

---

## 🏗️ Architecture

```
Booking-Management-System/
├── backend/                 # NestJS REST API
│   ├── src/
│   │   ├── prisma/          # Prisma ORM service (global)
│   │   ├── services/        # Service catalog module
│   │   ├── bookings/        # Booking CRUD module
│   │   └── common/          # Exception filters
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # SQL migrations
│   │   └── seed.ts          # Database seeder
│   └── test/                # E2E tests
├── frontend/                # Next.js 16 (App Router)
│   └── src/
│       ├── app/             # Pages & layout
│       ├── components/      # Reusable UI components
│       └── lib/             # API client, types, utilities
├── docker-compose.yml       # Multi-container orchestration
├── .github/workflows/       # CI/CD pipeline
└── README.md
```

---

## 🗄️ Database Schema (ERD)

```
┌─────────────────────────────┐       ┌────────────────────────────────────┐
│          services            │       │            bookings                │
├─────────────────────────────┤       ├────────────────────────────────────┤
│ id          UUID (PK)        │──┐    │ id              UUID (PK)          │
│ name        VARCHAR           │  │    │ customerName    VARCHAR             │
│ duration    INT (minutes)     │  │    │ customerEmail   VARCHAR             │
│ description TEXT (nullable)   │  └───▶│ serviceId       UUID (FK → services)│
│ price       FLOAT (nullable)  │       │ startTime       TIMESTAMP           │
│ createdAt   TIMESTAMP         │       │ endTime         TIMESTAMP           │
│ updatedAt   TIMESTAMP         │       │ status          ENUM                │
└─────────────────────────────┘       │                 (PENDING, CONFIRMED, │
                                       │                  COMPLETED,CANCELLED)│
                                       │ notes           TEXT (nullable)      │
                                       │ createdAt       TIMESTAMP            │
                                       │ updatedAt       TIMESTAMP            │
                                       └────────────────────────────────────┘
```

**Relationship:** `Service 1 ──── ∞ Booking` (One service can have many bookings)

---

## ⚡ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 16, React, TypeScript, Tailwind CSS, Lucide Icons |
| Backend   | NestJS 10, TypeScript, class-validator, Swagger |
| Database  | PostgreSQL 16+                      |
| ORM       | Prisma 5                            |
| Testing   | Jest                                |
| DevOps    | Docker, Docker Compose, GitHub Actions CI |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ and **npm** v10+
- **PostgreSQL** 16+ running locally (or via Docker)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Booking-Management-System.git
cd Booking-Management-System
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from example)
cp .env.example .env

# Edit .env with your PostgreSQL credentials:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking_db?schema=public"

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed

# Start development server
npm run start:dev
```

The backend API will be running at: **http://localhost:4000**
Swagger API documentation: **http://localhost:4000/api/docs**

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be running at: **http://localhost:3000**

---

## 🐳 Docker Setup (Alternative)

If you have Docker and Docker Compose installed:

```bash
# From root directory
docker-compose up --build
```

This starts PostgreSQL, Backend (port 4000), and Frontend (port 3000) automatically.

---

## 📡 API Endpoints

All endpoints are prefixed with `/api`.

### Services

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/services`     | List all available services |
| GET    | `/api/services/:id` | Get service details by ID   |

### Bookings

| Method | Endpoint                    | Description                         |
|--------|-----------------------------|-------------------------------------|
| POST   | `/api/bookings`             | Create a new booking                |
| GET    | `/api/bookings`             | List bookings (filter, search, sort)|
| GET    | `/api/bookings/statistics`  | Get booking statistics summary      |
| GET    | `/api/bookings/:id`         | Get booking details by ID           |
| PATCH  | `/api/bookings/:id/status`  | Update booking status               |

### Query Parameters for `GET /api/bookings`

| Parameter   | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `status`    | enum   | Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED) |
| `search`    | string | Search by customer name or email         |
| `serviceId` | string | Filter by specific service UUID          |
| `sortBy`    | string | Sort field (startTime, createdAt, customerName) |
| `sortOrder` | string | Sort direction (asc, desc)               |

### Example: Create Booking

```json
POST /api/bookings
{
  "customerName": "Maya Indah",
  "customerEmail": "maya@example.com",
  "serviceId": "<service-uuid>",
  "startTime": "2026-08-25T10:00:00.000Z",
  "notes": "Request senior stylist"
}
```

The API automatically computes `endTime` from the service's `duration` field.

---

## ✅ Running Tests

```bash
cd backend
npm test            # Run unit tests
npm run test:cov    # Run tests with coverage
npm run test:e2e    # Run end-to-end tests
```

---

## 🔍 Swagger API Documentation

Once the backend is running, interactive API documentation is available at:

**http://localhost:4000/api/docs**

---

## 📁 Environment Variables

### Backend (`backend/.env`)

```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking_db?schema=public"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🧪 Design Decisions

1. **Prisma ORM** — Chosen for end-to-end TypeScript type safety, auto-generated migrations, and a clean query API.
2. **Auto End-Time Calculation** — Staff only pick a start time; the backend calculates `endTime = startTime + service.duration` automatically.
3. **Status Workflow** — Booking statuses follow a simple lifecycle: `PENDING → CONFIRMED → COMPLETED` or `CANCELLED` at any stage.
4. **Global Exception Filter** — All errors are normalized into a consistent JSON response format with `statusCode`, `timestamp`, `path`, and `message`.
5. **Client-side Filtering** — The booking table supports instant search, status tabs, and service filters on the client side for a snappy UX, while the API also supports server-side filtering for scalability.

---

## 📝 License

This project is for assessment purposes only.
