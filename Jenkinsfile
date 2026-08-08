pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = "femzytr/dynamicdeployment-backend"
        FRONTEND_IMAGE = "femzytr/dynamicdeployment-frontend"
        IMAGE_TAG      = "${BUILD_NUMBER}"
        K8S_NAMESPACE  = "dynamic-deployment"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo 'Installing backend dependencies...'

                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running backend tests...'

                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Check Docker') {
            steps {
                sh '''
                    echo "======================================"
                    echo "Checking Docker"
                    echo "======================================"

                    docker --version
                    docker info
                '''
            }
        }

        stage('Check Kubernetes') {
            steps {
                sh '''
                    echo "======================================"
                    echo "Checking Kubernetes"
                    echo "======================================"

                    kubectl version --client

                    echo "Kubernetes Nodes:"
                    kubectl get nodes
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh """
                    echo "Building backend image..."

                    docker build \
                        -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        -t ${BACKEND_IMAGE}:latest \
                        ./backend
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh """
                    echo "Building frontend image..."

                    docker build \
                        -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        -t ${FRONTEND_IMAGE}:latest \
                        ./frontend
                """
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                            --username "$DOCKER_USERNAME" \
                            --password-stdin
                    '''
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                sh """
                    echo "Pushing backend image..."

                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest
                """
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh """
                    echo "Pushing frontend image..."

                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest
                """
            }
        }

        stage('Deploy Kubernetes Resources') {
            steps {
                sh """
                    echo "======================================"
                    echo "Deploying Kubernetes Resources"
                    echo "======================================"

                    kubectl apply -f kubernetes/namespace.yml

                    kubectl apply -f kubernetes/secret.yml

                    kubectl apply -f kubernetes/mongo-deployment.yml
                    kubectl apply -f kubernetes/mongo-service.yml

                    kubectl apply -f kubernetes/backend-deployment.yml
                    kubectl apply -f kubernetes/backend-service.yml

                    kubectl apply -f kubernetes/frontend-deployment.yml
                    kubectl apply -f kubernetes/frontend-service.yml

                    kubectl apply -f kubernetes/ingress.yml
                """
            }
        }

        stage('Update Backend Image') {
            steps {
                sh """
                    echo "Updating backend to:"
                    echo "${BACKEND_IMAGE}:${IMAGE_TAG}"

                    kubectl set image deployment/backend \
                        backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
                        -n ${K8S_NAMESPACE}
                """
            }
        }

        stage('Update Frontend Image') {
            steps {
                sh """
                    echo "Updating frontend to:"
                    echo "${FRONTEND_IMAGE}:${IMAGE_TAG}"

                    kubectl set image deployment/frontend \
                        frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        -n ${K8S_NAMESPACE}
                """
            }
        }

        stage('Wait for Backend Rollout') {
            steps {
                sh """
                    echo "Waiting for backend rollout..."

                    kubectl rollout status deployment/backend \
                        -n ${K8S_NAMESPACE} \
                        --timeout=180s
                """
            }
        }

        stage('Wait for Frontend Rollout') {
            steps {
                sh """
                    echo "Waiting for frontend rollout..."

                    kubectl rollout status deployment/frontend \
                        -n ${K8S_NAMESPACE} \
                        --timeout=180s
                """
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                sh """
                    echo "======================================"
                    echo "DEPLOYMENTS"
                    echo "======================================"

                    kubectl get deployments \
                        -n ${K8S_NAMESPACE}

                    echo "======================================"
                    echo "PODS"
                    echo "======================================"

                    kubectl get pods \
                        -n ${K8S_NAMESPACE}

                    echo "======================================"
                    echo "SERVICES"
                    echo "======================================"

                    kubectl get services \
                        -n ${K8S_NAMESPACE}

                    echo "======================================"
                    echo "INGRESS"
                    echo "======================================"

                    kubectl get ingress \
                        -n ${K8S_NAMESPACE}
                """
            }
        }

        stage('Cleanup Docker') {
            steps {
                sh '''
                    docker image prune -f
                '''
            }
        }
    }

    post {

        success {
            echo """
=============================================
       CI/CD PIPELINE SUCCESSFUL
=============================================

Backend Image:
${BACKEND_IMAGE}:${IMAGE_TAG}

Frontend Image:
${FRONTEND_IMAGE}:${IMAGE_TAG}

Kubernetes Namespace:
${K8S_NAMESPACE}

=============================================
"""
        }

        failure {
            echo """
=============================================
       CI/CD PIPELINE FAILED
=============================================

Check the Jenkins Console Output
for the failed stage.

=============================================
"""
        }

        always {
            sh 'docker logout || true'
        }
    }
}