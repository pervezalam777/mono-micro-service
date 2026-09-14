import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';
import { register, login, refreshToken, verifyToken, getMe } from '../controllers/AuthController';

const router = Router();

// Register route
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').isString().notEmpty(),
    body('lastName').isString().notEmpty(),
  ],
  validate,
  register
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  login
);

// Refresh token route
router.post(
  '/refresh-token',
  [
    body('refreshToken').notEmpty(),
  ],
  validate,
  refreshToken
);

// Verify token route
router.get('/verify-token', authMiddleware, verifyToken);

// Get current user
router.get('/me', authMiddleware, getMe);

// Logout route
router.post('/logout', authMiddleware, (req, res) => {
  // Token blacklisting would be handled here
  res.status(200).json({ data: { message: 'Logged out successfully' } });
});

export default router;
