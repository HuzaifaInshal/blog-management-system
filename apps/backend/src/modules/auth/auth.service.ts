import User from "../user/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (body: any) => {
  const existingUser = await User.findOne({
    email: body.email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await User.create({
    ...body,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user,
  };
};

export const loginUser = async (body: any) => {
  const user = await User.findOne({
    email: body.email,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatched = await bcrypt.compare(body.password, user.password);

  if (!isMatched) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user,
  };
};
