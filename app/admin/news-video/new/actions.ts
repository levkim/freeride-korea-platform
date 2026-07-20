"use server";

import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/authz/server";
import { persistNewsVideoDraft } from "@/lib/repositories/news-video";
import { applyUploadedContentImage } from "@/lib/storage/content-images";
import { parseNewsVideoFormData } from "@/lib/validation/news-video-form";

export async function submitNewsVideoDraft(formData: FormData) {
  try {
    await requireAdminAction();
  } catch {
    redirect("/admin/login?error=forbidden&next=/admin/news-video/new");
  }

  try {
    await applyUploadedContentImage(formData, "news-video");
  } catch {
    redirect("/admin/news-video/new?result=invalid");
  }

  const parsed = parseNewsVideoFormData(formData);

  if (!parsed.success) {
    redirect("/admin/news-video/new?result=invalid");
  }

  const result = await persistNewsVideoDraft(parsed.data);

  redirect(`/admin/news-video/new?result=submitted&mode=${result.mode}`);
}
