"use client";

import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { useLogin } from "../services/authServices";
import { handleMutationError } from "@/utils/handleMutationError";
import { setAuthToken } from "@/utils/auth";

const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Enter a valid email address")
    .max(254, "Email is too long")
    .required("Email is required"),
  password: yup
    .string()
    .trim()
    .min(1, "Password is required")
    .required("Password is required"),
});

export function LoginView() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      login(
        {
          payload: {
            email: values.email.trim().toLowerCase(),
            password: values.password.trim(),
          },
        },
        {
          onSuccess: (data) => {
            setAuthToken(data.token);
            toast.success("Logged in successfully");
            router.push("/blogs");
          },
          onError: handleMutationError,
        }
      );
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--border-primary)] bg-white shadow-sm">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          Sign in to your account
        </p>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <TextInput
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            startIcon={
              <Mail size={16} className="text-[var(--text-secondary)]" />
            }
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? formik.errors.email : undefined}
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            startIcon={
              <Lock size={16} className="text-[var(--text-secondary)]" />
            }
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password ? formik.errors.password : undefined}
          />

          <Button type="submit" isLoading={isPending} className="mt-2">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[var(--primary)] hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
