# Local automation for HD Academy portal (Spring Boot + React)
# Machine-independent: uses relative paths by default; override via env vars or .env file.
# Example overrides:
#   BACKEND_DIR=../../backend/hda-back FRONTEND_DIR=. make dev

# Load environment variables from .env if present
# (docker-compose reads .env automatically; this makes Makefile consistent)
ifneq (,$(wildcard ./.env))
include .env
endif
.EXPORT_ALL_VARIABLES:

# Default Spring profile
SPRING_PROFILE ?= dev

# Project paths (relative to this Makefile by default)
FRONTEND_DIR ?= .
BACKEND_DIR ?= ../../backend/hda-back

# Ports
PORT_PROXY ?= 8080
PORT_SPRING ?= 8081
PORT_UI ?= 3000

.PHONY: help dev serve-ui build-ui start-proxy stop-proxy clean

help:
	@echo "Targets:"
	@echo "  make dev        - Dev/HMR on :$(PORT_PROXY) (Node proxy + Spring :$(PORT_SPRING) + CRA :$(PORT_UI))"
	@echo "  make serve-ui   - Build UI, serve from Spring on :8080 (prod-like)"
	@echo "  make build-ui   - Build React app"
	@echo "\nVariables (override via env or .env): BACKEND_DIR=$(BACKEND_DIR), FRONTEND_DIR=$(FRONTEND_DIR)"

# Dev/HMR: run Node proxy, UI, and Spring concurrently. Stop with Ctrl+C.
# Requires: Java & Maven; Node & npm.
dev:
	# Start Node reverse proxy on :$(PORT_PROXY)
	cd $(FRONTEND_DIR) && PORT_PROXY=$(PORT_PROXY) node dev-proxy.js & \
	PROXY_PID=$$!; \
	# Start UI on :$(PORT_UI)
	cd $(FRONTEND_DIR) && npm start & \
	UI_PID=$$!; \
	# Start Spring on :$(PORT_SPRING)
	cd $(BACKEND_DIR) && SPRING_PROFILES_ACTIVE=$(SPRING_PROFILE) ./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=$(PORT_SPRING) & \
	SPRING_PID=$$!; \
	# Wait all
	wait

# Build the React UI
build-ui:
	cd $(FRONTEND_DIR) && npm ci && npm run build

# Build UI and run Spring to serve static build on :8080 (no proxy needed)
serve-ui: build-ui
	cd $(BACKEND_DIR) && ./mvnw spring-boot:run

clean:
	cd $(FRONTEND_DIR) && rm -rf build node_modules
