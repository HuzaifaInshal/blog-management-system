"use client";

import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";
import PasswordInput from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useRegister } from "../services/authServices";
import { handleMutationError } from "@/utils/handleMutationError";
import { setAuthToken } from "@/utils/auth";

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .required("Name is required"),
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
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Must contain at least one special character")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export function SignUpView() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: (values) => {
      register(
        {
          payload: {
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password.trim(),
          },
        },
        {
          onSuccess: (data) => {
            setAuthToken(data.token);
            toast.success("Account created successfully");
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
          Create an account
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          Join to start publishing your blogs
        </p>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <TextInput
            label="Full name"
            name="name"
            type="text"
            placeholder="John Doe"
            startIcon={
              <User size={16} className="text-[var(--text-secondary)]" />
            }
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name ? formik.errors.name : undefined}
          />

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

          <PasswordInput
            label="Password"
            name="password"
            placeholder="••••••••"
            startIcon={
              <Lock size={16} className="text-[var(--text-secondary)]" />
            }
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password ? formik.errors.password : undefined}
          />

          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            placeholder="••••••••"
            startIcon={
              <Lock size={16} className="text-[var(--text-secondary)]" />
            }
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : undefined
            }
          />

          <Button type="submit" isLoading={isPending} className="mt-2">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-[var(--primary)] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
