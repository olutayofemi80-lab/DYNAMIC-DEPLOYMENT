# 🚀 Dynamic Deployment Practice App

A full-stack dynamic web application built as a hands-on project for practicing **Docker, Docker Compose, GitHub, Jenkins CI/CD, and AWS EC2 deployment**.

The project demonstrates how a multi-container application can be developed locally, containerized with Docker, tested through Jenkins, and prepared for automated deployment.

---

## 🏗️ Project Architecture

```text
                    Developer
                        │
                        │ git push
                        ▼
                     GitHub
                        │
                        │ Webhook
                        ▼
                     Jenkins
                        │
              ┌─────────┴─────────┐
              │                   │
        Install & Test       Docker Build
              │                   │
              └─────────┬─────────┘
                        │
                        ▼
                  Docker Compose
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
      Frontend       Backend       MongoDB
       Nginx      Node.js/Express   Database
          │             │
          └─────────────┘
                │
                ▼
          Running Web App
```

---

## 📌 Project Overview

The application is a dynamic task management system that allows users to:

* Create tasks
* View tasks
* Mark tasks as completed
* Mark completed tasks as pending
* Delete tasks
* Check backend health status

The application uses a **Node.js and Express backend**, **MongoDB database**, and an **Nginx-powered frontend**.

The entire application is containerized using Docker and orchestrated locally using Docker Compose.

---

## 🛠️ Technologies Used

| Technology     | Purpose                                |
| -------------- | -------------------------------------- |
| HTML           | Frontend structure                     |
| CSS            | Frontend styling                       |
| JavaScript     | Frontend functionality                 |
| Node.js        | Backend runtime                        |
| Express.js     | Backend API                            |
| MongoDB        | Database                               |
| Mongoose       | MongoDB object modeling                |
| Nginx          | Frontend web server and reverse proxy  |
| Docker         | Application containerization           |
| Docker Compose | Multi-container application management |
| Git            | Version control                        |
| GitHub         | Source code repository                 |
| Jenkins        | CI/CD automation                       |
| AWS EC2        | Cloud deployment target                |

---

## 📂 Project Structure

```text
dynamic-deployment-practice/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── test.js
│   └── Dockerfile
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── Jenkinsfile
├── .env.example
├── .gitignore
└── README.md
```

---

# 🐳 Running the Application with Docker

## Prerequisites

Make sure you have the following installed:

* Docker
* Docker Compose
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/olutayofemi80-lab/DYNAMIC-DEPLOYMENT.git
```

Navigate into the project:

```bash
cd DYNAMIC-DEPLOYMENT
```

---

## 2. Build and Start the Application

Run:

```bash
docker compose up --build
```

Docker Compose will create and run three services:

```text
MongoDB
    │
    ▼
Node.js Backend
    │
    ▼
Nginx Frontend
```

---

## 3. Access the Application

The frontend is exposed on port `8081` to avoid conflicts with Jenkins running on port `8080`.

Open:

```text
http://localhost:8081
```

For an AWS EC2 deployment, access the application using:

```text
http://YOUR_EC2_PUBLIC_IP:8081
```

---

## 4. Check Running Containers

Run:

```bash
docker ps
```

You should see:

```text
deployment-practice-frontend
deployment-practice-backend
deployment-practice-mongo
```

---

# 🔌 Backend API

The backend provides the following REST API endpoints.

### Health Check

```http
GET /api/health
```

Example:

```bash
curl http://localhost:3001/api/health
```

---

### Get All Tasks

```http
GET /api/tasks
```

---

### Create a Task

```http
POST /api/tasks
```

Example request body:

```json
{
  "title": "Deploy application to AWS",
  "description": "Deploy the Docker application to an EC2 instance"
}
```

---

### Update a Task

```http
PUT /api/tasks/:id
```

Used to update task information or change the completion status.

---

### Delete a Task

```http
DELETE /api/tasks/:id
```

Deletes a task from MongoDB.

---

# 🔄 Jenkins CI/CD Pipeline

The project includes a `Jenkinsfile` for automating the application workflow.

The pipeline performs the following stages:

```text
GitHub
   │
   ▼
