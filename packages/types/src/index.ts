export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export enum UserRole {
  ADMIN = "admin",
  AUTHOR = "author",
}
