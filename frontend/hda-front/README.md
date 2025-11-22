# HD Academy Frontend

This directory contains the React.js frontend application for the Hastings Direct Academy project.

## Overview

The frontend provides the user interface for:
*   **Market Dashboard**: Visualizing insurance market data using charts.
*   **Glossary**: A searchable dictionary of insurance terms.
*   **Ask AI**: An interface to query the insurance domain knowledge base.
*   **About**: Project information and technical details.

## Tech Stack

*   **Framework**: React.js (Create React App)
*   **Styling**: CSS Modules / Standard CSS
*   **Routing**: React Router 6
*   **HTTP Client**: Axios (implied)
*   **Testing**: Jest / React Testing Library

## Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend/hda-front
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Running Locally

To start the development server:

```bash
npm start
```

The application will run at `http://localhost:3000`.
*Note: To fully function, the backend service should be running on port 8080, or you may need to configure a proxy.*

## Build

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory. In the CI/CD pipeline, these artifacts are copied to the backend's static resources folder to be served by Spring Boot.
