import { bookRepository } from '../repositories/BookRepository';
import { Book, BookInput, BookUpdateInput, BookFilter } from '../types';

export interface BookService {
  getBook(id: string): Promise<Book | null>;
  getAllBooks(filter?: BookFilter): Promise<Book[]>;
  getBooksByAuthor(authorId: string): Promise<Book[]>;
  createBook(data: BookInput): Promise<Book>;
  updateBook(id: string, data: BookUpdateInput): Promise<Book | null>;
  deleteBook(id: string): Promise<boolean>;
  searchBooks(searchTerm: string): Promise<Book[]>;
}

class BookServiceImpl implements BookService {
  async getBook(id: string): Promise<Book | null> {
    return bookRepository.findById(id);
  }

  async getAllBooks(filter?: BookFilter): Promise<Book[]> {
    return bookRepository.findAll(filter);
  }

  async getBooksByAuthor(authorId: string): Promise<Book[]> {
    return bookRepository.findByAuthor(authorId);
  }

  async createBook(data: BookInput): Promise<Book> {
    // Validate author exists (could add this check with author service call)
    return bookRepository.create(data);
  }

  async updateBook(id: string, data: BookUpdateInput): Promise<Book | null> {
    const existing = await bookRepository.findById(id);
    if (!existing) {
      throw new Error('Book not found');
    }
    return bookRepository.update(id, data);
  }

  async deleteBook(id: string): Promise<boolean> {
    const existing = await bookRepository.findById(id);
    if (!existing) {
      throw new Error('Book not found');
    }
    return bookRepository.delete(id);
  }

  async searchBooks(searchTerm: string): Promise<Book[]> {
    return bookRepository.findBySearch(searchTerm);
  }
}

export const bookService = new BookServiceImpl();
