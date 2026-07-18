"use server";

import { redirect } from "next/navigation";
import { updateCategoryDraft } from "@/lib/repositories/category-content";
import { parseCategoryContentFormData } from "@/lib/validation/category-content-form";

export async function updateCategoryContentDraft(id: string, formData: FormData) {
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
