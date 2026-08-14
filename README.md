# Kanban Board

A full-stack Kanban board application with authentication, board/task management, background email processing, and caching — built as a way to go deep on backend architecture, containerization, and performance testing.

**Live demo:** _add your Vercel link here_
**Backend API:** _add your Render link here_

---

## Features

- Email/password authentication with JWT (httpOnly cookies), token blacklisting on logout/password change
- Board and task management with drag-and-drop-ready column structure
- Real-time-feeling notifications (welcome, password changes) generated on key actions
- Background email delivery via a dedicated worker process (welcome emails, password reset, password changed)
- Profile management (avatar upload via Cloudinary, personal info, email/password changes with OTP confirmation)
- Redis/Valkey-backed caching on read-heavy board endpoints
- Rate limiting on the API layer

---

## Tech Stack

**Frontend**

- React + React Router (data router)
- React Query (TanStack Query)
- React hook form
- Axios
- Radix UI
- Vite

**Backend**

- Node.js + Express
- MongoDB (Mongoose) — hosted on MongoDB Atlas
- Redis-compatible store (Valkey) — caching, rate limiting, token blacklisting
- BullMQ — background job queue, run as a separate worker process
- Nodemailer + SendGrid — transactional email
- Cloudinary + Multer + Sharp — image upload/processing
- JWT — authentication

**Infrastructure**

- Docker (multi-stage builds for frontend, backend, worker)
- Docker Compose — local orchestration
- Nginx — static file serving + reverse proxy to the API, in production/Docker
- Deployed via Render (API + worker) and Vercel (frontend)

---

## Architecture

```
┌─────────────┐      ┌───────────────────┐      ┌──────────────┐
│   Frontend   │─────▶│  Nginx (proxy)     │─────▶│   Backend    │
│  (React/Vite)│      │  static + /api/*   │      │  (Express)   │
└─────────────┘      └───────────────────┘      └──────┬───────┘
                                                          │
                                    ┌─────────────────────┼─────────────────────┐
                                    ▼                     ▼                     ▼
                             ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
                             │ MongoDB     │      │ Valkey/Redis │      │   Worker     │
                             │ Atlas       │      │ (cache,      │◀────▶│ (BullMQ,     │
                             │             │      │  rate limit, │      │  email jobs) │
                             │             │      │  blacklist)  │      │              │
                             └─────────────┘      └──────────────┘      └──────┬───────┘
                                                                                  │
                                                                                  ▼
                                                                          ┌──────────────┐
                                                                          │  SendGrid    │
                                                                          └──────────────┘
```

The API server and the email worker are deliberately separate processes/containers — the API handles HTTP requests, the worker independently pulls jobs off a Redis-backed queue and processes them (sending email via SendGrid). This means a slow or failing email send never blocks API responsiveness, and each can be scaled independently.

---

## Running Locally

### Prerequisites

- Docker & Docker Compose
- A MongoDB Atlas connection string (or any MongoDB instance)
- Redis or Valkey running locally, reachable from Docker containers
- A SendGrid account (or any SMTP provider) for email sending

### Setup

1. Clone the repo
2. Create `backend/config.env` with the required environment variables (see below)
3. From the project root:

```bash
docker compose up --build
```

4. Frontend: `http://localhost:8080`
   Backend API: `http://localhost:5000/api/v1`

### Environment Variables

`backend/config.env`:

```
DATABASE=<your MongoDB Atlas connection string>
JWT_SECRET=<your secret>
JWT_EXPIRES_IN=<e.g. 90d>
FRONTEND_URL=http://localhost:5173
SENDGRID_API_KEY=<your SendGrid API key>
EMAIL_FROM=<your verified sender email>
CLOUDINARY_CLOUD_NAME=<...>
CLOUDINARY_API_KEY=<...>
CLOUDINARY_API_SECRET=<...>
```

`docker-compose.yml` also sets `REDIS_HOST=host.docker.internal` so containers can reach a Redis/Valkey instance running on the host machine rather than inside Docker.

---

## Load Testing

The API was load tested with [k6](https://k6.io), simulating a ramping load up to 50 concurrent virtual users running a realistic flow (signup → login → create board → list boards), with results streamed into Prometheus and visualized in Grafana.

**What the process surfaced and fixed:**

- A misconfigured `trust proxy` setting that caused `express-rate-limit` to misidentify clients once traffic was routed through Nginx, contributing to a high failure rate under load
- Parallelized independent write operations (e.g. notification creation + email queuing) using `Promise.all()` where they had no dependency on each other
- Added Redis-backed caching (cache-aside pattern) on read-heavy board endpoints, with explicit invalidation on every write path

**Result:** 100% request success rate under sustained 50-VU load. Remaining response-time latency was diagnosed as network round-trip cost to the MongoDB Atlas region (not local capacity or application bugs), confirmed via Atlas's own operation metrics and direct latency testing.

---

## API Overview

All routes are prefixed with `/api/v1`.

| Resource      | Base path                                               |
| ------------- | ------------------------------------------------------- |
| Auth          | `/users` — signup, login, logout, password reset/update |
| Boards        | `/boards` — create, edit, delete, list, get by slug     |
| Notifications | `/notifications`                                        |

Authentication uses httpOnly JWT cookies; protected routes require a valid, non-blacklisted token.

---
