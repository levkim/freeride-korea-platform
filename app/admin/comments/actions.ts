"use server";

import { redirect } from "next/navigation";
import { persistCommentAction } from "@/lib/repositories/comments";
import { commentActionInputSchema } from "@/lib/validation/comment-action";

function withResult(returnTo: string, result: string, mode?: string) {
  const [path, query = ""] = returnTo.split("?");
  const params = new URLSearchParams(query);

  params.set("result", result);

  if (mode) {
    params.set("mode", mode);
  }

  return `${path}?${params.toString()}`;
}

export async function updateCommentAction(formData: FormData) {
  const parsed = commentActionInputSchema.safeParse({
    commentId: formData.get("commentId"),
    action: formData.get("action"),
    returnTo: formData.get("returnTo") || "/admin/comments",
  });

  if (!parsed.success) {
    redirect("/admin/comments?result=invalid-action");
  }

  const result = await persistCommentAction(parsed.data);

  redirect(withResult(parsed.data.returnTo, "comment-action", result.mode));
}
