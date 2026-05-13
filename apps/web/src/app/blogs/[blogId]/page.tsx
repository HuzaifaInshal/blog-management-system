import { BlogDetailView } from "@/features/blogs/views/BlogDetailView";

interface Props {
  params: Promise<{ blogId: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { blogId } = await params;
  return <BlogDetailView blogId={blogId} />;
}
