import express from 'express';
import { getDb } from '../db/conn.mjs';

const router = express.Router();

// Approve admin via token (GET for link click)
router.get('/approve/:token', async (req, res) => {
  const db = getDb().connection;
  const { token } = req.params;

  // Find admin by approvalToken
  const admin = await db.collection('admins').findOne({ approvalToken: token });
  if (!admin) {
    return res.status(400).send('<h2>Invalid or expired approval link.</h2>');
  }
  // Check expiry
  if (!admin.approvalTokenExpires || new Date() > new Date(admin.approvalTokenExpires)) {
    return res.status(400).send('<h2>Approval link has expired.</h2>');
  }
  // Approve admin
  await db.collection('admins').updateOne(
    { _id: admin._id },
    { $set: { role: 'admin' }, $unset: { approvalToken: '', approvalTokenExpires: '' } }
  );
  return res.send('<h2>Admin approved successfully!</h2>');
});



export default router;
