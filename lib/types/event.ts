import type { LocalizedText } from "./content";

export type EventStatus = "upcoming" | "live" | "completed" | "cancelled";

export type EventOfficiality = "official" | "unofficial";

export type EventSeries =
  | "fis-freeride-world-championships"
  | "freeride-world-tour"
  | "fwt-challenger"
  | "fwt-qualifier"
  | "fwt-junior"
  | "freeride-asia";

export type EventLink = {
  label: string;
  url: string;
};

export type EventItem = {
  id: string;
  name: LocalizedText;
  series: EventSeries;
  officiality: EventOfficiality;
  season: string;
  country: string;
  location: string;
  resort?: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  cancelled: boolean;
  imageUrl?: string;
  summary: LocalizedText;
  description: LocalizedText;
  officialLink?: string;
  registrationLink?: string;
  replayOrResultsLink?: string;
  relatedLinks: EventLink[];
};
