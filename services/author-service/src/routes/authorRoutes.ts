import { Router } from 'express';
import { body, query } from 'express-validator';
import { validate } from '../middleware/validation';
import {
  getAuthor,
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  searchAuthors,
} from '../controllers/AuthorController';

const router = Router();

// Get all authors
router.get('/', getAllAuthors);

// Search authors
router.get('/search', query('q').optional().isString(), validate, searchAuthors);

// Get author by ID
router.get('/:id', getAuthor);

// Create author
router.post(
  '/',
  [
    body('firstName').isString().notEmpty(),
    body('lastName').isString().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('bio').optional().isString(),
    body('profileImageUrl').optional().isURL(),
  ],
  validate,
  createAuthor
);

// Update author
router.put(
  '/:id',
  [
    body('firstName').optional().isString(),
    body('lastName').optional().isString(),
    body('email').optional().isEmail().normalizeEmail(),
    body('bio').optional().isString(),
    body('profileImageUrl').optional().isURL(),
    body('isActive').optional().isBoolean(),
  ],
  validate,
  updateAuthor
);

// Delete author
router.delete('/:id', deleteAuthor);

export default router;
