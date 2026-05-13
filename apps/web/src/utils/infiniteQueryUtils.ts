import type { InfiniteData } from "@tanstack/react-query";
import type { PaginationRes } from "@/types/common";

export function getNextPageParam<T extends PaginationRes>(
  lastPage: T
): number | undefined {
  return lastPage.pagination.page < lastPage.pagination.totalPages
    ? lastPage.pagination.page + 1
    : undefined;
}

export function transformInfiniteData<T>(
  data: InfiniteData<{ data: T[] } & PaginationRes>
): T[] {
  return data.pages.flatMap((page) => page.data);
}
