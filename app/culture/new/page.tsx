import { redirect } from "next/navigation";

import { MemberBoardPostForm } from "@/components/public/MemberBoardPostForm";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getCurrentMemberSession } from "@/lib/repositories/member-auth";

export const dynamic = "force-dynamic";

export default async function NewCulturePostPage() {
  const session = await getCurrentMemberSession();

  if (!session.user?.email || !session.member?.id) {
    redirect("/account?auth=signin-required");
  }

  return (
    <>
      <SiteHeader />
      <main>
        <MemberBoardPostForm />
      </main>
      <SiteFooter />
    </>
  );
}
