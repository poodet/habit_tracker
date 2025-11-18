# Customizable Calendar Application

A flexible web application that allows users to create custom object types and track events on a calendar. Users can define their own data structures and visualize patterns over time with statistics and charts.

## 🎯 Project Goals

This application enables users to:
- **Define custom objects** with their own attributes (e.g., mood tracker, meal log, plant watering schedule)
- **Link objects to calendar events** to track occurrences over time
- **Visualize data** with charts and statistics
- **Share calendars** with other users (future feature)
- **Set custom reminders** based on tracked data (future feature)

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 18** - UI library
- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **D3.js, Recharts, Chart.js** - Data visualization libraries
- **Jest & React Testing Library** - Testing framework

#### Backend
- **Node.js** - JavaScript runtime
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **TypeORM** - ORM for database management
- **PostgreSQL** - Relational database
- **Redis** - Caching and session storage
- **Passport.js & JWT** - Authentication
- **Jest & Supertest** - Testing framework
- **Swagger** - API documentation

#### DevOps
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **ESLint & Prettier** - Code quality

### Project Structure

```
projet-web/
├── backend/                  # NestJS backend application
│   ├── src/
│   │   ├── auth/            # Authentication module (JWT, Passport)
│   │   ├── users/           # User management
│   │   ├── object-definitions/  # Custom object schemas
│   │   ├── calendar-events/ # Calendar events
│   │   ├── app.module.ts    # Main application module
│   │   └── main.ts          # Application entry point
│   ├── test/                # E2E tests
│   ├── Dockerfile           # Backend Docker configuration
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # Next.js frontend application
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   │   └── api.ts          # API client
│   ├── types/              # TypeScript types
│   ├── Dockerfile          # Frontend Docker configuration
│   ├── package.json
│   └── tsconfig.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # GitHub Actions workflow
│
├── docker-compose.yml       # Docker Compose configuration
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine
- **Git** for version control
- **Node.js 20+** (optional, for local development without Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd "projet web"
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and update the values if needed:
   - `JWT_SECRET` - Change to a secure random string for production
   - `POSTGRES_PASSWORD` - Change to a secure password for production

3. **Start the application with Docker**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Redis on port 6379
   - Backend API on port 3001
   - Frontend application on port 3000

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - API Documentation (Swagger): http://localhost:3001/api/docs

### Development Without Docker

#### Backend Development

```bash
cd backend
npm install
npm run start:dev
```

Make sure PostgreSQL and Redis are running locally.

#### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:cov      # Run tests with coverage
npm run test:e2e      # Run end-to-end tests
```

### Frontend Tests

```bash
cd frontend
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:3001/api/docs to see the interactive Swagger documentation.

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

#### Object Definitions
- `GET /api/object-definitions` - Get all custom object definitions
- `POST /api/object-definitions` - Create a new object definition
- `GET /api/object-definitions/:id` - Get a specific object definition
- `PATCH /api/object-definitions/:id` - Update an object definition
- `DELETE /api/object-definitions/:id` - Delete an object definition

#### Calendar Events
- `GET /api/calendar-events` - Get all calendar events (with optional date filters)
- `POST /api/calendar-events` - Create a new calendar event
- `GET /api/calendar-events/:id` - Get a specific event
- `PATCH /api/calendar-events/:id` - Update an event
- `DELETE /api/calendar-events/:id` - Delete an event

## 🛠️ Code Quality & CI/CD

### Linting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Formatting

```bash
# Backend
cd backend
npm run format

# Frontend - uses ESLint
cd frontend
npm run lint
```

### CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1. **On every push/PR**:
   - Runs linting
   - Runs all tests
   - Checks test coverage
   - Builds the applications

2. **On push to main branch**:
   - Builds Docker images
   - Pushes to Docker Hub (requires configuration)

## 🗄️ Database Schema

### Users
- `id` (UUID, PK)
- `email` (unique)
- `password` (hashed)
- `firstName`, `lastName`
- `createdAt`, `updatedAt`

### Object Definitions
- `id` (UUID, PK)
- `name` - Name of the object type (e.g., "Humeur", "Repas")
- `description` - Optional description
- `schema` (JSONB) - JSON Schema defining the structure
- `icon`, `color` - Visual customization
- `userId` (FK to Users)
- `createdAt`, `updatedAt`

### Calendar Events
- `id` (UUID, PK)
- `title` - Event title
- `description` - Optional description
- `startDate`, `endDate` - Event dates
- `allDay` - Boolean for all-day events
- `data` (JSONB) - Custom data matching the object definition schema
- `userId` (FK to Users)
- `objectDefinitionId` (FK to Object Definitions)
- `createdAt`, `updatedAt`

## 📝 Example Use Cases

### 1. Mood Tracking
Create an object definition:
```json
{
  "name": "Humeur",
  "schema": {
    "type": "object",
    "properties": {
      "mood": { "type": "string", "enum": ["happy", "sad", "neutral", "angry"] },
      "intensity": { "type": "number", "minimum": 1, "maximum": 10 },
      "notes": { "type": "string" }
    },
    "required": ["mood", "intensity"]
  }
}
```

### 2. Meal Tracking
```json
{
  "name": "Repas",
  "schema": {
    "type": "object",
    "properties": {
      "foods": { "type": "array", "items": { "type": "string" } },
      "hasGluten": { "type": "boolean" },
      "symptoms": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["foods"]
  }
}
```

### 3. Plant Watering
```json
{
  "name": "Arrosage Plante",
  "schema": {
    "type": "object",
    "properties": {
      "plantName": { "type": "string" },
      "waterAmount": { "type": "number" },
      "notes": { "type": "string" }
    },
    "required": ["plantName"]
  }
}
```

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation with class-validator
- CORS enabled for frontend communication
- Environment variables for sensitive data

## 🚧 Future Features

- [ ] Shared calendars for multiple users
- [ ] Custom reminder system
- [ ] Advanced statistics and data visualization
- [ ] Data export (CSV, JSON)
- [ ] Mobile-responsive design improvements
- [ ] PWA support for offline access
- [ ] Recurring events
- [ ] Calendar templates

## 📄 License

MIT

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## 📧 Contact

For questions or feedback, please open an issue on GitHub.
