"use server";

import { redirect } from "next/navigation";
import { persistNewsVideoDraft } from "@/lib/repositories/news-video";
import { parseNewsVideoFormData } from "@/lib/validation/news-video-form";

export async function submitNewsVideoDraft(formData: FormData) {
  const parsed = parseNewsVideoFormData(formData);

  if (!parsed.success) {
    redirect("/admin/news-video/new?result=invalid");
  }

  const result = await persistNewsVideoDraft(parsed.data);

  redirect(`/admin/news-video/new?result=submitted&mode=${result.mode}`);
}
