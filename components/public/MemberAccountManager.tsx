import {
  requestMemberWithdrawalAction,
  updateMemberEmailAction,
  updateMemberPasswordAction,
  updateMemberProfileAction,
} from "@/app/account/actions";
import type { CommentItem } from "@/lib/types/comment";
import type { InquiryItem } from "@/lib/types/inquiry";
import type {
  Member,
  MemberContentActivity,
  MemberProfile,
} from "@/lib/types/member";

const inquiryTypeLabels: Record<string, string> = {
  "athlete-program": "선수 프로그램",
  education: "교육",
  "freeride-tour": "프리라이드 투어",
  membership: "회원가입 / 등급",
  "business-partner": "협력업체",
  sponsorship: "스폰서십",
  media: "미디어",
  general: "일반 문의",
};

const statusLabels: Record<string, string> = {
  new: "신규",
  reviewing: "검토중",
  needs_reply: "답변 필요",
  closed: "종료",
  draft: "초안",
  review: "검토",
  needs_revision: "수정 요청",
  approved: "승인",
  published: "게시",
  rejected: "반려",
  hidden: "숨김",
  archived: "보관",
  visible: "노출",
  reported: "신고됨",
  deleted: "삭제됨",
};

const fieldClass =
  "h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]";

function TextField({
  label,
  name,
  defaultValue,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className={fieldClass}
      />
    </label>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm font-bold text-zinc-500">
      {text}
    </div>
  );
}

function getCommentHref(comment: CommentItem) {
  if (comment.targetType === "event") {
    return `/events/${comment.targetId}`;
  }

  if (comment.targetType === "news-video") {
    return `/news-video/${comment.targetId}`;
  }

  return `/culture/${comment.targetId}`;
}

