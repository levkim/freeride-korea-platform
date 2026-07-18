"use server";

import { redirect } from "next/navigation";
import { persistCategoryDraft } from "@/lib/repositories/category-content";
import { parseCategoryContentFormData } from "@/lib/validation/category-content-form";

export async function submitCategoryDraft(formData: FormData) {
  const parsed = parseCategoryContentFormData(formData);

  if (!parsed.success) {
    redirect("/admin/site-categories/new?result=invalid");
  }

  const result = await persistCategoryDraft(parsed.data);
  const status = result.directPublished ? "published" : "submitted";

  redirect(`/admin/site-categories/new?result=${status}&mode=${result.mode}`);
}
