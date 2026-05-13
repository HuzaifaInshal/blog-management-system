import type { User } from "@repo/types";

export type AuthUser = User;

export interface AuthResponse {
  token: string;
  user: AuthUser;
  message: string;
}
