export interface Book {
  id: string;
  title: string;
  isbn: string;
  authorId: string;
  description?: string;
  coverImageUrl?: string;
  publicationDate?: Date;
  publisher?: string;
  pageCount?: number;
  language?: string;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookInput {
  title: string;
  isbn: string;
  authorId: string;
  description?: string;
  coverImageUrl?: string;
  publicationDate?: Date;
  publisher?: string;
  pageCount?: number;
  language?: string;
  category?: string;
}

export interface BookUpdateInput {
  title?: string;
  isbn?: string;
  authorId?: string;
  description?: string;
  coverImageUrl?: string;
  publicationDate?: Date;
  publisher?: string;
  pageCount?: number;
  language?: string;
  category?: string;
  isActive?: boolean;
}

export interface BookFilter {
  authorId?: string;
  category?: string;
  language?: string;
  minPageCount?: number;
  maxPageCount?: number;
  publicationYear?: number;
}
