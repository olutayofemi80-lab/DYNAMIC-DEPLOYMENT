pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "femzytr/dynamicdeployment-backend"
        FRONTEND_IMAGE = "femzytr/dynamicdeployment-frontend"

        IMAGE_TAG = "${BUILD_NUMBER}"

        KUBECONFIG = "/var/lib/jenkins/.kube/config"
        K8S_NAMESPACE = "dynamic-deployment"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Check Kubernetes Connection') {
            steps {
                sh '''
                    echo "Checking Kubernetes connection..."
                    kubectl get nodes
                    kubectl get namespaces
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                    docker build \
                        -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        -t ${BACKEND_IMAGE}:latest \
                        ./backend

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
                            -u "$DOCKER_USERNAME" \
                            --password-stdin
                    '''
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh """
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest

                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest
                """
            }
        }

        stage('Create Kubernetes Namespace') {
            steps {
                sh '''
                    kubectl apply -f kubernetes/namespace.yaml
                '''
            }
        }

        stage('Apply Kubernetes Configuration') {
            steps {
                sh '''
                    kubectl apply -f kubernetes/secret.yaml -n ${K8S_NAMESPACE}
                    kubectl apply -f kubernetes/configmap.yaml -n ${K8S_NAMESPACE}
                '''
            }
        }

        stage('Deploy MongoDB') {
            steps {
                sh '''
                    kubectl apply -f kubernetes/mongo-deployment.yaml -n ${K8S_NAMESPACE}
                    kubectl apply -f kubernetes/mongo-service.yaml -n ${K8S_NAMESPACE}
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh """
                    kubectl apply -f kubernetes/backend-deployment.yaml -n ${K8S_NAMESPACE}
                    kubectl apply -f kubernetes/backend-service.yaml -n ${K8S_NAMESPACE}

                    kubectl set image deployment/backend \
                        backend=${BACKEND_IMAGE}:${IMAGE_TAG} \
                        -n ${K8S_NAMESPACE}
                """
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh """
                    kubectl apply -f kubernetes/frontend-deployment.yaml -n ${K8S_NAMESPACE}
                    kubectl apply -f kubernetes/frontend-service.yaml -n ${K8S_NAMESPACE}

                    kubectl set image deployment/frontend \
                        frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        -n ${K8S_NAMESPACE}
                """
            }
        }

        stage('Deploy Ingress') {
            steps {
                sh '''
                    kubectl apply -f kubernetes/ingress.yaml -n ${K8S_NAMESPACE}
                '''
            }
        }

        stage('Wait for Deployments') {
            steps {
                sh '''
                    echo "Waiting for MongoDB..."
                    kubectl rollout status deployment/mongo \
                        -n ${K8S_NAMESPACE} \
                        --timeout=180s

                    echo "Waiting for Backend..."
                    kubectl rollout status deployment/backend \
                        -n ${K8S_NAMESPACE} \
                        --timeout=180s

                    echo "Waiting for Frontend..."
                    kubectl rollout status deployment/frontend \
                        -n ${K8S_NAMESPACE} \
                        --timeout=180s
                '''
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                sh '''
                    echo "===== DEPLOYMENTS ====="
                    kubectl get deployments -n ${K8S_NAMESPACE}

                    echo "===== PODS ====="
                    kubectl get pods -n ${K8S_NAMESPACE}

                    echo "===== SERVICES ====="
                    kubectl get services -n ${K8S_NAMESPACE}

                    echo "===== INGRESS ====="
                    kubectl get ingress -n ${K8S_NAMESPACE}
                '''
            }
        }

        stage('Cleanup Docker Images') {
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
            ==========================================
            CI/CD PIPELINE COMPLETED SUCCESSFULLY
            ==========================================

            Backend Image:
            ${BACKEND_IMAGE}:${IMAGE_TAG}

            Frontend Image:
            ${FRONTEND_IMAGE}:${IMAGE_TAG}

            Kubernetes Namespace:
            ${K8S_NAMESPACE}

            ==========================================
            """
        }

        failure {
            echo """
            ==========================================
            PIPELINE FAILED
            ==========================================

            Check the failed stage above.

            ==========================================
            """
        }

        always {
            sh 'docker logout || true'
        }
    }
}