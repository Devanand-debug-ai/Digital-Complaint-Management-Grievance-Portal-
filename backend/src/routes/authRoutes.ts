import express from 'express';
import { register, login, getAllStaff, getAllUsers, deleteUser, updateUserRole, createStaff, deleteStaff } from '../controllers/authController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/staff', getAllStaff);
router.post('/staff', authenticateToken, authorizeRole(['Admin']), createStaff);
router.delete('/staff/:id', authenticateToken, authorizeRole(['Admin']), deleteStaff);

router.get('/users', authenticateToken, authorizeRole(['Admin']), getAllUsers);
router.delete('/users/:id', authenticateToken, authorizeRole(['Admin']), deleteUser);
router.put('/users/:id/role', authenticateToken, authorizeRole(['Admin']), updateUserRole);

export default router;
