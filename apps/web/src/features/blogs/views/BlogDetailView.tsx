"use client";

import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useGetBlogById } from "../services/blogServices";

interface Props {
  blogId: string;
}

export function BlogDetailView({ blogId }: Props) {
  const { data, isPending, error } = useGetBlogById({ blogId });

  const blog = data?.data;

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[var(--destructive)]">
          {(error as any)?.response?.data?.message ?? "Blog not found"}
        </p>
        <Link
          href="/blogs"
          className="text-sm text-[var(--primary)] hover:underline"
        >
          Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to blogs
        </Link>

        <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-4">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-8 pb-8 border-b border-[var(--border-primary)]">
          <span className="flex items-center gap-1.5">
            <User size={14} />
            {blog.author?.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap text-sm">
          {blog.content}
        </div>
      </div>
    </div>
  );
}
