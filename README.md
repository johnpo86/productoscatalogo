# Products Project - Dockerized Stack

This project is a technical test consisting of a Node.js backend and a React/Vite frontend, fully dockerized with SQL Server.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

To start the entire stack (Database, Backend, and Frontend), run:

```bash
docker-compose up --build
```

The services will be available at:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **Swagger Documentation**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

## Project Structure

- `backend/`: Node.js/Express API with SQL Server integration and Swagger.
- `frontend/`: Vite + React + Redux Toolkit + Ant Design.
- `docker-compose.yml`: Orchestrates the DB, Backend, and Frontend.

## Environment Variables

The backend uses the following environment variables (configured in `docker-compose.yml`):

- `DB_USER`: sa
- `DB_PASSWORD`: Password123!
- `DB_SERVER`: db
- `DB_NAME`: master
- `PORT`: 4000

## API Documentation

The API is documented using Swagger. You can explore the available endpoints by visiting `http://localhost:4000/api-docs` once the containers are running.
