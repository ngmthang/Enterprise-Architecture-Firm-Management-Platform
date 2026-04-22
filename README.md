# CAN Architecture Platform

A full-stack business management platform built for an architectural firm to streamline client relationships, project management, and internal team coordination.

🌐 **Live Demo:** https://enterprise-architecture-firm-manage.vercel.app

**Test Accounts** (password: `Admin@123` for all):
| Role | Email |
|------|-------|
| Admin | admin@architectureplatform.com |
| Architect | architect@architectureplatform.com |
| Client | client@architectureplatform.com |

---

## Overview

CAN Architecture Platform connects three types of users — clients, architects, and administrators — in a unified system that manages the full lifecycle of an architectural business, from initial client consultation through project delivery and invoicing.

---

## Features

### Public Website
- Company landing page with services, portfolio, and contact information
- Portfolio showcase with project filtering by type
- Service offerings with detailed descriptions
- Contact form for general inquiries
- Consultation request form for potential clients

### Client Portal
- Browse company portfolio and active projects
- Submit and track consultation requests
- Review and respond to quotations (accept/decline)
- View contracts and download documents
- Track invoices and submit payment details
- Receive notifications from the firm

### Architect Portal
- View assigned projects and request status updates
- Upload project documents for admin review
- Manage and submit expense reports
- View team members and their contact information
- Receive task assignments and notifications from management

### Admin Dashboard
- Full project lifecycle management (create, update, track status)
- Client relationship management (consultations, contact inquiries)
- Financial pipeline (quotations, contracts, invoices, payments)
- Team and expense management
- Portfolio and service catalog management
- Company profile and branding settings
- User management with role-based access control
- Notification system to communicate with architects and clients
- Reporting and analytics

---

## Tech Stack

### Frontend
- **React 19** with Vite
- **React Router v7** for client-side routing
- **Zustand** for state management
- **Axios** for API communication
- **Custom CSS** design system with dark theme

### Backend
- **Spring Boot 4** (Java 21)
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Flyway** for database migrations
- **Springdoc OpenAPI** for API documentation

### Infrastructure
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Railway PostgreSQL
- **Containerization:** Docker & Docker Compose (local development)

---

## Architecture
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── api/       # Axios client and service methods
│   │   ├── components/# Layout components per role
│   │   ├── pages/     # Public, admin, architect, client pages
│   │   └── store/     # Zustand auth store
│   └── Dockerfile
├── backend/           # Spring Boot application
│   ├── src/
│   │   └── main/java/com/example/architectureplatform/
│   │       ├── auth/          # JWT authentication
│   │       ├── project/       # Project management
│   │       ├── invoice/       # Invoice management
│   │       ├── quotation/     # Quotation management
│   │       ├── contract/      # Contract management
│   │       ├── payment/       # Payment tracking
│   │       ├── expense/       # Expense management
│   │       ├── consultation/  # Consultation requests
│   │       ├── notification/  # Notification system
│   │       ├── team/          # Team member management
│   │       ├── portfolio/     # Portfolio projects
│   │       └── user/          # User management
│   └── Dockerfile
└── docker-compose.yml # Local development setup
---

## Role-Based Access Control

| Feature | Admin | Architect | Client |
|---------|-------|-----------|--------|
| Manage Projects | ✅ Full CRUD | ✅ View + Request Status | ✅ View Only |
| Quotations | ✅ Full CRUD | ❌ | ✅ View + Accept/Decline |
| Contracts | ✅ Full CRUD | ❌ | ✅ View Only |
| Invoices | ✅ Full CRUD | ❌ | ✅ View + Pay |
| Documents | ✅ Full CRUD | ✅ Upload | ✅ View Public |
| Expenses | ✅ Full CRUD | ✅ Full CRUD | ❌ |
| Notifications | ✅ Send + View | ✅ Receive | ✅ Receive |
| Team Members | ✅ Full CRUD | ✅ View Only | ❌ |
| Users | ✅ Full CRUD | ❌ | ❌ |
| Portfolio | ✅ Full CRUD | ❌ | ✅ View Only |
| Services | ✅ Full CRUD | ❌ | ✅ View Only |
| Company Profile | ✅ Edit | ❌ | ✅ View Only |

---

## Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Java 21

### Setup

1. Clone the repository
```bash
git clone https://github.com/ngmthang/Enterprise-Architecture-Firm-Management-Platform.git
cd Enterprise-Architecture-Firm-Management-Platform
```

2. Create a `.env` file in the root directory using `.env.example` as a reference
```bash
cp .env.example .env
```

3. Fill in your own values in `.env`
```env
POSTGRES_DB=your_db_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
CORS_ALLOWED_ORIGINS=http://localhost:5173
JWT_SECRET=your_secure_jwt_secret
VITE_API_BASE_URL=http://localhost:8080
```

4. Start the backend and database
```bash
docker compose up -d postgres app
```

5. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

6. Open http://localhost:5173

### API Documentation
Once running, visit http://localhost:8080/swagger-ui/index.html for the full API reference.

---

## Deployment

### Backend (Railway)
- Connect GitHub repository to Railway
- Set Root Directory to `backend`
- Set Dockerfile Path to `Dockerfile`
- Add the following environment variables in Railway dashboard:

```env
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=<your-railway-postgres-url>
SPRING_DATASOURCE_USERNAME=<your-db-user>
SPRING_DATASOURCE_PASSWORD=<your-db-password>
JWT_SECRET=<your-secure-secret>
CORS_ALLOWED_ORIGINS=<your-vercel-frontend-url>
PORT=8080
```

### Frontend (Vercel)
- Connect GitHub repository to Vercel
- Set Root Directory to `frontend`
- Add the following environment variable in Vercel dashboard:

```env
VITE_API_BASE_URL=<your-railway-backend-url>
```

---

## API Endpoints

| Module | Endpoint |
|--------|----------|
| Auth | `POST /api/v1/auth/login` |
| Projects | `GET/POST /api/projects` |
| Quotations | `GET/POST /api/quotations` |
| Contracts | `GET/POST /api/contracts` |
| Invoices | `GET/POST /api/invoices` |
| Payments | `GET/POST /api/v1/payments` |
| Consultations | `GET/POST /api/v1/consultations` |
| Team Members | `GET/POST /api/v1/team-members` |
| Portfolio | `GET/POST /api/v1/portfolio-projects` |
| Services | `GET/POST /api/v1/service-offerings` |
| Notifications | `GET/POST /api/v1/notifications` |
| Users | `GET/POST /api/v1/users` |
| Company Profile | `GET/PUT /api/v1/company-profile` |
| Expenses | `GET/POST /api/v1/expenses` |
| Reports | `GET/POST /api/v1/reports` |
| Documents | `GET/POST /api/project-documents` |

---

## Screenshots

> Admin Dashboard — full business overview with stats and recent activity

> Client Portal — project tracking, invoices, and consultation management

> Architect Portal — task management, document uploads, and expense tracking

> Public Website — company portfolio and service showcase

---

## Author

**Minh Thang Nguyen**
- GitHub: [@ngmthang](https://github.com/ngmthang)

---

## License

This project is built for CAN Architecture firm. All rights reserved.
