import {
  createMemberBoardPostAction,
  hideMemberBoardPostAction,
  updateMemberBoardPostAction,
} from "@/app/culture/actions";
import type { CategoryContentItem } from "@/lib/types/content";

const inputClass =
  "h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]";

const textareaClass =
  "resize-y border border-zinc-300 bg-white px-3 py-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]";

const kindOptions = [
  { value: "culture", label: "컬쳐" },
  { value: "marketplace", label: "중고장터" },
  { value: "resource", label: "자료실" },
];

const subtypeOptions = [
  "자유게시판",
  "포토제닉",
  "프리라이드 핫스팟",
  "산악윤리",
  "중고장터",
  "자료실",
];

export function MemberBoardPostForm({
  item,
  mode = "create",
}: {
  item?: CategoryContentItem | null;
  mode?: "create" | "edit";
}) {
  const isEdit = mode === "edit" && item;

  return (
    <section className="mx-auto max-w-5xl px-5 py-14">
      <form
        action={isEdit ? updateMemberBoardPostAction : createMemberBoardPostAction}
        className="border border-zinc-200 bg-white p-6 shadow-[var(--shadow-diffused)]"
      >
        {isEdit ? <input type="hidden" name="id" value={item.id} /> : null}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              Member Post
            </p>
            <h1 className="mt-3 text-4xl font-black">
              {isEdit ? "게시글 수정" : "회원 게시글 작성"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-zinc-600">
              컬쳐, 중고장터, 자료실은 회원이 직접 작성할 수 있습니다. 작성한 글은
              바로 게시되며, 운영 기준 위반 또는 신고 접수 시 숨김 처리될 수 있습니다.
            </p>
          </div>
          <button
            type="submit"
            className="h-11 border border-zinc-300 bg-zinc-100 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            {isEdit ? "수정 저장" : "게시하기"}
          </button>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold">
            게시판
            <select
              name="kind"
              defaultValue={item?.kind ?? "culture"}
              className={inputClass}
            >
              {kindOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold">
            세부 유형
            <select
              name="subtype"
              defaultValue={item?.subtype ?? "자유게시판"}
              className={inputClass}
            >
              {subtypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold md:col-span-2">
            제목
            <input
              name="title"
              required
              defaultValue={item?.title.ko ?? ""}
              className={inputClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold md:col-span-2">
            짧은 요약
            <textarea
              name="summary"
              rows={3}
              required
              defaultValue={item?.summary.ko ?? ""}
              className={textareaClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold md:col-span-2">
            본문
            <textarea
              name="body"
              rows={10}
              required
              defaultValue={item?.body.ko ?? ""}
              className={textareaClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            대표 이미지 URL
            <input
              name="imageUrl"
              defaultValue={item?.imageUrl ?? ""}
              placeholder="/brand/hero-training.png"
              className={inputClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            관련 링크
            <input
              name="relatedLink"
              defaultValue={item?.relatedLink ?? ""}
              placeholder="https://"
              className={inputClass}
            />
          </label>
        </div>
      </form>

      {isEdit ? (
        <form action={hideMemberBoardPostAction} className="mt-5 border border-red-200 bg-red-50 p-5">
          <input type="hidden" name="id" value={item.id} />
          <h2 className="text-xl font-black text-red-950">게시글 숨김 처리</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-red-900">
            삭제 대신 숨김 상태로 전환합니다. 운영 기록과 댓글 연결을 보존하기 위한
            방식입니다.
          </p>
          <button
            type="submit"
            className="mt-4 h-11 border border-red-200 bg-white px-5 text-sm font-black text-red-950 transition-colors hover:bg-red-100"
          >
            내 게시글 숨기기
          </button>
        </form>
      ) : null}
    </section>
  );
}
