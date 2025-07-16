# Across Media Backend Server

This is the backend server for Across Media application providing authentication services.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with necessary environment variables:
   ```bash
   PORT=5000
   JWT_SECRET=your-secure-secret-key-here-change-in-production
   ```

3. Run the server in development mode:
   ```bash
   npm run dev
   ```

   Or run in production mode:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/auth/login` - Authenticate user and get JWT token
- `POST /api/auth/register` - Register a new user (demo only)
- `GET /api/auth/protected` - Example protected route

## Security Notes

- Change the JWT_SECRET in production to a secure value
- In production, use a proper database instead of in-memory user storage
- Implement proper input validation and error handling
