# Hastings Direct Academy (HD Academy)

![Build Status](https://img.shields.io/github/actions/workflow/status/sychevmax/hd-academy/deploy-appservice.yml?label=Azure%20Deployment)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![React](https://img.shields.io/badge/React-18-blue)
![Python](https://img.shields.io/badge/Python-Pandas-yellow)

## Overview

**HD Academy** is a full-stack educational project designed to demonstrate technical competencies relevant to the **Pricing Automation Engineer** role at Hastings Direct. It explores the motor insurance domain through data processing, a glossary microservice, and modern web technologies.

### Live Demo
👉 [**hd-academy-web.azurewebsites.net**](https://hd-academy-web.azurewebsites.net/)

## Key Features

1.  **Market Dashboard**: Visualizes cleaned and processed data from the **FCA General Insurance Value Measures** dataset (2022-2024), showcasing trends in acceptance rates, claims frequency, and payouts.
2.  **Insurance Glossary**: A searchable database of insurance terminology, built with a RESTful API and a relational database.
3.  **Ask AI**: An experimental interface for querying insurance domain knowledge.

## Tech Stack

This project mimics a modern enterprise stack:

*   **Frontend**: React.js (SPA)
*   **Backend**: Java 17, Spring Boot 3 (Microservice architecture)
*   **Data Processing**: Python (Pandas) for ETL pipelines
*   **Database**: PostgreSQL (Supabase) - *Migrated from Azure SQL for cost optimization*
*   **CI/CD**: GitHub Actions
*   **Hosting**: Azure App Service

## Project Structure

*   `frontend/`: React.js frontend application. [README](frontend/hda-front/README.md)
*   `backend/`: Java Spring Boot backend service. [README](backend/hda-back/README.md)
*   `data-pipeline/`: Python ETL scripts for FCA data. [README](data-pipeline/hda-data-tools/README.md)

## Deployment

The project is automatically built and deployed via GitHub Actions. The workflow:
1.  Builds the React frontend.
2.  Processes the latest data using Python scripts.
3.  Packages the frontend and data into the Spring Boot JAR.
4.  Deploys the artifact to Azure App Service.

## About the Author

This project was created by **[Your Name/Github Handle]** to showcase skills in:
*   Building scalable web applications.
*   Automating data pipelines.
*   Cloud infrastructure and DevOps.

For more details, visit the [About Page](https://hd-academy-web.azurewebsites.net/about) in the application.
