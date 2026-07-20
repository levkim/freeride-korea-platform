import { notFound, redirect } from "next/navigation";

import { MemberBoardPostForm } from "@/components/public/MemberBoardPostForm";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import {
  getMemberBoardPostOwner,
  getMemberEditableCategoryContentById,
} from "@/lib/repositories/category-content";
import { getCurrentMemberSession } from "@/lib/repositories/member-auth";

type EditCulturePostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditCulturePostPage({
  params,
}: EditCulturePostPageProps) {
  const { id } = await params;
  const session = await getCurrentMemberSession();

  if (!session.user?.email || !session.member?.id) {
    redirect("/account?auth=signin-required");
  }

  const [item, owner] = await Promise.all([
    getMemberEditableCategoryContentById(id),
    getMemberBoardPostOwner(id),
  ]);

  if (!item || !owner) {
    notFound();
  }

  if (owner.author_id !== session.member.id) {
    redirect("/account?auth=post-forbidden");
  }

  return (
    <>
      <SiteHeader />
      <main>
        <MemberBoardPostForm item={item} mode="edit" />
      </main>
      <SiteFooter />
    </>
  );
}
