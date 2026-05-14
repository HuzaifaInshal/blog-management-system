"use client";

import { useFormik } from "formik";
import * as yup from "yup";
import { Dialog } from "radix-ui";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Modal, ModalClose } from "@/components/ui/Modal";
import TextInput from "@/components/ui/TextInput";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { useCreateBlog, useUpdateBlog } from "../services/blogServices";
import { handleMutationError } from "@/utils/handleMutationError";
import { blogKeys } from "@/query-keys/blogKeys";
import type { BlogListItem } from "../blogTypes";

const validationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters")
    .required("Title is required"),
  content: yup
    .string()
    .trim()
    .min(10, "Content must be at least 10 characters")
    .required("Content is required"),
  status: yup
    .mixed<"draft" | "published">()
    .oneOf(["draft", "published"])
    .required("Status is required"),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog?: BlogListItem;
}

export function BlogFormModal({ open, onOpenChange, blog }: Props) {
  const isEdit = Boolean(blog);
  const queryClient = useQueryClient();
  const { mutate: createBlog, isPending: isCreating } = useCreateBlog();
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();
  const isPending = isCreating || isUpdating;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: blog?.title ?? "",
      content: blog?.content ?? "",
      status: (blog?.status ?? "published") as "draft" | "published",
    },
    validationSchema,
    onSubmit: (values, helpers) => {
      const payload = {
        title: values.title.trim(),
        content: values.content.trim(),
        status: values.status,
      };

      if (isEdit && blog) {
        updateBlog(
          { blogId: blog._id, payload },
          {
            onSuccess: () => {
              toast.success("Blog updated successfully");
              queryClient.invalidateQueries({ queryKey: blogKeys.all });
              onOpenChange(false);
              helpers.resetForm();
            },
            onError: handleMutationError,
          }
        );
      } else {
        createBlog(
          { payload },
          {
            onSuccess: () => {
              toast.success(
                payload.status === "published"
                  ? "Blog published successfully"
                  : "Blog saved as draft"
              );
              queryClient.invalidateQueries({ queryKey: blogKeys.all });
              onOpenChange(false);
              helpers.resetForm();
            },
            onError: handleMutationError,
          }
        );
      }
    },
  });

  const handleOpenChange = (o: boolean) => {
    if (isPending) return;
    onOpenChange(o);
    if (!o) formik.resetForm();
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      className="w-full max-w-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">
          {isEdit ? "Edit Blog" : "New Blog"}
        </Dialog.Title>
        <ModalClose />
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <TextInput
          label="Title"
          name="title"
          placeholder="Enter blog title..."
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title ? formik.errors.title : undefined}
          required
        />

        <TextArea
          label="Content"
          name="content"
          placeholder="Write your blog content..."
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.content ? formik.errors.content : undefined}
          rows={8}
          required
        />

        {/* Status toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.95rem] font-medium leading-6 text-[var(--text-primary)]">
            Status
          </label>
          <div className="flex gap-2">
            {(["published", "draft"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => formik.setFieldValue("status", s)}
                className={`px-4 py-1.5 rounded-lg text-sm border transition-colors capitalize ${
                  formik.values.status === s
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            {isEdit ? "Save changes" : "Publish"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
