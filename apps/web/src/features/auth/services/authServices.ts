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
}

export const useRegister = () =>
  useMutation({
    mutationFn: async ({ payload }: RegisterReq) => {
      const res = await axiosInstance.post("/auth/register", payload);
      // Backend wraps response as { success, data: { token, user } }
      return res.data.data as RegisterRes;
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
}

export const useLogin = () =>
  useMutation({
    mutationFn: async ({ payload }: LoginReq) => {
      const res = await axiosInstance.post("/auth/login", payload);
      // Backend wraps response as { success, data: { token, user } }
      return res.data.data as LoginRes;
    },
  });
