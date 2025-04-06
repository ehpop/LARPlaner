# LARPlaner

App for planing and conducting LARP events

## Tech Stack

**Frontend:**

- Next.js
- TypeScript
- Tailwind CSS

**Backend:**

- Spring Boot (Java)
- (Assuming Maven or Gradle for build)

**Infrastructure:**

- Docker
- Nginx (based on directory structure)

## Getting Started

### Prerequisites

- Docker and Docker Compose installed: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

### Running the Application

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd LARPlaner
    ```

2.  **Environment Variables:**

    - Ensure you have a `.env` file configured in the root directory based on `.env.example` (if one exists) or the project's requirements.

3.  **Build and Run with Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command will build the Docker images for the frontend and backend (if Dockerfiles exist and are configured in `compose.yaml`) and start the services defined in your `compose.yaml` file.

4.  **Access the application:**
    - The application should typically be accessible at `http://localhost:80` (if Nginx is configured as a reverse proxy) or directly via the frontend's port (e.g., `http://localhost:3000`). Check your `compose.yaml` and Nginx configuration for the exact ports.

## Project Structure

- `frontend-next/`: Contains the Next.js frontend application.
- `backend-spring/`: Contains the Spring Boot backend application.
- `nginx/`: Contains Nginx configuration files (if used).
- `compose.yaml`: Docker Compose file defining the services, networks, and volumes.
- `.env`: Environment variables (should not be committed to Git).
- `README.md`: This file.

## Contributing

(Add guidelines for contributing to the project if applicable)

## License

(Specify the project license if applicable)
