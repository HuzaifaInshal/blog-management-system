import type { Post } from "@repo/types";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatPostDate(post: Pick<Post, "createdAt">): string {
  return new Date(post.createdAt).toISOString().slice(0, 10);
}

export function isPublished(post: Pick<Post, "published">): boolean {
  return post.published === true;
}
