├── client/            # Frontend React code
│   ├── src/          # React source files
│   └── index.html    # Main HTML file
├── server/           # Backend Express code
├── shared/           # Shared types and utilities
└── package.json      # Project dependencies (for both frontend and backend)
```

> **Important Note**: This is a monorepo structure where both frontend and backend share the same `package.json`. You don't need a separate package.json in the client folder.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js v18 or higher (Download from [nodejs.org](https://nodejs.org/))
- PostgreSQL database (Download from [postgresql.org](https://www.postgresql.org/download/))
- Face++ API account (Sign up at [Face++ website](https://www.faceplusplus.com/))

## Local Development Setup

### 1. Install Dependencies
```bash
# Navigate to the project root directory (where package.json is)
cd facematch-project

# Install all dependencies (this will install both frontend and backend packages)
npm install
```

### 2. Database Setup
```bash
# For Windows: Use pgAdmin or psql to create database
# For Mac/Linux: Run this command
createdb facematch

# Default PostgreSQL credentials are usually:
# Username: postgres
# Password: postgres
# Port: 5432
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env
```

Edit your `.env` file with these values:
```env
# For local PostgreSQL setup
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/facematch"

# Generate a random string for security (you can use any secure random string)
SESSION_SECRET="your-random-secure-string"

# Get these from your Face++ dashboard
FACEPP_API_KEY="your_key_from_faceplus_console"
FACEPP_API_SECRET="your_secret_from_faceplus_console"

# Local development settings
PORT=5000
NODE_ENV=development
```

### 4. Initialize Database
```bash
# This will create all necessary database tables
npm run db:push
```

### 5. Start Development Server
```bash
# This will start both frontend and backend servers
npm run dev
```

The application will be available at: http://localhost:5000

## Common Issues and Solutions

### 1. "package.json not found in frontend folder"
This is expected! The project uses a monorepo structure where all dependencies are managed from the root package.json. You don't need a separate package.json in the client folder.

### 2. Database Connection Issues
- Ensure PostgreSQL is running on your machine
- Verify your DATABASE_URL matches your PostgreSQL setup
- Check if the database 'facematch' exists
- Try connecting using pgAdmin or psql to verify credentials

### 3. "Module not found" errors
Run `npm install` from the project root directory (where the main package.json is located), not from the client directory.

### 4. Port Already in Use
If port 5000 is already in use:
1. Change the PORT in your .env file
2. Kill any process using port 5000:
   ```bash
   # On Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F

   # On Mac/Linux
   lsof -i :5000
   kill -9 <PID>