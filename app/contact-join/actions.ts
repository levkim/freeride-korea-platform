"use server";

import { redirect } from "next/navigation";
import { persistInquiry } from "@/lib/repositories/inquiries";
import { inquiryInputSchema } from "@/lib/validation/inquiry";

export async function submitInquiry(formData: FormData) {
  const parsed = inquiryInputSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    ridingExperience: formData.get("ridingExperience"),
    requestedMemberType: formData.get("requestedMemberType"),
    title: formData.get("title"),
    message: formData.get("message"),
    privacyAccepted: formData.get("privacyAccepted") === "on",
  });

  if (!parsed.success) {
    redirect("/contact-join?status=invalid");
  }

  const result = await persistInquiry(parsed.data);

  redirect(`/contact-join?status=received&mode=${result.mode}`);
}
