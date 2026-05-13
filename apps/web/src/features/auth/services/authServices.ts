import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import type { AuthUser } from "../authTypes";

// ─── Register ────────────────────────────────────────────────────────────────

interface RegisterReq {
  payload: {
    name: string;
    email: string;
    password: string;
  };
}

interface RegisterRes {
  token: string;
  user: AuthUser;
  message: string;
}

export const useRegister = () =>
  useMutation({
    mutationFn: async ({ payload }: RegisterReq) => {
      const res = await axiosInstance.post("/auth/register", payload);
      return res.data as RegisterRes;
    },
  });

// ─── Login ───────────────────────────────────────────────────────────────────

interface LoginReq {
  payload: {
    email: string;
    password: string;
  };
}

interface LoginRes {
  token: string;
  user: AuthUser;
  message: string;
}

export const useLogin = () =>
  useMutation({
    mutationFn: async ({ payload }: LoginReq) => {
      const res = await axiosInstance.post("/auth/login", payload);
      return res.data as LoginRes;
    },
  });
