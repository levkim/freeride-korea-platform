import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getEventStatus } from "@/lib/dates/event-status";
import type { EventItem, EventSeries } from "@/lib/types/event";

const seriesLabels: Record<EventSeries, string> = {
  "fis-freeride-world-championships": "FIS Freeride World Championships",
  "freeride-world-tour": "Freeride World Tour",
  "fwt-challenger": "FWT Challenger",
  "fwt-qualifier": "FWT Qualifier",
  "fwt-junior": "FWT Junior",
  "freeride-asia": "Freeride Asia",
};

const officialityLabels = {
  official: "공식",
  unofficial: "비공식",
};

type EventsTableProps = {
  events: EventItem[];
};

export function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="overflow-hidden border border-zinc-200 bg-white">
      <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-4 py-3">대회명</th>
            <th className="px-4 py-3">시리즈</th>
            <th className="px-4 py-3">공식 여부</th>
            <th className="px-4 py-3">시즌</th>
            <th className="px-4 py-3">국가</th>
            <th className="px-4 py-3">장소 / 리조트</th>
            <th className="px-4 py-3">일정</th>
            <th className="px-4 py-3">상태</th>
            <th className="px-4 py-3">링크</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const status = getEventStatus(event);

            return (
              <tr key={event.id} className="border-t border-zinc-100 align-top">
                <td className="px-4 py-4">
                  <p className="font-black">{event.name.ko}</p>
                </td>
                <td className="px-4 py-4 font-bold">{seriesLabels[event.series]}</td>
                <td className="px-4 py-4">
                  <Badge tone={event.officiality === "official" ? "blue" : "neutral"}>
                    {officialityLabels[event.officiality]}
                  </Badge>
                </td>
                <td className="px-4 py-4 font-bold">{event.season}</td>
                <td className="px-4 py-4">{event.country}</td>
                <td className="px-4 py-4">
                  <p className="font-bold">{event.location}</p>
                  {event.resort ? (
                    <p className="mt-1 text-zinc-500">{event.resort}</p>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-zinc-600">
                  <p>{event.startsAt.slice(0, 10)}</p>
                  <p>{event.endsAt.slice(0, 10)}</p>
                  <p className="mt-1 text-xs">{event.timezone}</p>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={status} />
                  {event.cancelled ? (
                    <p className="mt-2 text-xs font-bold text-[var(--color-fk-red)]">
                      취소 수동 설정
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  <div className="grid gap-1 text-xs font-bold">
                    {event.officialLink ? <span>공식 링크</span> : null}
                    {event.registrationLink ? <span>등록 링크</span> : null}
                    {event.replayOrResultsLink ? <span>리플레이 / 결과</span> : null}
                    {event.relatedLinks.length > 0 ? (
                      <span>관련 링크 {event.relatedLinks.length}개</span>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
