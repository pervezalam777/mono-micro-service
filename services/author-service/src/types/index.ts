export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthorInput {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface AuthorUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  profileImageUrl?: string;
  isActive?: boolean;
}
