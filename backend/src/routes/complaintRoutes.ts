import express from 'express';
import { createComplaint, getComplaints, updateStatus, getAnalytics, submitFeedback } from '../controllers/complaintController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = express.Router();

// Static routes first (before dynamic :id routes)
router.get('/analytics', authenticateToken, authorizeRole(['Admin']), getAnalytics);

// CRUD routes
router.post('/', authenticateToken, createComplaint);
router.get('/', authenticateToken, getComplaints);

// Dynamic :id routes last
router.put('/:id/status', authenticateToken, authorizeRole(['Staff', 'Admin']), updateStatus);
router.post('/:id/feedback', authenticateToken, submitFeedback);

export default router;
