"use server";

import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/authz/server";
import {
  getAdminCategoryContentById,
  updateCategoryDraft,
} from "@/lib/repositories/category-content";
import { applyUploadedContentImage } from "@/lib/storage/content-images";
import { parseCategoryContentFormData } from "@/lib/validation/category-content-form";

export async function updateCategoryContentDraft(id: string, formData: FormData) {
  try {
    await requireAdminAction();
  } catch {
    redirect(`/admin/login?error=forbidden&next=/admin/site-categories/${id}/edit`);
  }

  try {
    const currentItem = await getAdminCategoryContentById(id);
    await applyUploadedContentImage(
      formData,
      "category-content",
      currentItem?.imageUrl,
    );
  } catch {
    redirect(`/admin/site-categories/${id}/edit?result=invalid`);
  }

  const parsed = parseCategoryContentFormData(formData);

  if (!parsed.success) {
    redirect(`/admin/site-categories/${id}/edit?result=invalid`);
  }

  const result = await updateCategoryDraft(id, parsed.data);
  const status = result.directPublished ? "published" : "updated";

  redirect(
    `/admin/site-categories/${id}/edit?result=${status}&mode=${result.mode}`,
  );
}
