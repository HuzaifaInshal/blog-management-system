export const blogKeys = {
  all: ["blogs"] as const,
  list: (params?: { search?: string }) =>
    [...blogKeys.all, "list", params] as const,
  detail: (id: string) => [...blogKeys.all, "detail", id] as const,
};
