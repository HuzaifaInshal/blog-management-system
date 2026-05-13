import type { Post } from "@repo/types";

const example: Post = {
  id: "1",
  title: "Hello World",
  slug: "hello-world",
  content: "First post",
  authorId: "u1",
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

console.log("backend ready", example);
