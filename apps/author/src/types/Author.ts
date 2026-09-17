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

export interface AuthorFormProps {
  author?: Author;
  onSubmit: (data: AuthorFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface AuthorFormData {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface AuthorListProps {
  authors: Author[];
  onSelect?: (author: Author) => void;
  isLoading?: boolean;
}

export interface AuthorCardProps {
  author: Author;
  onClick?: (author: Author) => void;
}
