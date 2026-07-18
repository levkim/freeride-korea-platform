import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { EventsTable } from "@/components/admin/EventsTable";
import { Badge } from "@/components/ui/Badge";
import { listAdminEvents } from "@/lib/repositories/events";

const requiredFields = [
  "대회명",
  "시리즈 카테고리",
  "공식 / 비공식 여부",
  "시즌",
  "국가",
  "장소 / 리조트",
  "일정",
  "상태: 일정 기준 자동 계산, 취소만 수동 선택",
  "대표 이미지",
  "짧은 소개문",
  "상세 설명",
  "공식 링크",
  "등록 링크",
  "리플레이 / 결과 링크",
  "관련 뉴스 또는 영상 링크",
];

const seriesGroups = [
  ["오피셜 메이저", "FIS Freeride World Championships"],
  ["월드 투어", "Freeride World Tour"],
  ["선수 성장 루트", "FWT Challenger / Qualifier / Junior"],
  ["지역 대회", "Freeride Asia"],
];

export default async function AdminEventsPage() {
  const events = await listAdminEvents();

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            이벤트 관리
          </p>
          <h1 className="mt-3 text-4xl font-black">대회 / 이벤트</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            Freeride Asia와 FWT 공식 대회 정보를 등록하고 관리합니다. 상태는
            일정 기준으로 예정, 진행중, 완료가 자동 계산되며 취소 상태만
            관리자가 직접 선택합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/events/new"
            className="border border-zinc-300 bg-zinc-200 px-4 py-2 text-sm font-black uppercase text-zinc-950 transition-colors hover:bg-zinc-300"
          >
            새 이벤트 등록
          </Link>
          <Badge tone="blue">상태 자동 계산</Badge>
          <Badge tone="amber">관리자 게시 승인</Badge>
          <Badge tone="neutral">CMS v1</Badge>
        </div>
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-zinc-500">
            대회 카테고리 구조
          </p>
          <div className="mt-5 grid gap-3">
            {seriesGroups.map(([group, value]) => (
              <div
                key={group}
                className="grid gap-2 border-t border-zinc-100 pt-3 md:grid-cols-[180px_1fr]"
              >
                <p className="text-xs font-black uppercase text-[var(--color-fk-red)]">
                  {group}
                </p>
                <p className="font-bold text-zinc-900">{value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-zinc-500">
            게시 규칙
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            뉴스, 비디오, 이벤트는 임원회원 이상이 작성할 수 있고, 실제 게시는
            관리자 승인 후 진행합니다. 작성 등급과 게시 등급은 추후 관리자 권한
            설정에서 조정 가능하도록 설계합니다.
          </p>
        </article>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
              이벤트 목록
            </p>
            <h2 className="mt-2 text-2xl font-black">등록된 대회</h2>
          </div>
          <p className="text-sm font-bold text-zinc-500">
            Supabase 환경변수가 있으면 DB를 읽고, 없으면 seed data를 표시합니다.
          </p>
        </div>
        <EventsTable events={events} />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            입력 필드
          </p>
          <h2 className="mt-3 text-2xl font-black">관리자 입력 폼 기준</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            실제 입력 폼은 이 필드 목록을 기준으로 만들고, 링크와 날짜는 저장
            전에 검증합니다.
          </p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {requiredFields.map((field) => (
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
