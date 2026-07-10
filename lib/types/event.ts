import type { LocalizedText } from "./content";

export type EventStatus = "upcoming" | "live" | "completed" | "cancelled";

export type EventSeries =
  | "fis-freeride-world-championships"
  | "freeride-world-tour"
  | "fwt-challenger"
  | "fwt-qualifier"
  | "fwt-junior"
  | "freeride-asia";

export type EventItem = {
  id: string;
  name: LocalizedText;
  series: EventSeries;
  country: string;
  venue: string;
  startsAt: string;
  endsAt: string;
  cancelled: boolean;
  summary: LocalizedText;
};
