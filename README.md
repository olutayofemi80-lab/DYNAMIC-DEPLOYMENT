# Dynamic Deployment Platform
## CI/CD • Docker • AWS EC2 • Load Balancing • CloudWatch • Kubernetes/K3s

A production-oriented DevOps project demonstrating how a full-stack application can be containerized, continuously integrated, continuously deployed, monitored, and orchestrated across AWS infrastructure.

The project combines **GitHub, Jenkins, Docker, Docker Hub, AWS EC2, Application Load Balancing, CloudWatch, and K3s Kubernetes** into an automated deployment workflow.

---

## Architecture

```text
                         ┌──────────────┐
                         │    GitHub    │
                         └──────┬───────┘
                                │
                           Git Push
                                │
                                ▼
                         ┌──────────────┐
                         │    Jenkins   │
                         │    CI / CD   │
                         └──────┬───────┘
                                │
                    Build • Test • Tag • Push
                                │
                                ▼
                         ┌──────────────┐
                         │  Docker Hub  │
                         └──────┬───────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │       AWS EC2          │
                    │                        │
                    │  ┌──────────────────┐  │
                    │  │  K3s Kubernetes  │  │
                    │  │                  │  │
                    │  │ Frontend         │  │
                    │  │ Backend          │  │
                    │  │ MongoDB          │  │
                    │  │ Services         │  │
                    │  │ Ingress          │  │
                    │  └──────────────────┘  │
                    └───────────┬────────────┘
                                │
                         Application Traffic
                                │
                                ▼
                       ┌──────────────────┐
                       │ AWS Load Balancer│
                       └──────────────────┘
                                │
                                ▼
                             Users

                    ┌──────────────────────┐
                    │   AWS CloudWatch     │
                    │ Logs • Metrics •     │
                    │ Monitoring • Alarms  │
                    └──────────────────────┘
```

---

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Version Control | Git, GitHub |
| Containerization | Docker, Docker Compose |
| Image Registry | Docker Hub |
| CI/CD | Jenkins |
| Cloud | AWS EC2 |
| Load Balancing | AWS Application Load Balancer |
| Monitoring | AWS CloudWatch |
| Orchestration | Kubernetes / K3s |
| Kubernetes CLI | kubectl |
| Networking | Kubernetes Services & Ingress |
| Configuration | ConfigMaps |
| Secrets | Kubernetes Secrets |

---

## Project Structure

```text
dynamic-deployment/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
│
├── frontend/
│   ├── Dockerfile
│   └── ...
│
├── kubernetes/
│   ├── namespace.yaml
│   ├── secret.yaml
│   ├── configmap.yaml
│   ├── mongo-deployment.yaml
│   ├── mongo-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── ingress.yaml
│
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## CI/CD Pipeline

Jenkins automates the application delivery process from source code to Kubernetes.

```text
GitHub
  ↓
Checkout
  ↓
Install Dependencies
  ↓
Run Tests
  ↓
Build Docker Images
  ↓
Tag Images
  ↓
Push to Docker Hub
  ↓
Connect to K3s
  ↓
Apply Kubernetes Manifests
  ↓
Update Application Images
  ↓
Verify Rollout
  ↓
Deployment Complete
```

### Docker Images

```text
femzytr/dynamicdeployment-backend
femzytr/dynamicdeployment-frontend
```

Images are tagged with Jenkins build numbers to provide version traceability and support future rollback strategies.

Example:

```text
dynamicdeployment-backend:15
dynamicdeployment-frontend:15
```

---

## Kubernetes / K3s Deployment

K3s was selected as a lightweight Kubernetes distribution suitable for the AWS EC2 environment and free-tier resource constraints.

The application is deployed in:

```text
dynamic-deployment
```

### Kubernetes Resources

- Namespace
- Deployments
- Services
- ConfigMap
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

Jenkins is configured with the K3s kubeconfig and can remotely execute Kubernetes deployments.

---

## AWS Load Balancing

An AWS Application Load Balancer is used to provide a stable entry point for application traffic and distribute requests to the application infrastructure.

The load-balancing layer provides:

- Centralized application access
- Traffic distribution
- Health checks
- Integration with AWS networking
- A foundation for HTTPS/TLS
- Improved availability and scalability

The application can therefore follow the architecture:

```text
Internet
   ↓
AWS Application Load Balancer
   ↓
EC2 / Kubernetes Application
   ↓
Frontend / Backend
```

---

## AWS CloudWatch Monitoring

AWS CloudWatch is used as the monitoring layer for the AWS infrastructure.

Monitoring includes:

- EC2 CPU utilization
- Network traffic
- Instance health
- Application infrastructure metrics
- CloudWatch alarms
- Dashboard-based monitoring

The monitoring architecture is:

```text
AWS EC2
   │
   ├── CPU Metrics
   ├── Network Metrics
   └── Instance Metrics
            │
            ▼
       CloudWatch
            │
       ┌────┴────┐
       ▼         ▼
   Dashboard   Alarms
