# Architecture & Technical Decisions

## Overview

This document explains the architectural choices and technical decisions made in this project.

## Architecture Pattern

### Backend: Layered Architecture with NestJS

```
┌─────────────────────────────────────────┐
│           Controllers Layer             │  ← HTTP Routes, Request/Response
├─────────────────────────────────────────┤
│            Services Layer               │  ← Business Logic
├─────────────────────────────────────────┤
│         Repositories Layer              │  ← Data Access (TypeORM)
├─────────────────────────────────────────┤
│            Database Layer               │  ← PostgreSQL
└─────────────────────────────────────────┘
```

**Why NestJS?**
- Built-in dependency injection
- Modular architecture (easy to scale)
- TypeScript-first approach
- Excellent documentation
- Built-in testing utilities
- Enterprise-grade patterns

### Frontend: Component-Based Architecture with Next.js

```
┌─────────────────────────────────────────┐
│              Pages/Routes               │  ← App Router (Next.js 14)
├─────────────────────────────────────────┤
│             Components                  │  ← Reusable UI Components
├─────────────────────────────────────────┤
│          Hooks & Context                │  ← State Management
├─────────────────────────────────────────┤
│          API Client Layer               │  ← Axios HTTP Client
└─────────────────────────────────────────┘
```

**Why Next.js?**
- Server-side rendering for better SEO
- File-based routing
- Built-in optimization
- Great developer experience
- Active community

## Database Design

### PostgreSQL

**Why PostgreSQL over MongoDB?**
- ACID compliance ensures data integrity
- Better for relational data (users ↔ objects ↔ events)
- JSONB support for flexible schemas (best of both worlds)
- Strong typing with TypeORM

### Schema Design Philosophy

1. **Users** - Central entity for authentication
2. **Object Definitions** - User-defined schemas (JSONB for flexibility)
3. **Calendar Events** - Links objects to dates with custom data

The JSONB columns allow users to define their own structures without database migrations!

## Authentication & Security

### JWT + Passport Strategy

**Flow:**
1. User registers/logs in → receives JWT token
2. Token stored in localStorage (frontend)
3. Token sent in Authorization header for protected routes
4. Backend validates token using Passport strategies

**Security Measures:**
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- HTTP-only cookies (future enhancement)
- Input validation with class-validator
- SQL injection prevention (TypeORM parameterized queries)

## Caching Strategy

### Redis for Session & Data Caching

**Current Use Cases:**
- Session storage (future)
- API response caching (future)
- Rate limiting (future)

**Why Redis?**
- In-memory speed
- Simple key-value store
- Perfect for sessions and temporary data

## Testing Strategy

### Test Pyramid

```
        ╱╲
       ╱E2E╲         ← Few, critical user flows
      ╱──────╲
     ╱  Unit  ╲      ← Many, fast, isolated tests
    ╱──────────╲
   ╱Integration ╲    ← Moderate, test modules together
  ╱──────────────╲
```

**Backend Testing:**
- **Unit Tests** - Test services in isolation
- **Integration Tests** - Test controllers + services
- **E2E Tests** - Full API workflows

**Frontend Testing:**
- **Unit Tests** - Test components and hooks
- **Integration Tests** - Test page flows
- **E2E Tests** (future) - Playwright/Cypress

## DevOps & Deployment

### Docker Strategy

**Multi-Stage Builds:**
- Development stage: Hot-reload, debugging
- Production stage: Optimized, minimal image

**Docker Compose:**
- Development: All services together
- Production: Use orchestration (Kubernetes, Docker Swarm)

### CI/CD Pipeline

**GitHub Actions Workflow:**
1. **Test Phase**: Run all tests on push/PR
2. **Build Phase**: Create Docker images
3. **Deploy Phase**: Push to registry (main branch only)

## Scalability Considerations

### Horizontal Scaling

- **Backend**: Stateless design → can run multiple instances
- **Frontend**: Static generation → CDN-ready
- **Database**: PostgreSQL replication
- **Redis**: Redis Cluster for high availability

### Performance Optimization

1. **Backend:**
   - Connection pooling (TypeORM)
   - Query optimization with indexes
   - Response caching with Redis

2. **Frontend:**
   - Code splitting (Next.js automatic)
   - Image optimization (Next.js Image component)
   - Static generation for non-dynamic pages

## Data Visualization Approach

### Multiple Libraries for Different Needs

- **D3.js** - Complex, custom visualizations
- **Recharts** - Simple, responsive charts (React-friendly)
- **Chart.js** - Quick, standard charts

**Why three libraries?**
- Different use cases require different tools
- Learning opportunity to compare libraries
- Flexibility for future requirements

## Type Safety

### End-to-End TypeScript

**Benefits:**
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Easier refactoring

**DTOs (Data Transfer Objects):**
- Shared types between frontend/backend (future: shared package)
- Validation with decorators
- Automatic Swagger documentation

## Future Architecture Enhancements

1. **Microservices** - Split into smaller services as complexity grows
2. **GraphQL** - More flexible API queries
3. **WebSockets** - Real-time updates for shared calendars
4. **Event Sourcing** - Audit trail for data changes
5. **CQRS** - Separate read/write models for performance

## Learning Objectives Met

✅ **React & Next.js** - Modern React patterns
✅ **TypeScript** - Full-stack type safety
✅ **NestJS** - Enterprise backend architecture
✅ **Docker** - Container orchestration
✅ **CI/CD** - Automated testing and deployment
✅ **Database Design** - Relational + JSONB flexibility
✅ **Authentication** - JWT & Passport
✅ **Testing** - Comprehensive test coverage

## Conclusion

This architecture balances:
- **Simplicity** - Easy to understand and maintain
- **Scalability** - Can grow with user base
- **Flexibility** - JSONB allows user-defined schemas
- **Best Practices** - Industry-standard patterns
- **Learning** - Exposes you to modern web development tools
