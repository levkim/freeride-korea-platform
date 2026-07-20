"use server";

import { redirect } from "next/navigation";
import { updateMember } from "@/lib/repositories/members";
import { memberUpdateActionSchema } from "@/lib/validation/member-action";

export async function submitMemberUpdate(formData: FormData) {
  const parsed = memberUpdateActionSchema.safeParse({
    memberId: formData.get("memberId"),
    memberType: formData.get("memberType"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect("/admin/members?result=invalid");
  }

  const result = await updateMember(parsed.data);

  redirect(
    `/admin/members?result=updated&member=${parsed.data.memberId}&mode=${result.mode}`,
  );
}
