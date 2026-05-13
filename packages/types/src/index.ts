export const UserRole = {
  ADMIN: "admin",
  AUTHOR: "author",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface BlogAuthor {
  _id: string;
  name: string;
  email: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  status: "draft" | "published";
  author: BlogAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