export function MemberAccountManager({
  member,
  email,
  profile,
  inquiries,
  contents,
  comments,
}: {
  member: Member | null;
  email: string;
  profile: MemberProfile;
  inquiries: InquiryItem[];
  contents: MemberContentActivity[];
  comments: CommentItem[];
}) {
  return (
    <div className="mt-6 grid gap-5">
      <form action={updateMemberProfileAction} className="border border-zinc-200 bg-zinc-50 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[var(--color-fk-blue)]">
              Profile
            </p>
            <h4 className="mt-2 text-2xl font-black">내 정보 수정</h4>
          </div>
          <button
            type="submit"
            className="h-11 border border-zinc-300 bg-zinc-100 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            정보 저장
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextField
            label="이름"
            name="name"
            defaultValue={profile.realName}
            autoComplete="name"
            required
          />
          <TextField
            label="닉네임"
            name="nickname"
            defaultValue={profile.nickname}
            autoComplete="nickname"
            required
          />
          <TextField
            label="연락처"
            name="phone"
            defaultValue={profile.phone}
            autoComplete="tel"
          />
          <TextField
            label="주 활동 지역"
            name="location"
            defaultValue={profile.location}
          />
          <TextField
            label="라이딩 레벨"
            name="ridingLevel"
            defaultValue={profile.ridingLevel}
          />
          <TextField
            label="관심 분야"
            name="preferredDiscipline"
            defaultValue={profile.preferredDiscipline}
          />
        </div>
        <label className="mt-4 grid gap-2 text-sm font-bold">
          프로필 소개
          <textarea
            name="bio"
            rows={4}
            defaultValue={profile.bio}
            className="resize-y border border-zinc-300 bg-white px-3 py-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
          />
        </label>
      </form>

      <div className="grid gap-5 lg:grid-cols-2">
        <form action={updateMemberEmailAction} className="border border-zinc-200 bg-white p-5">
          <p className="text-xs font-black uppercase text-[var(--color-fk-blue)]">
            Email
          </p>
          <h4 className="mt-2 text-xl font-black">이메일 변경</h4>
          <p className="mt-2 text-sm font-bold leading-6 text-zinc-600">
            새 이메일로 인증 메일이 발송될 수 있습니다. 인증 전까지 현재 이메일로
            로그인해야 할 수 있습니다.
          </p>
          <div className="mt-4">
            <TextField
              label="새 이메일"
              name="email"
              type="email"
              defaultValue={email}
              autoComplete="email"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 h-11 border border-zinc-300 bg-zinc-100 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            이메일 변경 요청
          </button>
        </form>

        <form action={updateMemberPasswordAction} className="border border-zinc-200 bg-white p-5">
          <p className="text-xs font-black uppercase text-[var(--color-fk-red)]">
            Password
          </p>
          <h4 className="mt-2 text-xl font-black">비밀번호 변경</h4>
          <div className="mt-4 grid gap-4">
            <TextField
              label="새 비밀번호"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
            <TextField
              label="새 비밀번호 확인"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 h-11 border border-zinc-300 bg-zinc-100 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            비밀번호 변경
          </button>
        </form>
      </div>

      <section className="border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[var(--color-fk-blue)]">
              Activity
            </p>
            <h4 className="mt-2 text-2xl font-black">내 신청 / 게시글 / 댓글</h4>
          </div>
          <p className="text-sm font-bold text-zinc-500">
            회원: {member?.name ?? email}
          </p>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          <div>
            <h5 className="font-black">내 신청/문의</h5>
            <div className="mt-3 grid gap-2">
              {inquiries.length ? (
                inquiries.map((item) => (
                  <div
                    key={item.id}
                    className="border border-zinc-200 bg-zinc-50 p-3"
                  >
                    <p className="text-xs font-black text-zinc-500">
                      {inquiryTypeLabels[item.type] ?? item.type} ·{" "}
                      {statusLabels[item.status] ?? item.status}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-black">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs font-bold text-zinc-500">
                      {item.createdAt}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState text="아직 신청/문의 내역이 없습니다." />
              )}
            </div>
          </div>

          <div>
            <h5 className="font-black">내 게시글</h5>
            <div className="mt-3 grid gap-2">
              {contents.length ? (
                contents.map((item) => (
                  <div key={item.id} className="border border-zinc-200 bg-zinc-50 p-3">
                    <p className="text-xs font-black text-zinc-500">
                      {item.kind} · {statusLabels[item.status] ?? item.status}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-black">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs font-bold text-zinc-500">
                      {item.createdAt}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState text="아직 작성한 게시글이 없습니다." />
              )}
            </div>
          </div>

          <div>
            <h5 className="font-black">내 댓글</h5>
            <div className="mt-3 grid gap-2">
              {comments.length ? (
                comments.map((item) => (
                  <a
                    key={item.id}
                    href={getCommentHref(item)}
                    className="block border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:bg-zinc-100"
                  >
                    <p className="text-xs font-black text-zinc-500">
                      {statusLabels[item.status] ?? item.status} ·{" "}
                      {item.createdAt.slice(0, 10)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-black">
                      {item.body}
                    </p>
                    <p className="mt-1 text-xs font-bold text-zinc-500">
                      {item.targetTitle}
                    </p>
                  </a>
                ))
              ) : (
                <EmptyState text="아직 작성한 댓글이 없습니다." />
              )}
            </div>
          </div>
        </div>
      </section>

      <form action={requestMemberWithdrawalAction} className="border border-red-200 bg-red-50 p-5">
        <p className="text-xs font-black uppercase text-red-700">Withdrawal</p>
        <h4 className="mt-2 text-xl font-black text-red-950">회원 탈퇴 요청</h4>
        <p className="mt-2 text-sm font-bold leading-6 text-red-900">
          탈퇴는 즉시 삭제하지 않고 운영진 검토 요청으로 접수됩니다. 작성한 게시글,
          댓글, 신청 내역 처리 기준을 확인한 뒤 진행합니다.
        </p>
        <label className="mt-4 grid gap-2 text-sm font-bold text-red-950">
          요청 사유
          <textarea
            name="reason"
            rows={3}
            className="resize-y border border-red-200 bg-white px-3 py-3 text-sm font-bold text-zinc-900 outline-none focus:border-red-500"
          />
        </label>
        <button
          type="submit"
          className="mt-4 h-11 border border-red-200 bg-white px-5 text-sm font-black text-red-950 transition-colors hover:bg-red-100"
        >
          탈퇴 검토 요청
        </button>
      </form>
    </div>
  );
}
