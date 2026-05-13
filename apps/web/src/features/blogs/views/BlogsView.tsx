"use client";

import { useState } from "react";
import { Loader2, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useGetBlogs } from "../services/blogServices";
import { transformInfiniteData } from "@/utils/infiniteQueryUtils";
import { Button } from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";

export function BlogsView() {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isPending, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetBlogs({ search: searchQuery });

  const blogs = data ? transformInfiniteData(data) : [];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(search.trim());
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--destructive)]">
          {(error as any)?.response?.data?.message ?? "Failed to load blogs"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2">
          Blogs
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          Explore the latest published posts
        </p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
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

        {blogs.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)] py-16">
            No blogs found.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog._id}`}
                className="group block p-5 rounded-xl border border-[var(--border-primary)] bg-white hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
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
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-[var(--border-primary)] group-hover:text-[var(--primary)] transition-colors flex-shrink-0 mt-0.5"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
