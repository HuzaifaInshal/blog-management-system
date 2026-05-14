"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  User,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useGetBlogById, useDeleteBlog } from "../services/blogServices";
import { BlogFormModal } from "../components/BlogFormModal";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { handleMutationError } from "@/utils/handleMutationError";
import { getCurrentUser } from "@/utils/auth";
import { blogKeys } from "@/query-keys/blogKeys";

interface Props {
  blogId: string;
}

export function BlogDetailView({ blogId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useGetBlogById({ blogId });
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentUser<{ _id: string }>();
    setCurrentUserId(user?._id ?? null);
  }, []);

  const blog = data?.data;
  const isOwner = Boolean(
    blog && currentUserId && blog.author._id === currentUserId
  );

  const handleDelete = () => {
    deleteBlog(
      { blogId },
      {
        onSuccess: () => {
          toast.success("Blog deleted");
          queryClient.invalidateQueries({ queryKey: blogKeys.all });
          router.push("/blogs");
        },
        onError: handleMutationError,
      }
    );
  };

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
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to blogs
          </Link>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5"
              >
                <Pencil size={14} />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-4">
          {blog.title}
        </h1>

        {/* Meta */}
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
          {blog.status === "draft" && (
            <span className="text-amber-500 font-medium">Draft</span>
          )}
        </div>

        {/* Content */}
        <div className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap text-sm">
          {blog.content}
        </div>
      </div>

      {/* Edit modal */}
      <BlogFormModal open={editOpen} onOpenChange={setEditOpen} blog={blog} />

      {/* Delete confirm modal */}
      <Modal
        open={deleteOpen}
        onOpenChange={(o) => {
          if (!isDeleting) setDeleteOpen(o);
        }}
        className="w-full max-w-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Dialog.Title className="text-base font-semibold text-[var(--text-primary)]">
            Delete blog?
          </Dialog.Title>
          <ModalClose />
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          <span className="font-medium text-[var(--text-primary)]">
            &ldquo;{blog.title}&rdquo;
          </span>{" "}
          will be permanently deleted. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
