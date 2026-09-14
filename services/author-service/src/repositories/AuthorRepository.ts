import { dbService } from '../db/database';
import { Author, AuthorInput, AuthorUpdateInput } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface AuthorRepository {
  findById(id: string): Promise<Author | null>;
  findByEmail(email: string): Promise<Author | null>;
  findAll(): Promise<Author[]>;
  create(data: AuthorInput): Promise<Author>;
  update(id: string, data: AuthorUpdateInput): Promise<Author | null>;
  delete(id: string): Promise<boolean>;
  findBySearch(searchTerm: string): Promise<Author[]>;
}

export const authorRepository: AuthorRepository = {
  async findById(id: string): Promise<Author | null> {
    const result = await dbService.query(
      'SELECT * FROM authors WHERE id = $1 AND is_active = true',
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },

  async findByEmail(email: string): Promise<Author | null> {
    const result = await dbService.query(
      'SELECT * FROM authors WHERE email = $1 AND is_active = true',
      [email]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },

  async findAll(): Promise<Author[]> {
    const result = await dbService.query(
      'SELECT * FROM authors WHERE is_active = true ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async create(data: AuthorInput): Promise<Author> {
    const id = uuidv4();
    const result = await dbService.query(
      `INSERT INTO authors (id, first_name, last_name, email, bio, profile_image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, data.firstName, data.lastName, data.email, data.bio || null, data.profileImageUrl || null, true]
    );
    return result.rows[0];
  },

  async update(id: string, data: AuthorUpdateInput): Promise<Author | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.firstName) { fields.push('first_name = $' + (fields.length + 1)); values.push(data.firstName); }
    if (data.lastName) { fields.push('last_name = $' + (fields.length + 1)); values.push(data.lastName); }
    if (data.email) { fields.push('email = $' + (fields.length + 1)); values.push(data.email); }
    if (data.bio !== undefined) { fields.push('bio = $' + (fields.length + 1)); values.push(data.bio); }
    if (data.profileImageUrl !== undefined) { fields.push('profile_image_url = $' + (fields.length + 1)); values.push(data.profileImageUrl); }
    if (data.isActive !== undefined) { fields.push('is_active = $' + (fields.length + 1)); values.push(data.isActive); }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await dbService.query(
      `UPDATE authors SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  async delete(id: string): Promise<boolean> {
    const result = await dbService.query(
      'UPDATE authors SET is_active = false WHERE id = $1',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  },

  async findBySearch(searchTerm: string): Promise<Author[]> {
    const searchPattern = `%${searchTerm}%`;
    const result = await dbService.query(
      `SELECT * FROM authors
       WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1)
       AND is_active = true
       ORDER BY created_at DESC`,
      [searchPattern]
    );
    return result.rows;
  },
};
