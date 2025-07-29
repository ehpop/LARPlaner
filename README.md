# LARPlaner

App for planing and conducting LARP events

## Tech Stack

**Frontend:**

- Next.js
- TypeScript
- Tailwind CSS
- React
- Swiper
- HeroUI

**Backend:**

- Spring Boot (Java)
- Maven

**Infrastructure:**

- Docker
- Nginx

## Getting Started

### Prerequisites

- Docker and Docker Compose installed: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

### Running the Application

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd LARPlaner
   ```

2. **Environment Variables:**

    - Create a `.env` file in the root directory. You can use the `.env.example` file as a template if it exists.

3. **Build and Run with Docker Compose:**

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images for the frontend and backend and start all the services.

4. **Access the application:**
    - The application will be accessible at `http://localhost:80`.

## Project Structure

- `frontend-next/`: Contains the Next.js frontend application.
- `backend-spring/`: Contains the Spring Boot backend application.
- `nginx/`: Contains Nginx configuration files.
- `compose.yaml`: Docker Compose file defining the services, networks, and volumes.
- `.env`: Environment variables (not committed to Git).
- `README.md`: This file.

## Contributing

(Add guidelines for contributing to the project if applicable)

## License

(Specify the project license if applicable)
