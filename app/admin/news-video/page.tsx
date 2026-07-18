import { AdminShell } from "@/components/admin/AdminShell";
import { NewsVideoTable } from "@/components/admin/NewsVideoTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { listAdminNewsVideoItems } from "@/lib/repositories/news-video";

const entryFields = [
  "게시물 종류: 뉴스 / 비디오",
  "제목: 한국어 / 영어",
  "짧은 소개문: 한국어 / 영어",
  "본문 텍스트",
  "대표 이미지",
  "유튜브 링크",
  "외부 원문 링크",
  "태그",
  "게시일",
  "작성 가능 등급",
  "게시 승인 등급",
];

export default async function AdminNewsVideoPage() {
  const newsVideoItems = await listAdminNewsVideoItems();

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            콘텐츠 관리
          </p>
          <h1 className="mt-3 text-4xl font-black">뉴스 / 비디오</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            뉴스와 영상 게시물을 같은 구조로 관리하되, 게시물 종류만 구분합니다.
            유튜브 링크, 대표 이미지, 본문 텍스트, 외부 원문 링크를 함께 등록하고
            관리자 승인 후 게시합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">뉴스</Badge>
          <Badge tone="red">비디오</Badge>
          <Badge tone="amber">관리자 게시 승인</Badge>
          <Button href="/admin/news-video/new" variant="secondary">
            새 초안 작성
          </Button>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
              콘텐츠 목록
            </p>
            <h2 className="mt-2 text-2xl font-black">등록된 게시물</h2>
          </div>
          <p className="text-sm font-bold text-zinc-500">
            Supabase 환경변수가 있으면 DB를 읽고, 없으면 seed data를 표시합니다.
          </p>
        </div>
        <NewsVideoTable items={newsVideoItems} />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            입력 필드
          </p>
          <h2 className="mt-3 text-2xl font-black">관리자 입력 폼 기준</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            뉴스와 비디오는 임원회원 이상이 작성할 수 있고, 실제 공개는 관리자
            승인 후 진행하는 흐름으로 설계합니다.
          </p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {entryFields.map((field) => (
            <div
              key={field}
              className="border border-zinc-200 bg-white px-4 py-3 text-sm font-bold"
            >
              {field}
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
