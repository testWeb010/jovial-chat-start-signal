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

// Get all projects with pagination and filters
router.get('/', async (req, res) => {
  try {
    const db = getDb().connection;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const projects = await db.collection('projects')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('projects').countDocuments(query);

    res.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
});

// Create new project
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const { title, description, image, category, status, keywords, client } = req.body;

    if (!title || !description || !category || !client) {
      return res.status(400).json({ message: 'Title, description, category, and client are required' });
    }

    const newProject = {
      title,
      description,
      image: image || "https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=800",
      category,
      status: status || 'ongoing',
      keywords: keywords || [],
      client,
      createdAt: new Date().toISOString(),
      createdBy: req.user.userId
    };

    const result = await db.collection('projects').insertOne(newProject);
    const project = await db.collection('projects').findOne({ _id: result.insertedId });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error while creating project' });
  }
});

// Update project
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const projectId = req.params.id;
    const { title, description, image, category, status, keywords, client } = req.body;

    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updateData = {
      title,
      description,
      image: image || project.image,
      category,
      status: status || project.status,
      keywords: keywords || [],
      client,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.userId
    };

    await db.collection('projects').updateOne(
      { _id: new ObjectId(projectId) },
      { $set: updateData }
    );

    const updatedProject = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error while updating project' });
  }
});

// Delete project
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const projectId = req.params.id;

    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await db.collection('projects').deleteOne({ _id: new ObjectId(projectId) });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error while deleting project' });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb().connection;
    const projectId = req.params.id;

    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error while fetching project' });
  }
});

export default router;