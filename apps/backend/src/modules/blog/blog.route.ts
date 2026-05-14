import express, { Router } from "express";

import {
  createBlog,
  getBlogById,
  getBlogs,
  getMyBlogs,
  updateBlog,
  deleteBlog,
} from "./blog.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";

const router: express.Router = Router();

router.get("/", protect, getBlogs);
router.get("/my", protect, getMyBlogs);
router.get("/:id", protect, getBlogById);

router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
