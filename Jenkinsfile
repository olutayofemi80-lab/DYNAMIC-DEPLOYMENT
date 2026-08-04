pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'femzytr/dynamicdeployment-backend'
        FRONTEND_IMAGE = 'femzytr/dynamicdeployment-frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"
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

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Images') {
    steps {
        sh '''
            docker build \
              -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
              -t ${BACKEND_IMAGE}:latest \
              ./backend

            docker build \
              -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
              -t ${FRONTEND_IMAGE}:latest \
              ./frontend
        '''
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
        sh '''
            docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
            docker push ${BACKEND_IMAGE}:latest

            docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
            docker push ${FRONTEND_IMAGE}:latest
        '''
    }
}
        stage('Deploy') {
    steps {
        sh '''
            docker compose pull
            docker compose up -d
        '''
    }
}
        
    }

    post {
        always {
            sh 'docker logout || true'
        }

        success {
            echo "Docker images pushed successfully!"
            echo "Backend: ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo "Frontend: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
        }
    }
}