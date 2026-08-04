# Dynamic Deployment Practice App

A beginner-friendly dynamic web application for practicing:

- Git & GitHub
- Docker
- Docker Compose
- Jenkins CI/CD
- AWS EC2 deployment
- MongoDB
- Environment variables

## Architecture

Browser -> Frontend (Nginx) -> Backend (Node.js/Express) -> MongoDB

## Run locally with Docker Compose

```bash
docker compose up --build
```

Open:
http://localhost:8080

Backend health check:
http://localhost:3001/api/health

## Run without Docker

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
Open `frontend/index.html` with a browser, or serve the frontend folder using a static server.

## API endpoints

- GET `/api/health`
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

## Jenkins practice

The included Jenkinsfile demonstrates:

1. Checkout source code
2. Install backend dependencies
3. Run tests
4. Build Docker images
5. Start the application with Docker Compose

You can extend it to:

- Push images to Docker Hub
- Deploy to AWS EC2
- Add SSH deployment
- Add rollback logic
- Add Trivy
- Add SonarQube

## Important

Before production deployment, replace development secrets and configure a secure MongoDB connection.
