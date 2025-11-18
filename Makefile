.PHONY: help up down restart logs build clean test install

help: ## Show this help message
	@echo "Customizable Calendar - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

down-volumes: ## Stop all services and remove volumes (WARNING: deletes database data)
	docker-compose down -v

restart: ## Restart all services
	docker-compose restart

restart-backend: ## Restart only backend
	docker-compose restart backend

restart-frontend: ## Restart only frontend
	docker-compose restart frontend

logs: ## Show logs for all services
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker-compose logs -f backend

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

logs-db: ## Show database logs
	docker-compose logs -f postgres

build: ## Rebuild all containers
	docker-compose up -d --build

build-backend: ## Rebuild only backend
	docker-compose up -d --build backend

build-frontend: ## Rebuild only frontend
	docker-compose up -d --build frontend

clean: ## Stop containers and remove images
	docker-compose down --rmi all -v

test-backend: ## Run backend tests
	cd backend && npm test

test-frontend: ## Run frontend tests
	cd frontend && npm test

test-all: test-backend test-frontend ## Run all tests

install-backend: ## Install backend dependencies locally
	cd backend && npm install

install-frontend: ## Install frontend dependencies locally
	cd frontend && npm install

install: install-backend install-frontend ## Install all dependencies locally

lint-backend: ## Run backend linter
	cd backend && npm run lint

lint-frontend: ## Run frontend linter
	cd frontend && npm run lint

lint: lint-backend lint-frontend ## Run all linters

status: ## Show status of all containers
	docker-compose ps

shell-backend: ## Open shell in backend container
	docker-compose exec backend sh

shell-frontend: ## Open shell in frontend container
	docker-compose exec frontend sh

shell-db: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U calendar_user -d calendar_db

dev-backend: ## Run backend in development mode (without Docker)
	cd backend && npm run start:dev

dev-frontend: ## Run frontend in development mode (without Docker)
	cd frontend && npm run dev
