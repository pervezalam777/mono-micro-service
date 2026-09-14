import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { validate } from '../middleware/validation';
import {
  getBook,
  getAllBooks,
  getBooksByAuthor,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
} from '../controllers/BookController';

const router = Router();

// Get all books
router.get('/', getAllBooks);

// Search books
router.get('/search', query('q').optional().isString(), validate, searchBooks);

// Get books by author
router.get('/author/:authorId', param('authorId').isUUID(), validate, getBooksByAuthor);

// Get book by ID
router.get('/:id', param('id').isUUID(), validate, getBook);

// Create book
router.post(
  '/',
  [
    body('title').isString().notEmpty(),
    body('isbn').isString().notEmpty(),
    body('authorId').isUUID().notEmpty(),
    body('description').optional().isString(),
    body('coverImageUrl').optional().isURL(),
    body('publicationDate').optional().isDate(),
    body('publisher').optional().isString(),
    body('pageCount').optional().isInt(),
    body('language').optional().isString(),
    body('category').optional().isString(),
  ],
  validate,
  createBook
);

// Update book
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('title').optional().isString(),
    body('isbn').optional().isString(),
    body('authorId').optional().isUUID(),
    body('description').optional().isString(),
    body('coverImageUrl').optional().isURL(),
    body('publicationDate').optional().isDate(),
    body('publisher').optional().isString(),
    body('pageCount').optional().isInt(),
    body('language').optional().isString(),
    body('category').optional().isString(),
    body('isActive').optional().isBoolean(),
  ],
  validate,
  updateBook
);

// Delete book
router.delete('/:id', param('id').isUUID(), validate, deleteBook);

export default router;
