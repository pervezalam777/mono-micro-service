export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: TokenPair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  authorId: string;
  author?: Author;
  description?: string;
  coverImageUrl?: string;
  publicationDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
