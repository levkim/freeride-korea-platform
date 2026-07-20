"use server";

import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/authz/server";
import { persistCategoryDraft } from "@/lib/repositories/category-content";
import { parseCategoryContentFormData } from "@/lib/validation/category-content-form";

export async function submitCategoryDraft(formData: FormData) {
  try {
    await requireAdminAction();
  } catch {
    redirect("/admin/login?error=forbidden&next=/admin/site-categories/new");
  }

  const parsed = parseCategoryContentFormData(formData);

  if (!parsed.success) {
    redirect("/admin/site-categories/new?result=invalid");
  }

  const result = await persistCategoryDraft(parsed.data);
  const status = result.directPublished ? "published" : "submitted";

  redirect(`/admin/site-categories/new?result=${status}&mode=${result.mode}`);
}
