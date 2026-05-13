import { Response } from "express";
import Blog from "./blog.model.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      author: req.user.id,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getBlogs = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;

  const search = req.query.search || "";

  const query = {
    status: "published",
    title: {
      $regex: search,
      $options: "i",
    },
  };

  const blogs = await Blog.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "name email");

  res.json(blogs);
};