```

CloudWatch provides visibility into infrastructure performance and helps identify potential resource or availability issues.

---

## Security

Security considerations implemented during the project include:

- Jenkins Credentials for Docker Hub authentication
- Kubernetes Secrets for sensitive application configuration
- AWS Security Groups for controlled network access
- Restricted Kubernetes API access
- Dedicated Kubernetes namespace
- Separation of application configuration from container images

For production environments, sensitive credentials should be managed with services such as **AWS Secrets Manager** rather than storing secrets directly in source control.

---

# Troubleshooting & Challenges

## MongoDB Authentication Failure

### Problem

The backend initially failed to authenticate with MongoDB.

```text
MongoDB connection failed: Authentication failed.
```

### Solution

The MongoDB credentials, Kubernetes Secret, and backend connection configuration were reviewed and aligned.

The backend subsequently connected successfully:

```text
Connected to MongoDB
Backend running on port 3001
```

---

## MongoDB API Authentication Error

### Problem

The `/api/tasks` endpoint initially returned:

```text
Command find requires authentication
```

### Solution

The MongoDB authentication configuration was corrected and the backend was redeployed.

The endpoint subsequently returned:

```text
HTTP/1.1 200 OK
[]
```

confirming successful backend-to-database communication.

---

## Kubernetes Ingress Connectivity

### Problem

The Kubernetes Ingress address was initially unreachable during local Minikube testing.

### Solution

The Ingress controller logs, Services, Pods, and Endpoints were inspected to identify the routing problem. Service endpoints were verified and the application was successfully exposed through the appropriate local forwarding mechanism.

---

## Jenkins → Kubernetes Connectivity

### Problem

Jenkins initially could not deploy directly to the Kubernetes environment.

### Solution

K3s was deployed on AWS EC2 and Jenkins was configured with the K3s kubeconfig.

Connectivity was verified using:

```bash
sudo -u jenkins kubectl \
--kubeconfig=/var/lib/jenkins/.kube/config \
get nodes
```

The K3s control-plane node returned:

```text
Ready
```

confirming successful Jenkins-to-Kubernetes communication.

---

## Kubernetes API Security

The K3s Kubernetes API runs on:

```text
6443
```

AWS Security Groups were configured to permit the required Kubernetes API traffic from the Jenkins infrastructure rather than unnecessarily exposing the API publicly.

---

## Docker Image Versioning

### Problem

Using only the `latest` tag makes it difficult to identify which application version is deployed.

### Solution

Jenkins uses the build number as the Docker image version.

```text
Jenkins Build 15
       ↓
backend:15
frontend:15
       ↓
Kubernetes Deployment
```

This provides deployment traceability and creates a foundation for automated rollback.

---

# Deployment Verification

Kubernetes resources can be verified with:

```bash
kubectl get nodes
kubectl get deployments -n dynamic-deployment
kubectl get pods -n dynamic-deployment
kubectl get services -n dynamic-deployment
kubectl get ingress -n dynamic-deployment
```

Rollout status:

```bash
kubectl rollout status deployment/backend -n dynamic-deployment
kubectl rollout status deployment/frontend -n dynamic-deployment
```

Backend health check:

```text
/api/health
```

Tasks API:

```text
/api/tasks
```

---

# Key DevOps Outcomes

This project demonstrates practical experience with:

- Automated CI/CD pipelines
- Docker containerization
- Docker image versioning
- Docker Hub image publishing
- Jenkins automation
- AWS EC2 infrastructure
- AWS Application Load Balancing
- AWS CloudWatch monitoring
- Kubernetes orchestration
- K3s cluster administration
- Kubernetes Services and Ingress
- ConfigMaps and Secrets
- Remote Jenkins-to-Kubernetes deployment
- Application and infrastructure troubleshooting
- Secure cloud networking

---

# Future Improvements

Planned production-level improvements include:

- Terraform infrastructure as code
- HTTPS/TLS certificates
- Route 53 DNS
- AWS Secrets Manager
- Persistent MongoDB storage
- Kubernetes RBAC
- Network Policies
- Horizontal Pod Autoscaling
- Trivy vulnerability scanning
- SonarQube code-quality analysis
- Prometheus and Grafana monitoring
- Automated rollback
- Blue/Green or Canary deployments
- Migration to Amazon EKS

---

# Final Result

The project successfully implements an automated deployment workflow:

```text
GitHub
   ↓
Jenkins
   ↓
Docker Build & Test
   ↓
Docker Hub
   ↓
K3s on AWS EC2
   ↓
Kubernetes Deployment
   ↓
Load Balancer
   ↓
Application Users

              +

          CloudWatch
              ↓
       Monitoring & Alarms
```

The result is a practical DevOps platform that demonstrates the complete path from **source code → CI/CD → container registry → cloud infrastructure → Kubernetes deployment → load balancing → monitoring**.

---

## Author

**Oluwafemi Olutayo**

Software Engineer | DevOps & Cloud Engineer

`Technologies Used: Git` `GitHub` `Docker` `Jenkins` `AWS EC2` `Load Balancer` `CloudWatch` `Kubernetes` `K3s` `Docker Hub` `Node.js` `Express` `MongoDB`
