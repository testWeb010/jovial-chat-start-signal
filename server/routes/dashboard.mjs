import express from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from "../db/conn.mjs";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get dashboard statistics
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;

    // Get counts
    const totalVideos = await db.collection('videos').countDocuments();
    const totalProjects = await db.collection('projects').countDocuments();
    const totalUsers = await db.collection('admins').countDocuments();
    const pendingUsers = await db.collection('admins').countDocuments({ role: 'pending' });

    // Get recent activity (last 10 videos and projects)
    const recentVideos = await db.collection('videos')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const recentProjects = await db.collection('projects')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Combine and format recent activity
    const recentActivity = [
      ...recentVideos.map(video => ({
        type: 'video',
        title: `New video added: "${video.title}"`,
        time: formatRelativeTime(video.createdAt),
        id: video._id
      })),
      ...recentProjects.map(project => ({
        type: 'project',
        title: `Project created: "${project.title}"`,
        time: formatRelativeTime(project.createdAt),
        id: project._id
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    // Get analytics data (videos/projects created per month for last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const videoAnalytics = await db.collection('videos').aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo.toISOString() }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: "$createdAt" } } },
            month: { $month: { $dateFromString: { dateString: "$createdAt" } } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]).toArray();

    const analytics = videoAnalytics.map(item => ({
      month: getMonthName(item._id.month),
      videos: item.count,
      views: Math.floor(Math.random() * 10000) + 1000 // Mock data for views
    }));

    res.json({
      totalVideos,
      totalProjects,
      totalUsers,
      pendingUsers,
      totalViews: Math.floor(Math.random() * 1000000) + 100000, // Mock data
      recentActivity,
      analytics
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// Helper function to format relative time
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

// Helper function to get month name
function getMonthName(monthNumber) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[monthNumber - 1];
}

export default router;