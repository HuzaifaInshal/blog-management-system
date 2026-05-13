import type { Post } from "@repo/types";
import { slugify } from "@repo/utils";

const example: Post = {
  id: "1",
  title: "Hello World",
  slug: slugify("Hello World"),
  content: "First post",
  authorId: "u1",
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

console.log("backend ready", example);
