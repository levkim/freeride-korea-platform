import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Badge } from "@/components/ui/Badge";
import { submitNewsVideoDraft } from "@/app/admin/news-video/new/actions";

type AdminNewsVideoNewPageProps = {
  searchParams?: Promise<{
    result?: string;
    mode?: string;
  }>;
};

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

export const metadata = {
  title: "뉴스 / 비디오 초안 작성 | FREERIDE KOREA Admin",
};

export default async function AdminNewsVideoNewPage({
  searchParams,
}: AdminNewsVideoNewPageProps) {
  const resolvedSearchParams = await searchParams;
  const result = resolvedSearchParams?.result;
  const mode = resolvedSearchParams?.mode;

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            뉴스·영상 초안
          </p>
          <h1 className="mt-3 text-4xl font-black">뉴스 / 비디오 초안 작성</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            뉴스와 영상 게시물을 같은 구조로 등록합니다. 비디오 게시물은
            YouTube 링크가 필요하며, 모든 초안은 검토 대기열로 이동한 뒤
            관리자 게시 승인을 거칩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">임원 초안</Badge>
          <Badge tone="amber">관리자 게시</Badge>
          <Link
            href="/admin/news-video"
            className="border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            목록으로
          </Link>
        </div>
      </div>

      {result ? (
        <div
          className={`mt-6 border p-4 text-sm font-bold leading-6 ${
            result === "invalid"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {result === "invalid"
            ? "입력값을 확인해 주세요. 비디오 게시물은 YouTube 링크가 필요합니다."
            : `뉴스/비디오 초안이 검토 대기열로 제출되었습니다. (${mode ?? "mock"})`}
          {mode === "mock" ? (
            <span className="mt-2 block">
              현재 Supabase 환경변수가 없어 DB 저장 없이 검증 모드로
              처리되었습니다.
            </span>
          ) : null}
        </div>
      ) : null}

      <form
        action={submitNewsVideoDraft}
        encType="multipart/form-data"
        className="mt-8 grid gap-8"
      >
        <section className="grid gap-5 border border-zinc-200 bg-white p-5 shadow-[var(--shadow-diffused)]">
          <SectionIntro
            eyebrow="기본 분류"
            title="게시물 종류와 공개 기준"
            description="뉴스인지 비디오인지 먼저 선택하고, 공개 예정일과 검색·분류에 사용할 태그를 입력합니다. 비디오 게시물은 아래 미디어 영역의 YouTube 링크가 필요합니다."
          />
          <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              게시물 종류
            </span>
            <select
              name="kind"
              className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
            >
              <option value="news">뉴스</option>
              <option value="video">비디오</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              게시 예정일
            </span>
            <input
              type="date"
              name="publishedAt"
              required
              className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              태그
            </span>
            <input
              name="tags"
              placeholder="athlete, safety, fwt"
              className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
            />
          </label>
          </div>
        </section>

        <section className="grid gap-5 border border-zinc-200 bg-white p-5">
          <SectionIntro
            eyebrow="본문 작성"
            title="목록용 요약과 상세 본문"
            description="제목과 요약은 카드형 목록에서 먼저 보이고, 본문은 상세 페이지에서 읽히는 내용입니다. 한국어 운영을 기준으로 작성합니다."
          />
          <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              제목
            </span>
            <input
              name="titleKo"
              required
              className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
            />
          </label>
          </div>

          <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              요약
            </span>
            <textarea
              name="summaryKo"
              required
              className="min-h-24 border border-zinc-300 bg-white px-3 py-2 text-sm font-bold leading-6 text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
            />
          </label>
          </div>

          <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              본문
            </span>
            <textarea
              name="bodyKo"
              required
              className="min-h-44 border border-zinc-300 bg-white px-3 py-2 text-sm font-bold leading-6 text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
            />
          </label>
          </div>
        </section>

        <section className="grid gap-5 border border-zinc-200 bg-white p-5">
          <SectionIntro
            eyebrow="미디어와 출처"
            title="대표 이미지, 영상, 원문 링크"
            description="대표 이미지는 목록과 상세 페이지에 사용됩니다. YouTube 링크를 넣으면 비디오 게시물 화면에서 바로 재생 영역으로 연결할 수 있고, 외부 원문 링크는 출처 확인용으로 사용합니다."
          />
          <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-3">
            <ImageUploadField required />
          </div>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              YouTube URL
            </span>
            <input
              name="youtubeUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              외부 원문 URL
            </span>
            <input
              name="sourceUrl"
              placeholder="https://..."
              className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
            />
          </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="h-11 border border-zinc-400 bg-zinc-200 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-300"
          >
            검토 대기열로 제출
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
