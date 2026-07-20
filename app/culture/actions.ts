"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  assertMemberCanAuthor,
  getSignedInMemberOrThrow,
} from "@/lib/authz/server";
import {
  hideMemberBoardPost,
  getMemberEditableCategoryContentById,
  persistMemberBoardPost,
  updateMemberBoardPost,
} from "@/lib/repositories/category-content";
import {
  persistMemberComment,
  reportMemberComment,
} from "@/lib/repositories/comments";
import { applyUploadedContentImage } from "@/lib/storage/content-images";

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

  let signedInMember;

  try {
    signedInMember = await getSignedInMemberOrThrow();
    assertMemberCanAuthor(
      signedInMember.member,
      parsed.data.kind,
      parsed.data.subtype,
    );
    await applyUploadedContentImage(formData, "member-board");
  } catch {
    redirect("/account?auth=signin-required");
  }

  const parsedWithImage = memberBoardPostSchema.safeParse({
    kind: formData.get("kind"),
    subtype: formData.get("subtype"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    imageUrl: formData.get("imageUrl"),
    relatedLink: formData.get("relatedLink"),
  });

  if (!parsedWithImage.success) {
    redirect("/culture/new?result=invalid");
  }

  let nextPath = "/culture/new?result=error";

  try {
    const result = await persistMemberBoardPost({
      authorId: signedInMember.member.id,
      ...parsedWithImage.data,
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

  let signedInMember;

  try {
    signedInMember = await getSignedInMemberOrThrow();
    assertMemberCanAuthor(
      signedInMember.member,
      parsed.data.kind,
      parsed.data.subtype,
    );
    const currentItem = await getMemberEditableCategoryContentById(parsed.data.id);
    await applyUploadedContentImage(
      formData,
      "member-board",
      currentItem?.imageUrl,
    );
  } catch {
    redirect("/account?auth=signin-required");
  }

  const parsedWithImage = memberBoardPostSchema.safeParse({
    id: formData.get("id"),
    kind: formData.get("kind"),
    subtype: formData.get("subtype"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    imageUrl: formData.get("imageUrl"),
    relatedLink: formData.get("relatedLink"),
  });

  if (!parsedWithImage.success || !parsedWithImage.data.id) {
    redirect("/culture?result=invalid");
  }

  let nextPath = `/culture/${parsedWithImage.data.id}/edit?result=error`;

  try {
    await updateMemberBoardPost({
      id: parsedWithImage.data.id,
      authorId: signedInMember.member.id,
      kind: parsedWithImage.data.kind,
      subtype: parsedWithImage.data.subtype,
      title: parsedWithImage.data.title,
      summary: parsedWithImage.data.summary,
      body: parsedWithImage.data.body,
      imageUrl: parsedWithImage.data.imageUrl,
      relatedLink: parsedWithImage.data.relatedLink,
    });

    nextPath = `/culture/${parsedWithImage.data.id}?result=updated`;
  } catch {
    nextPath = `/culture/${parsedWithImage.data.id}/edit?result=error`;
  }

  redirect(nextPath);
}

export async function hideMemberBoardPostAction(formData: FormData) {
  const id = getString(formData, "id");
  let signedInMember;

  if (!id) {
    redirect("/culture?result=invalid");
  }

  try {
    signedInMember = await getSignedInMemberOrThrow();
  } catch {
    redirect("/account?auth=signin-required");
  }

  let nextPath = `/culture/${id}/edit?result=error`;

  try {
    await hideMemberBoardPost(id, signedInMember.member.id);
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

  let signedInMember;

  try {
    signedInMember = await getSignedInMemberOrThrow();
  } catch {
    redirect("/account?auth=signin-required");
  }

  try {
    await persistMemberComment({
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      authorId: signedInMember.member.id,
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
    await getSignedInMemberOrThrow();
  } catch {
    redirect("/account?auth=signin-required");
  }

  try {
    await reportMemberComment(commentId);
  } catch {
    redirect(`${returnTo}?comment=report-error`);
  }

  redirect(`${returnTo}?comment=reported`);
}
