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

export const getMyBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const search = String(req.query.search ?? "");

    const query = {
      author: req.user.id,
      ...(search && { title: { $regex: search, $options: "i" } }),
    };

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("author", "name email"),
      Blog.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        lastPage: totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    if (blog.author?.toString() !== req.user.id) {
      res.status(403).json({ message: "Not authorized to edit this blog" });
      return;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("author", "name email");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    if (blog.author?.toString() !== req.user.id) {
      res.status(403).json({ message: "Not authorized to delete this blog" });
      return;
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBlogById = async (req: AuthRequest, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    res.json({ data: blog });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const search = String(req.query.search ?? "");

    const query = {
      status: "published" as const,
      ...(search && { title: { $regex: search, $options: "i" } }),
    };

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("author", "name email"),
      Blog.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        lastPage: totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
