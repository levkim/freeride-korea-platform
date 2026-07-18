"use server";

import { redirect } from "next/navigation";
import { updateCategoryContentStatus } from "@/lib/repositories/category-content";
import { categoryStatusActionInputSchema } from "@/lib/validation/category-status-action";

function withResult(returnTo: string, result: string, mode?: string) {
  const [path, query = ""] = returnTo.split("?");
  const params = new URLSearchParams(query);

  params.set("result", result);

  if (mode) {
    params.set("mode", mode);
  }

  return `${path}?${params.toString()}`;
}

export async function updateCategoryContentStatusAction(formData: FormData) {
  const parsed = categoryStatusActionInputSchema.safeParse({
    contentId: formData.get("contentId"),
    status: formData.get("status"),
    returnTo: formData.get("returnTo") || "/admin/site-categories",
  });

  if (!parsed.success) {
    redirect("/admin/site-categories?result=invalid-status-action");
  }

  const result = await updateCategoryContentStatus(
    parsed.data.contentId,
    parsed.data.status,
  );

  redirect(withResult(parsed.data.returnTo, "status-updated", result.mode));
}
