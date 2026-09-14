import { dbService } from '../db/database';
import { Book, BookInput, BookUpdateInput, BookFilter } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface BookRepository {
  findById(id: string): Promise<Book | null>;
  findByAuthor(authorId: string): Promise<Book[]>;
  findAll(filter?: BookFilter): Promise<Book[]>;
  create(data: BookInput): Promise<Book>;
  update(id: string, data: BookUpdateInput): Promise<Book | null>;
  delete(id: string): Promise<boolean>;
  findBySearch(searchTerm: string): Promise<Book[]>;
}

export const bookRepository: BookRepository = {
  async findById(id: string): Promise<Book | null> {
    const result = await dbService.query(
      'SELECT * FROM books WHERE id = $1 AND is_active = true',
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },

  async findByAuthor(authorId: string): Promise<Book[]> {
    const result = await dbService.query(
      'SELECT * FROM books WHERE author_id = $1 AND is_active = true ORDER BY created_at DESC',
      [authorId]
    );
    return result.rows;
  },

  async findAll(filter?: BookFilter): Promise<Book[]> {
    let query = 'SELECT * FROM books WHERE is_active = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (filter?.authorId) {
      query += ` AND author_id = $${paramIndex++}`;
      params.push(filter.authorId);
    }
    if (filter?.category) {
      query += ` AND category = $${paramIndex++}`;
      params.push(filter.category);
    }
    if (filter?.language) {
      query += ` AND language = $${paramIndex++}`;
      params.push(filter.language);
    }
    if (filter?.minPageCount !== undefined) {
      query += ` AND page_count >= $${paramIndex++}`;
      params.push(filter.minPageCount);
    }
    if (filter?.maxPageCount !== undefined) {
      query += ` AND page_count <= $${paramIndex++}`;
      params.push(filter.maxPageCount);
    }

    query += ' ORDER BY created_at DESC';

    const result = await dbService.query(query, params);
    return result.rows;
  },

  async create(data: BookInput): Promise<Book> {
    const id = uuidv4();
    const result = await dbService.query(
      `INSERT INTO books (id, title, isbn, author_id, description, cover_image_url, publication_date, publisher, page_count, language, category, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        id,
        data.title,
        data.isbn,
        data.authorId,
        data.description || null,
        data.coverImageUrl || null,
        data.publicationDate || null,
        data.publisher || null,
        data.pageCount || null,
        data.language || null,
        data.category || null,
        true,
      ]
    );
    return result.rows[0];
  },

  async update(id: string, data: BookUpdateInput): Promise<Book | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.title) { fields.push('title = $' + (fields.length + 1)); values.push(data.title); }
    if (data.isbn) { fields.push('isbn = $' + (fields.length + 1)); values.push(data.isbn); }
    if (data.authorId) { fields.push('author_id = $' + (fields.length + 1)); values.push(data.authorId); }
    if (data.description !== undefined) { fields.push('description = $' + (fields.length + 1)); values.push(data.description); }
    if (data.coverImageUrl !== undefined) { fields.push('cover_image_url = $' + (fields.length + 1)); values.push(data.coverImageUrl); }
    if (data.publicationDate) { fields.push('publication_date = $' + (fields.length + 1)); values.push(data.publicationDate); }
    if (data.publisher) { fields.push('publisher = $' + (fields.length + 1)); values.push(data.publisher); }
    if (data.pageCount) { fields.push('page_count = $' + (fields.length + 1)); values.push(data.pageCount); }
    if (data.language) { fields.push('language = $' + (fields.length + 1)); values.push(data.language); }
    if (data.category) { fields.push('category = $' + (fields.length + 1)); values.push(data.category); }
    if (data.isActive !== undefined) { fields.push('is_active = $' + (fields.length + 1)); values.push(data.isActive); }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await dbService.query(
      `UPDATE books SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  async delete(id: string): Promise<boolean> {
    const result = await dbService.query(
      'UPDATE books SET is_active = false WHERE id = $1',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  },

  async findBySearch(searchTerm: string): Promise<Book[]> {
    const searchPattern = `%${searchTerm}%`;
    const result = await dbService.query(
      `SELECT * FROM books
       WHERE (title ILIKE $1 OR isbn ILIKE $1 OR description ILIKE $1)
       AND is_active = true
       ORDER BY created_at DESC`,
      [searchPattern]
    );
    return result.rows;
  },
};
