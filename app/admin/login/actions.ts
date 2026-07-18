"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const adminCookieName = "fk_admin_access";

function getSafeReturnPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/admin")) {
    return "/admin";
  }

  if (value.startsWith("/admin/login")) {
    return "/admin";
  }

  return value;
}

export async function verifyAdminAccess(formData: FormData) {
  const configuredKey = process.env.ADMIN_ACCESS_KEY;
  const inputKey = String(formData.get("accessKey") || "");
  const nextPath = getSafeReturnPath(formData.get("next"));

  if (!configuredKey) {
    redirect(`${nextPath}?adminAccess=not-configured`);
  }

  if (inputKey !== configuredKey) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, configuredKey, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });

  redirect(nextPath);
}
