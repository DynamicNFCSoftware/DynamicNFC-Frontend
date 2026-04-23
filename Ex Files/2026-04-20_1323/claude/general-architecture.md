# DynamicNFC - General Architecture

## Project Overview

DynamicNFC is a digital business card platform. Users can create NFC-enabled digital business cards with profile information, social links, and QR codes for sharing. The system uses HashIDs for secure, URL-friendly card identifiers.

## Architecture

```
DynamicNFC/
├── backend/          # Spring Boot 3.5 + Java 21 REST API
├── frontend/         # React 18 + Vite SPA
├── mobile/           # Expo React Native app (in development)
└── docs/             # API documentation
```

### Backend (Spring Boot)
- **Package:** `com.dynamicnfc.backend`
- **Structure:** Standard layered architecture (controller → service → repository → model)
- **Database:** PostgreSQL with JPA/Hibernate
- **Auth:** Session-based authentication with Spring Security
- **Key Features:** HashID encoding for user IDs, multipart file uploads for images (stored as Base64)

### Frontend (React + Vite)
- **Pages:** Home, Login, CreateCard, OrderCard, NFCCards, Enterprise
- **Routing:** React Router DOM
- **API:** Fetch with `credentials: 'include'` for session cookies

## Common Commands

### Backend
```bash
cd backend
./mvnw spring-boot:run                    # Run locally
./mvnw clean package -DskipTests          # Build JAR
./mvnw clean install                      # Build with tests
```

### Frontend
```bash
cd frontend
npm run dev        # Development server
npm run build      # Production build (required before Docker)
npm run lint       # ESLint
```

### Docker (Local Development)
```bash
docker-compose -f docker-compose-local.yml up -d      # Start all services
docker-compose down                                    # Stop all services
docker-compose -f docker-compose-local.yml build frontend  # Rebuild frontend image
```

### Docker Image Building
```bash
docker build -t dynamicnfc-springboot-app:latest ./backend
docker build -t dynamicnfc-frontend:latest ./frontend
```

## API Endpoints

| Operation    | Method | Endpoint                 | Content-Type        |
|-------------|--------|--------------------------|---------------------|
| Login       | POST   | /api/auth/login          | application/json    |
| Register    | POST   | /api/auth/register       | application/json    |
| Create Card | POST   | /api/users/upload        | multipart/form-data |
| Update Card | PUT    | /api/users/{id}/upload   | multipart/form-data |
| View Card   | GET    | /api/users/{hashId}      | -                   |
| Request Card| POST   | /api/request-card        | application/json    |

All user endpoints accept both HashID (e.g., `WzBvz3`) and numeric ID.

## Database

- **Local:** PostgreSQL on localhost:5432
- **Database:** dynamicnfc
- **Credentials:** dynamicuser / dynamicpass
- **DDL:** Hibernate auto-update (`spring.jpa.hibernate.ddl-auto=update`)

## Deployment

Production deployment is to AWS EC2 via Docker images:
1. Build Docker images locally
2. Export with `docker save -o <name>.tar <image>`
3. SCP to EC2: `scp -i dynamicNFC-key.pem <file> ec2-user@3.128.244.219:/home/ec2-user/`
4. Load on EC2: `docker load -i <name>.tar`
5. Restart: `docker-compose up -d`

Production domain: dynamicnfc.ca
