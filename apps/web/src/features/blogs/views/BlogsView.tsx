"use client";

import { useState } from "react";
import {
  Loader2,
  Search,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetBlogs,
  useGetMyBlogs,
  useDeleteBlog,
} from "../services/blogServices";
import { transformInfiniteData } from "@/utils/infiniteQueryUtils";
import { Button } from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { BlogFormModal } from "../components/BlogFormModal";
import { handleMutationError } from "@/utils/handleMutationError";
import { blogKeys } from "@/query-keys/blogKeys";
import type { BlogListItem } from "../blogTypes";

type Tab = "all" | "my";

export function BlogsView() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formModal, setFormModal] = useState<{
    open: boolean;
    blog?: BlogListItem;
  }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<BlogListItem | null>(null);

  const queryClient = useQueryClient();
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog();

  const allBlogsQuery = useGetBlogs({
    search: tab === "all" ? searchQuery : "",
  });
  const myBlogsQuery = useGetMyBlogs({
    search: tab === "my" ? searchQuery : "",
  });

  const active = tab === "all" ? allBlogsQuery : myBlogsQuery;
  const blogs = active.data ? transformInfiniteData(active.data) : [];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(search.trim());
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setSearch("");
    setSearchQuery("");
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteBlog(
      { blogId: deleteTarget._id },
      {
        onSuccess: () => {
          toast.success("Blog deleted");
          queryClient.invalidateQueries({ queryKey: blogKeys.all });
          setDeleteTarget(null);
        },
        onError: handleMutationError,
      }
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
              Blogs
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {tab === "all"
                ? "Explore the latest published posts"
                : "Manage your blogs"}
            </p>
          </div>
          <Button
            onClick={() => setFormModal({ open: true })}
            size="sm"
            className="flex items-center gap-1.5 shrink-0 mt-1"
          >
            <Plus size={15} />
            New Blog
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[var(--border-primary)]">
          {(["all", "my"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {t === "all" ? "All Blogs" : "My Blogs"}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <TextInput
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={
              <Search size={16} className="text-[var(--text-secondary)]" />
            }
            containerClassName="flex-1"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        {/* Content */}
        {active.isPending ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
          </div>
        ) : active.error ? (
          <div className="flex justify-center py-16">
            <p className="text-[var(--destructive)]">
              {(active.error as any)?.response?.data?.message ??
                "Failed to load blogs"}
            </p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <p className="text-[var(--text-secondary)]">
              {tab === "my"
                ? "You haven't written any blogs yet."
                : "No blogs found."}
            </p>
            {tab === "my" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormModal({ open: true })}
                className="flex items-center gap-1.5"
              >
                <Plus size={14} />
                Write your first blog
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="group p-5 rounded-xl border border-[var(--border-primary)] bg-white hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/blogs/${blog._id}`} className="flex-1 min-w-0">
                    <h2 className="text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors truncate">
                      {blog.title}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                      {blog.content}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                      <span>{blog.author?.name}</span>
                      <span>·</span>
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {blog.status === "draft" && (
                        <>
                          <span>·</span>
                          <span className="text-amber-500 font-medium">
                            Draft
                          </span>
                        </>
                      )}
                    </div>
                  </Link>

                  {tab === "my" ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setFormModal({ open: true, blog })}
                        title="Edit"
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(blog)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ) : (
                    <ChevronRight
                      size={18}
                      className="text-[var(--border-primary)] group-hover:text-[var(--primary)] transition-colors flex-shrink-0 mt-0.5"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {active.hasNextPage && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => active.fetchNextPage()}
              isLoading={active.isFetchingNextPage}
            >
              Load more
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      <BlogFormModal
        open={formModal.open}
        onOpenChange={(o) => setFormModal((prev) => ({ ...prev, open: o }))}
        blog={formModal.blog}
      />

      {/* Delete confirm modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => {
          if (!isDeleting && !o) setDeleteTarget(null);
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
            &ldquo;{deleteTarget?.title}&rdquo;
          </span>{" "}
          will be permanently deleted. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteTarget(null)}
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
