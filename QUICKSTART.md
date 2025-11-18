# Customizable Calendar - Quick Start Guide

## 🚀 Launch the Application in 3 Steps

### Step 1: Copy environment variables
The `.env` file is already created. For production, update the `JWT_SECRET` to a secure random string.

### Step 2: Start Docker containers
```bash
docker-compose up -d
```

This command will:
- Download required Docker images (PostgreSQL, Redis, Node)
- Build the backend and frontend containers
- Start all services

**First-time setup takes 5-10 minutes** as Docker downloads images and installs dependencies.

### Step 3: Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Documentation**: http://localhost:3001/api/docs

## 🔍 Verify Everything is Running

Check the status of containers:
```bash
docker-compose ps
```

You should see all services as "Up":
- calendar-postgres
- calendar-redis
- calendar-backend
- calendar-frontend

## 📝 View Logs

To see what's happening:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🛑 Stop the Application

```bash
docker-compose down
```

To also remove volumes (database data):
```bash
docker-compose down -v
```

## 🔄 Restart After Code Changes

If you modify the code:
```bash
docker-compose restart backend  # For backend changes
docker-compose restart frontend # For frontend changes
```

To rebuild completely:
```bash
docker-compose up -d --build
```

## 🧪 Test the API

Once running, try creating a user:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

## ❓ Troubleshooting

### Port already in use
If ports 3000, 3001, 5432, or 6379 are already in use, either:
1. Stop the other application using that port
2. Change the port in `docker-compose.yml`

### Backend won't start
Check if PostgreSQL is healthy:
```bash
docker-compose logs postgres
```

### Frontend can't connect to backend
Verify the backend is running:
```bash
curl http://localhost:3001/api/auth/login
```

## 📚 Next Steps

1. Read the main `README.md` for detailed documentation
2. Visit http://localhost:3001/api/docs for API documentation
3. Start creating custom objects and calendar events!

## 💡 Development Tips

- The backend has hot-reload enabled (changes are picked up automatically)
- The frontend also has hot-reload (refresh the browser to see changes)
- Database data persists in Docker volumes
- Check `docker-compose logs` if something doesn't work
