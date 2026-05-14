import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.route.js";
import blogRoutes from "./modules/blog/blog.route.js";

const app: Express = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/status", (_req, res) => {
  res.json({ message: "Server is up and running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

export default app;
