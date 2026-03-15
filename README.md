# 🎥 Demo Studio — Feature Flywheel Platform

A full-stack web application for managing a **coding recording demo studio** — creating a flywheel of new features and demo recordings to quickly evaluate customer experience.

## Overview

The Demo Studio implements a feature flywheel: new product features flow through stages from planning to publishing, with demo recordings and customer experience reviews at each step.

```
📋 Planned → 🔧 In Progress → 🎯 Ready to Record → 🎬 Recorded → 🚀 Published
                                                         ↓
                                              ⭐ Customer Reviews (CX Score)
                                                         ↓
                                              📊 Dashboard Analytics
```

## Features

- **Dashboard** — KPI cards, feature pipeline bar chart, flywheel stage summary, average CX score
- **Features** — Full CRUD for product features with status tracking through the flywheel stages
- **Recordings** — Manage demo recordings linked to features; filter by feature, update status
- **Reviews** — Submit star ratings and CX scores for recordings; view aggregate metrics

## Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18 + TypeScript          |
| Backend   | Node.js + Express + TypeScript |
| Storage   | JSON file (zero-dependency)    |
| Container | Docker + Docker Compose        |

## Quick Start

### Option 1 — Docker Compose (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Option 2 — Local development

**Backend:**
```bash
cd backend
npm install
npm run dev      # hot-reload on http://localhost:4000
```

**Frontend** (in a new terminal):
```bash
cd frontend
npm install
npm start        # dev server on http://localhost:3000
```

## API Reference

| Method | Path                      | Description                    |
|--------|---------------------------|--------------------------------|
| GET    | `/api/features`           | List all features              |
| POST   | `/api/features`           | Create a feature               |
| PUT    | `/api/features/:id`       | Update a feature               |
| DELETE | `/api/features/:id`       | Delete a feature               |
| GET    | `/api/recordings`         | List all recordings            |
| GET    | `/api/recordings?featureId=` | Filter recordings by feature |
| POST   | `/api/recordings`         | Create a recording             |
| PUT    | `/api/recordings/:id`     | Update a recording             |
| DELETE | `/api/recordings/:id`     | Delete a recording             |
| GET    | `/api/reviews`            | List all reviews               |
| POST   | `/api/reviews`            | Submit a review                |
| DELETE | `/api/reviews/:id`        | Delete a review                |
| GET    | `/api/stats`              | Dashboard statistics           |
| GET    | `/health`                 | Health check                   |

## Running Tests

```bash
# Backend tests (17 tests)
cd backend && npm test

# Frontend tests (8 tests)
cd frontend && CI=true npm test
```

## Feature Statuses

| Status           | Meaning                                 |
|------------------|-----------------------------------------|
| `planned`        | Feature idea captured, not yet started  |
| `in-progress`    | Development underway                    |
| `ready-to-record`| Feature complete, demo not yet recorded |
| `recorded`       | Demo recording exists                   |
| `published`      | Recording published for customers       |

## Recording Statuses

| Status      | Meaning                          |
|-------------|----------------------------------|
| `draft`     | Recording exists but not reviewed|
| `review`    | Under internal review            |
| `approved`  | Approved for publishing          |
| `published` | Live for customers               |
