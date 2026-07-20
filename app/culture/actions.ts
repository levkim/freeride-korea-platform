"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  hideMemberBoardPost,
  persistMemberBoardPost,
  updateMemberBoardPost,
} from "@/lib/repositories/category-content";
import {
  persistMemberComment,
  reportMemberComment,
} from "@/lib/repositories/comments";
import { getCurrentMemberSession } from "@/lib/repositories/member-auth";

const boardKindSchema = z.enum(["culture", "marketplace", "resource"]);

const memberBoardPostSchema = z.object({
  id: z.string().trim().optional(),
  kind: boardKindSchema,
  subtype: z.string().trim().min(1, "세부 유형을 선택해 주세요."),
  title: z.string().trim().min(2, "제목을 입력해 주세요."),
  summary: z.string().trim().min(10, "요약을 10자 이상 입력해 주세요."),
  body: z.string().trim().min(20, "본문을 20자 이상 입력해 주세요."),
  imageUrl: z.string().trim().optional(),
  relatedLink: z.string().trim().optional(),
});

const memberCommentSchema = z.object({
  targetType: z.enum(["news-video", "event", "category-content"]),
  targetId: z.string().trim().min(1),
  body: z.string().trim().min(2, "댓글을 입력해 주세요.").max(1000),
  returnTo: z.string().trim().min(1),
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function getSignedInMemberId() {
  const session = await getCurrentMemberSession();

  if (!session.user?.email || !session.member?.id) {
    return null;
  }

  return session.member.id;
}

export async function createMemberBoardPostAction(formData: FormData) {
  const parsed = memberBoardPostSchema.safeParse({
    kind: formData.get("kind"),
    subtype: formData.get("subtype"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    imageUrl: formData.get("imageUrl"),
    relatedLink: formData.get("relatedLink"),
  });

  if (!parsed.success) {
    redirect("/culture/new?result=invalid");
  }

  const authorId = await getSignedInMemberId();

  if (!authorId) {
    redirect("/account?auth=signin-required");
  }

  let nextPath = "/culture/new?result=error";

  try {
    const result = await persistMemberBoardPost({
      authorId,
      ...parsed.data,
    });

    nextPath = result.contentId
      ? `/culture/${result.contentId}?result=created`
      : "/culture?result=created";
  } catch {
    nextPath = "/culture/new?result=error";
  }

  redirect(nextPath);
}

export async function updateMemberBoardPostAction(formData: FormData) {
  const parsed = memberBoardPostSchema.safeParse({
    id: formData.get("id"),
    kind: formData.get("kind"),
    subtype: formData.get("subtype"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    imageUrl: formData.get("imageUrl"),
    relatedLink: formData.get("relatedLink"),
  });

  if (!parsed.success || !parsed.data.id) {
    redirect("/culture?result=invalid");
  }

  const authorId = await getSignedInMemberId();

  if (!authorId) {
    redirect("/account?auth=signin-required");
  }

  let nextPath = `/culture/${parsed.data.id}/edit?result=error`;

  try {
    await updateMemberBoardPost({
      id: parsed.data.id,
      authorId,
      kind: parsed.data.kind,
      subtype: parsed.data.subtype,
      title: parsed.data.title,
      summary: parsed.data.summary,
      body: parsed.data.body,
      imageUrl: parsed.data.imageUrl,
      relatedLink: parsed.data.relatedLink,
    });

    nextPath = `/culture/${parsed.data.id}?result=updated`;
  } catch {
    nextPath = `/culture/${parsed.data.id}/edit?result=error`;
  }

  redirect(nextPath);
}

export async function hideMemberBoardPostAction(formData: FormData) {
  const id = getString(formData, "id");
  const authorId = await getSignedInMemberId();

  if (!id) {
    redirect("/culture?result=invalid");
  }

  if (!authorId) {
    redirect("/account?auth=signin-required");
  }

  let nextPath = `/culture/${id}/edit?result=error`;

  try {
    await hideMemberBoardPost(id, authorId);
    nextPath = "/account?auth=post-hidden";
  } catch {
    nextPath = `/culture/${id}/edit?result=error`;
  }

  redirect(nextPath);
}

export async function createMemberCommentAction(formData: FormData) {
  const parsed = memberCommentSchema.safeParse({
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    body: formData.get("body"),
    returnTo: formData.get("returnTo"),
  });

  if (!parsed.success) {
    redirect(getString(formData, "returnTo") || "/culture");
  }

  const authorId = await getSignedInMemberId();

  if (!authorId) {
    redirect("/account?auth=signin-required");
  }

  try {
    await persistMemberComment({
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      authorId,
      body: parsed.data.body,
    });
  } catch {
    redirect(`${parsed.data.returnTo}?comment=error`);
  }

  redirect(`${parsed.data.returnTo}?comment=created`);
}

export async function reportMemberCommentAction(formData: FormData) {
  const commentId = getString(formData, "commentId");
  const returnTo = getString(formData, "returnTo") || "/culture";

  if (!commentId) {
    redirect(returnTo);
  }

  try {
    await reportMemberComment(commentId);
  } catch {
    redirect(`${returnTo}?comment=report-error`);
  }

  redirect(`${returnTo}?comment=reported`);
}