Checkout
   │
   ▼
Install Dependencies
   │
   ▼
Run Tests
   │
   ▼
Build Docker Images
   │
   ▼
Deploy with Docker Compose
```

### Jenkins Pipeline Stages

#### 1. Checkout

Jenkins retrieves the latest source code from GitHub.

#### 2. Install Dependencies

Jenkins enters the backend directory and runs:

```bash
npm ci
```

#### 3. Test

Jenkins runs:

```bash
npm test
```

#### 4. Build Docker Images

Jenkins builds the application images using:

```bash
docker compose build
```

#### 5. Deploy

Jenkins starts the application using:

```bash
docker compose up -d
```

---

# 🔔 GitHub Webhook

The project is configured to support automatic Jenkins builds when new code is pushed to GitHub.

The CI/CD workflow is:

```text
Developer
    │
    │ git push
    ▼
GitHub
    │
    │ Webhook
    ▼
Jenkins
    │
    ▼
Automatic Pipeline
    │
    ├── Checkout
    ├── Install Dependencies
    ├── Test
    ├── Docker Build
    └── Docker Deployment
```

The Jenkins webhook endpoint is:

```text
http://YOUR_JENKINS_PUBLIC_IP:8080/github-webhook/
```

In Jenkins, enable:

```text
GitHub hook trigger for GITScm polling
```

In GitHub, configure the webhook to send push events to Jenkins.

---

# ☁️ AWS EC2 Deployment

The application can be deployed to an AWS EC2 instance running Docker.

The intended deployment architecture is:

```text
GitHub
   │
   ▼
Jenkins on AWS EC2
   │
   ▼
Docker Compose
   │
   ├── Frontend Container
   ├── Backend Container
   └── MongoDB Container
   │
   ▼
Live Application
```

Before accessing the application externally, configure the EC2 Security Group to allow the required ports.

Example:

```text
SSH   → 22
Jenkins → 8080
Application → 8081
```

For a production deployment, it is recommended to use a reverse proxy and expose the application through standard HTTP/HTTPS ports.

---

# 🧪 Current CI/CD Pipeline

The current pipeline includes:

* GitHub source control
* Jenkins automation
* GitHub Webhook integration
* Automated dependency installation
* Automated testing
* Docker image building
* Docker Compose deployment

Security scanning tools such as **Trivy** and code quality analysis using **SonarQube** can be added as future improvements.

---

# 📈 Future Improvements

The project will be extended with:

* [ ] Docker Hub image publishing
* [ ] Automated deployment to AWS EC2
* [ ] Trivy container vulnerability scanning
* [ ] SonarQube code quality analysis
* [ ] Terraform infrastructure provisioning
* [ ] AWS Elastic Load Balancer
* [ ] HTTPS with SSL/TLS
* [ ] Route 53 domain configuration
* [ ] AWS CloudWatch monitoring
* [ ] Docker image versioning and tagging
* [ ] Automated rollback strategy
* [ ] Kubernetes deployment
* [ ] Kubernetes ConfigMaps and Secrets
* [ ] Kubernetes Ingress

---

# 🎯 Learning Objectives

This project was created to gain practical experience with:

* Containerizing full-stack applications
* Building multi-container applications with Docker Compose
* Managing source code with Git and GitHub
* Creating Jenkins CI/CD pipelines
* Automating builds using GitHub Webhooks
* Running automated tests in a CI pipeline
* Deploying applications with Docker
* Preparing applications for AWS EC2 deployment
* Understanding real-world DevOps deployment workflows

---

# 👨‍💻 Author

**Olutayo Oluwafemi Moses**

Software Engineering Student | DevOps & Cloud Engineering Enthusiast

GitHub: `olutayofemi80-lab`

---

## ⭐ Project Status

**Status:** Active Development

The project is currently being used as a hands-on DevOps practice project, with plans to expand the CI/CD pipeline and deploy the application to AWS infrastructure.
