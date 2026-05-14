import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import morgan from "morgan";
import { dbConnect } from "./lib/dbConnect.js";

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

// Health check — no DB needed
app.get("/status", (_req: Request, res: Response) => {
  res.json({ message: "Server is up and running" });
});

// Ensure DB is connected before any /api route
app.use("/api", async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

export default app;
