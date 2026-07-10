import type { EventItem, EventStatus } from "@/lib/types/event";

export function getEventStatus(
  event: Pick<EventItem, "startsAt" | "endsAt" | "cancelled">,
  now = new Date(),
): EventStatus {
  if (event.cancelled) {
    return "cancelled";
  }

  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);

  if (now < startsAt) {
    return "upcoming";
  }

  if (now >= startsAt && now <= endsAt) {
    return "live";
  }

  return "completed";
}
