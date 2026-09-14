import { authorRepository } from '../repositories/AuthorRepository';
import { Author, AuthorInput, AuthorUpdateInput } from '../types';

export interface AuthorService {
  getAuthor(id: string): Promise<Author | null>;
  getAllAuthors(): Promise<Author[]>;
  createAuthor(data: AuthorInput): Promise<Author>;
  updateAuthor(id: string, data: AuthorUpdateInput): Promise<Author | null>;
  deleteAuthor(id: string): Promise<boolean>;
  searchAuthors(searchTerm: string): Promise<Author[]>;
}

class AuthorServiceImpl implements AuthorService {
  async getAuthor(id: string): Promise<Author | null> {
    return authorRepository.findById(id);
  }

  async getAllAuthors(): Promise<Author[]> {
    return authorRepository.findAll();
  }

  async createAuthor(data: AuthorInput): Promise<Author> {
    const existing = await authorRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Email already exists');
    }
    return authorRepository.create(data);
  }

  async updateAuthor(id: string, data: AuthorUpdateInput): Promise<Author | null> {
    const existing = await authorRepository.findById(id);
    if (!existing) {
      throw new Error('Author not found');
    }
    return authorRepository.update(id, data);
  }

  async deleteAuthor(id: string): Promise<boolean> {
    const existing = await authorRepository.findById(id);
    if (!existing) {
      throw new Error('Author not found');
    }
    return authorRepository.delete(id);
  }

  async searchAuthors(searchTerm: string): Promise<Author[]> {
    return authorRepository.findBySearch(searchTerm);
  }
}

export const authorService = new AuthorServiceImpl();
