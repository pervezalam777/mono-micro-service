import { Request, Response } from 'express';
import { bookService } from '../services/BookService';
import { BookUpdateInput, BookFilter } from '../types';

export const getBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await bookService.getBook(req.params.id);

    if (!book) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Book not found',
        },
      });
      return;
    }

    res.status(200).json({
      data: book,
    });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: error.message || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
      },
    });
  }
};

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: BookFilter = {};
    if (req.query.authorId) filter.authorId = req.query.authorId as string;
    if (req.query.category) filter.category = req.query.category as string;
    if (req.query.language) filter.language = req.query.language as string;
    if (req.query.minPageCount) filter.minPageCount = parseInt(req.query.minPageCount as string);
    if (req.query.maxPageCount) filter.maxPageCount = parseInt(req.query.maxPageCount as string);

    const books = await bookService.getAllBooks(filter);

    res.status(200).json({
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: error.message || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
      },
    });
  }
};

export const getBooksByAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await bookService.getBooksByAuthor(req.params.authorId);

    res.status(200).json({
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: error.message || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
      },
    });
  }
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, isbn, authorId, description, coverImageUrl, publicationDate, publisher, pageCount, language, category } = req.body;

    const book = await bookService.createBook({
      title,
      isbn,
      authorId,
      description,
      coverImageUrl,
      publicationDate: publicationDate ? new Date(publicationDate) : undefined,
      publisher,
      pageCount: pageCount ? parseInt(pageCount) : undefined,
      language,
      category,
    });

    res.status(201).json({
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: error.message || 'CREATE_FAILED',
        message: error.message || 'Failed to create book',
      },
    });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates: BookUpdateInput = {};

    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.isbn !== undefined) updates.isbn = req.body.isbn;
    if (req.body.authorId !== undefined) updates.authorId = req.body.authorId;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.coverImageUrl !== undefined) updates.coverImageUrl = req.body.coverImageUrl;
    if (req.body.publicationDate !== undefined) updates.publicationDate = new Date(req.body.publicationDate);
    if (req.body.publisher !== undefined) updates.publisher = req.body.publisher;
    if (req.body.pageCount !== undefined) updates.pageCount = parseInt(req.body.pageCount);
    if (req.body.language !== undefined) updates.language = req.body.language;
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    const book = await bookService.updateBook(req.params.id, updates);

    if (!book) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Book not found',
        },
      });
      return;
    }

    res.status(200).json({
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: error.message || 'UPDATE_FAILED',
        message: error.message || 'Failed to update book',
      },
    });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await bookService.deleteBook(req.params.id);

    if (!success) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Book not found',
        },
      });
      return;
    }

    res.status(200).json({
      data: { message: 'Book deleted successfully' },
    });
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: error.message || 'DELETE_FAILED',
        message: error.message || 'Failed to delete book',
      },
    });
  }
};

export const searchBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    const searchTerm = typeof q === 'string' ? q : '';

    const books = await bookService.searchBooks(searchTerm);

    res.status(200).json({
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: error.message || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
      },
    });
  }
};
