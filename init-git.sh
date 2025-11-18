#!/bin/bash

# Git Initialization Script for Customizable Calendar Project
# This script initializes git repository and creates initial commit

echo "🚀 Initializing Git Repository..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d .git ]; then
    echo "📦 Initializing new Git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📝 Staging all files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Customizable Calendar Application

- NestJS backend with TypeScript
- Next.js frontend with React and TailwindCSS
- PostgreSQL and Redis databases
- Docker and Docker Compose setup
- JWT authentication with Passport.js
- TypeORM for database management
- Complete API with Swagger documentation
- Testing setup (Jest)
- GitHub Actions CI/CD pipeline
- Comprehensive documentation"

echo ""
echo "✅ Git repository initialized successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create a repository on GitHub"
echo "2. Run: git remote add origin <your-github-url>"
echo "3. Run: git push -u origin main"
echo ""
echo "Or create a new branch for development:"
echo "git checkout -b develop"
