# HD Academy Backend - Glossary Service

This is the backend service for the Hastings Direct Academy project. It provides a REST API for the insurance glossary and serves the frontend static assets.

## Tech Stack

*   **Java**: 17 (LTS)
*   **Framework**: Spring Boot 3.2.0
*   **Database**: PostgreSQL (Hosted on Supabase)
*   **Build Tool**: Maven
*   **Documentation**: OpenAPI / Swagger UI

## Architecture

The application is designed as a service that:
1.  Exposes REST endpoints for the Insurance Glossary (CRUD operations).
2.  Serves the React Frontend (bundled).
3.  Serves static data (JSON) processed by the data pipeline.

### Database Migration

Originally, this project used **Azure SQL Database**. However, to optimize costs for this educational project, the database was migrated to **Supabase (PostgreSQL)**. This transition involved:
*   Updating JDBC drivers and Hibernate dialect in `pom.xml` and `application.properties`.
*   Migrating schema and data from T-SQL to PL/pgSQL compatible formats.
*   Updating environment configuration for connection strings.

## Getting Started

### Prerequisites

*   Java 17 SDK
*   Maven (wrapper included)
*   PostgreSQL database (or connection string to Supabase)

### Environment Variables

Create a `.env` file in the root of `backend/hda-back/` (or set system env vars). All variables provided in .env.example file.

### Running Locally

```bash
# From backend/hda-back directory
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8081`.
Swagger UI is available at `http://localhost:8081/swagger-ui.html`.
Web app will be available at `http://localhost:8080` with reverse proxy runned with fronted.

### Building for Production

The build process (handled by GitHub Actions) does the following:
1.  Builds the React Frontend.
2.  Copies frontend artifacts to `src/main/resources/static`.
3.  Copies processed data to `src/main/resources/data`.
4.  Packages the JAR.