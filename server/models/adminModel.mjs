import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    default: 'pending',
    enum: ['pending', 'admin', 'superadmin']
  },
  registrationAttempts: {
    type: Number,
    default: 0
  },
  blockUntil: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
AdminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the Admin model as a named export
const Admin = mongoose.model('admins', AdminSchema);

export default Admin;
