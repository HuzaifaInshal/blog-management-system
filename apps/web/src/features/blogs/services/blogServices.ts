import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios";
import { blogKeys } from "@/query-keys/blogKeys";
import { getNextPageParam } from "@/utils/infiniteQueryUtils";
import type { PaginationReq, PaginationRes } from "@/types/common";
import type { BlogListItem, BlogDetail } from "../blogTypes";

// ─── Shared types ─────────────────────────────────────────────────────────────

interface GetBlogsReq extends Omit<PaginationReq, "limit"> {
  search?: string;
  limit?: number;
}

interface GetBlogsRes extends PaginationRes {
  data: BlogListItem[];
}

// ─── Get all blogs (infinite, published only) ─────────────────────────────────

export function useGetBlogs({ search, limit = 10 }: GetBlogsReq) {
  return useInfiniteQuery({
    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get("/blogs", {
        params: { page: pageParam, limit, search },
      });
      return res.data as GetBlogsRes;
    },
    queryKey: blogKeys.list({ search }),
    getNextPageParam,
    initialPageParam: 1,
  });
}

// ─── Get my blogs (infinite, all statuses) ────────────────────────────────────

export function useGetMyBlogs({ search, limit = 10 }: GetBlogsReq) {
  return useInfiniteQuery({
    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get("/blogs/my", {
        params: { page: pageParam, limit, search },
      });
      return res.data as GetBlogsRes;
    },
    queryKey: blogKeys.my({ search }),
    getNextPageParam,
    initialPageParam: 1,
  });
}

// ─── Get blog by ID ───────────────────────────────────────────────────────────

interface GetBlogByIdReq {
  blogId: string;
}

interface GetBlogByIdRes {
  data: BlogDetail;
}

export function useGetBlogById({ blogId }: GetBlogByIdReq) {
  return useQuery({
    queryKey: blogKeys.detail(blogId),
    queryFn: async () => {
      const res = await axiosInstance.get(`/blogs/${blogId}`);
      return res.data as GetBlogByIdRes;
    },
    enabled: !!blogId,
  });
}

// ─── Create blog ──────────────────────────────────────────────────────────────

interface CreateBlogReq {
  payload: {
    title: string;
    content: string;
    status?: "draft" | "published";
  };
}

export const useCreateBlog = () =>
  useMutation({
    mutationFn: async ({ payload }: CreateBlogReq) => {
      const res = await axiosInstance.post("/blogs", payload);
      return res.data;
    },
  });

// ─── Update blog ──────────────────────────────────────────────────────────────

interface UpdateBlogReq {
  blogId: string;
  payload: {
    title?: string;
    content?: string;
    status?: "draft" | "published";
  };
}

export const useUpdateBlog = () =>
  useMutation({
    mutationFn: async ({ blogId, payload }: UpdateBlogReq) => {
      const res = await axiosInstance.put(`/blogs/${blogId}`, payload);
      return res.data;
    },
  });

// ─── Delete blog ──────────────────────────────────────────────────────────────

interface DeleteBlogReq {
  blogId: string;
}

export const useDeleteBlog = () =>
  useMutation({
    mutationFn: async ({ blogId }: DeleteBlogReq) => {
      const res = await axiosInstance.delete(`/blogs/${blogId}`);
      return res.data;
    },
  });
