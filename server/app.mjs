import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import adminAuth from './routes/adminAuth.mjs';
import approveToken from './routes/approveToken.mjs';
import adminMiddleware from './middleware/adminMiddleware.mjs';
import users from './routes/users.mjs';
import videos from './routes/videos.mjs';
import projects from './routes/projects.mjs';
import dashboard from './routes/dashboard.mjs';
import settings from './routes/settings.mjs';
import { connectToDatabase } from "./db/conn.mjs";
import path from "path";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

// Support __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configs
const port = process.env.PORT || 3001;
const clientURL = process.env.CLIENT_URL

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: clientURL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: clientURL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Error handling for unhandled exceptions and rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Connect to MongoDB
connectToDatabase().catch(err => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth/admin', adminAuth);
app.use('/api/auth', approveToken);
app.use('/api/users', users);
app.use('/api/videos', videos);
app.use('/api/projects', projects);
app.use('/api/dashboard', dashboard);
app.use('/api/settings', settings);

// Serve static files from the React app in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, "dist")));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, "dist", 'index.html'));
//   });
// }

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
});
