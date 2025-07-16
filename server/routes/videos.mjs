import express from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from "../db/conn.mjs";
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;
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

// Get all videos with pagination and filters
router.get('/', async (req, res) => {
  try {
    const db = getDb().connection;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const sort = req.query.sort || 'newest';

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { uploader: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'all') {
      query.category = category;
    }

    // Build sort
    let sortQuery = {};
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'popular':
        sortQuery = { views: -1 };
        break;
      case 'title':
        sortQuery = { title: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const videos = await db.collection('videos')
      .find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('videos').countDocuments(query);

    res.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Server error while fetching videos' });
  }
});

// Create new video
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const { title, url, description, keywords, category, duration, uploader } = req.body;

    if (!title || !url || !description || !category) {
      return res.status(400).json({ message: 'Title, URL, description, and category are required' });
    }

    const newVideo = {
      title,
      url,
      description,
      keywords: keywords || [],
      category,
      duration: duration || 'N/A',
      uploader: uploader || 'Admin',
      views: '0',
      status: 'published',
      createdAt: new Date().toISOString(),
      createdBy: req.user.userId
    };

    const result = await db.collection('videos').insertOne(newVideo);
    const video = await db.collection('videos').findOne({ _id: result.insertedId });

    res.status(201).json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ message: 'Server error while creating video' });
  }
});

// Update video
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const videoId = req.params.id;
    const { title, url, description, keywords, category, duration, uploader } = req.body;

    if (!ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }

    const video = await db.collection('videos').findOne({ _id: new ObjectId(videoId) });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const updateData = {
      title,
      url,
      description,
      keywords: keywords || [],
      category,
      duration: duration || video.duration,
      uploader: uploader || video.uploader,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.userId
    };

    await db.collection('videos').updateOne(
      { _id: new ObjectId(videoId) },
      { $set: updateData }
    );

    const updatedVideo = await db.collection('videos').findOne({ _id: new ObjectId(videoId) });
    res.json(updatedVideo);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ message: 'Server error while updating video' });
  }
});

// Delete video
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const videoId = req.params.id;

    if (!ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }

    const video = await db.collection('videos').findOne({ _id: new ObjectId(videoId) });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await db.collection('videos').deleteOne({ _id: new ObjectId(videoId) });
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Server error while deleting video' });
  }
});

// Get video by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb().connection;
    const videoId = req.params.id;

    if (!ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }

    const video = await db.collection('videos').findOne({ _id: new ObjectId(videoId) });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Server error while fetching video' });
  }
});

export default router;