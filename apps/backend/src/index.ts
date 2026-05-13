import type { Blog } from "@repo/types";

const example: Blog = {
  _id: "1",
  title: "Hello World",
  content: "First post",
  status: "published",
  author: { _id: "u1", name: "Alice", email: "alice@example.com" },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

console.log("backend ready", example);
