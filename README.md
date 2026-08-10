# 🚀 Dynamic Deployment — CI/CD & Kubernetes

A full-stack DevOps project demonstrating automated application deployment using **GitHub, Jenkins, Docker, Docker Hub, AWS EC2, and K3s Kubernetes**.

## 🏗️ Architecture

```text
GitHub → Jenkins → Docker → Docker Hub → K3s on AWS EC2
                                      ↓
                         Frontend + Backend + MongoDB
```

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Containerization:** Docker, Docker Compose
- **CI/CD:** Jenkins
- **Registry:** Docker Hub
- **Cloud:** AWS EC2
- **Orchestration:** Kubernetes / K3s
- **Networking:** Kubernetes Services & Ingress
- **Configuration:** ConfigMaps & Secrets
- **Version Control:** Git & GitHub

## 🔄 CI/CD Pipeline

Jenkins automates the deployment workflow:

1. Checkout source code from GitHub
2. Install backend dependencies
3. Run tests
4. Build Docker images
5. Tag images using Jenkins build numbers
6. Push images to Docker Hub
7. Connect to the K3s cluster
8. Deploy/update Kubernetes resources
9. Verify application rollouts
10. Clean up unused Docker images

### Docker Images

```text
femzytr/dynamicdeployment-backend
femzytr/dynamicdeployment-frontend
```

Images are versioned using Jenkins build numbers for deployment traceability.

## ☸️ Kubernetes Deployment

The application is deployed in the `dynamic-deployment` namespace using:

- Deployments
- Services
- ConfigMaps
- Secrets
- Ingress

Application components:

```text
Frontend
   ↓
Backend
   ↓
MongoDB
```

Jenkins communicates with the remote K3s cluster through the Kubernetes API and automatically deploys new application versions.

## 🐛 Key Challenges & Solutions

### MongoDB Authentication

The backend initially returned authentication errors when accessing MongoDB.

**Solution:** Aligned MongoDB credentials, Kubernetes Secrets, and the backend connection configuration.

### Kubernetes Ingress Connectivity

Ingress was initially inaccessible during local Kubernetes testing.

**Solution:** Investigated Ingress controller logs, Services, and Endpoints and corrected the application routing configuration.

### Jenkins → Kubernetes Connectivity

Jenkins initially could not deploy to the Kubernetes environment.

**Solution:** Migrated the deployment environment to **K3s on AWS EC2**, configured Jenkins with the K3s kubeconfig, and secured Kubernetes API access through AWS Security Groups.

### Docker Image Versioning

Using only `latest` made deployments difficult to track.

**Solution:** Jenkins automatically tags images using the build number, allowing specific application versions to be identified and deployed.

## 🔐 Security

- Jenkins Credentials used for Docker Hub authentication
- Kubernetes Secrets used for sensitive configuration
- AWS Security Groups used to restrict Kubernetes API access
- Dedicated Kubernetes namespace for application resources

> Production environments should use services such as AWS Secrets Manager for sensitive credentials.

## 📈 Future Improvements

- Terraform infrastructure automation
- Trivy vulnerability scanning
- SonarQube code analysis
- AWS CloudWatch monitoring
- HTTPS/TLS
- Persistent storage for MongoDB
- Kubernetes autoscaling
- Automated rollback
- Prometheus & Grafana
- AWS EKS migration

## 🎯 Key Outcome

Successfully implemented an automated **GitHub → Jenkins → Docker Hub → K3s Kubernetes** deployment pipeline on AWS EC2, including containerization, automated testing, image versioning, Kubernetes orchestration, configuration management, secrets management, and deployment verification.

## 👨‍💻 Author

**Oluwafemi Olutayo**  
Software Engineer | DevOps & Cloud Engineer

**Technologies:** `Git` `GitHub` `Docker` `Jenkins` `AWS` `Kubernetes` `K3s` `Docker Hub` `Node.js` `Express` `MongoDB`
