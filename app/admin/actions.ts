"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { adminCookieName } from "@/lib/admin/access-key";

export async function signOutAdminAccess() {
  const cookieStore = await cookies();

  cookieStore.delete(adminCookieName);

  redirect("/admin/login?loggedOut=1");
}
