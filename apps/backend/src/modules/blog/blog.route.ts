import { Router } from "express";

import { createBlog, getBlogById, getBlogs } from "./blog.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protect, getBlogs);
router.get("/:id", protect, getBlogById);

router.post("/", protect, createBlog);

export default router;
