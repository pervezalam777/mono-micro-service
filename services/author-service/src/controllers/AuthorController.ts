import { Request, Response } from 'express';
import { authorService } from '../services/AuthorService';
import { AuthorUpdateInput } from '../types';

export const getAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const author = await authorService.getAuthor(req.params.id);

    if (!author) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Author not found',
        },
      });
      return;
    }

    res.status(200).json({
      data: author,
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

export const getAllAuthors = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching all authors...'); // Debugging line
    const authors = await authorService.getAllAuthors();
    console.log('Authors fetched:', authors); // Debugging line
    res.status(200).json({
      data: authors,
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

export const createAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, bio, profileImageUrl } = req.body;

    const author = await authorService.createAuthor({
      firstName,
      lastName,
      email,
      bio,
      profileImageUrl,
    });

    res.status(201).json({
      data: author,
    });
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: error.message || 'CREATE_FAILED',
        message: error.message || 'Failed to create author',
      },
    });
  }
};

export const updateAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates: AuthorUpdateInput = {};

    if (req.body.firstName !== undefined) updates.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) updates.lastName = req.body.lastName;
    if (req.body.email !== undefined) updates.email = req.body.email;
    if (req.body.bio !== undefined) updates.bio = req.body.bio;
    if (req.body.profileImageUrl !== undefined) updates.profileImageUrl = req.body.profileImageUrl;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    const author = await authorService.updateAuthor(req.params.id, updates);

    if (!author) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Author not found',
        },
      });
      return;
    }

    res.status(200).json({
      data: author,
    });
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: error.message || 'UPDATE_FAILED',
        message: error.message || 'Failed to update author',
      },
    });
  }
};

export const deleteAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await authorService.deleteAuthor(req.params.id);

    if (!success) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Author not found',
        },
      });
      return;
    }

    res.status(200).json({
      data: { message: 'Author deleted successfully' },
    });
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: error.message || 'DELETE_FAILED',
        message: error.message || 'Failed to delete author',
      },
    });
  }
};

export const searchAuthors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    const searchTerm = typeof q === 'string' ? q : '';

    const authors = await authorService.searchAuthors(searchTerm);

    res.status(200).json({
      data: authors,
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
