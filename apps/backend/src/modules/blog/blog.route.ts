import { Router } from "express";

import { createBlog, getBlogs } from "./blog.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protect, getBlogs);

router.post("/", protect, createBlog);

export default router;
