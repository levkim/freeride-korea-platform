"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const adminCookieName = "fk_admin_access";

export async function signOutAdminAccess() {
  const cookieStore = await cookies();

  cookieStore.delete(adminCookieName);

  redirect("/admin/login?loggedOut=1");
}
