import type { EventSeries } from "@/lib/types/event";

export const eventSeriesOptions: {
  label: string;
  shortLabel: string;
  value: EventSeries;
}[] = [
  {
    label: "FIS Freeride World Championships",
    shortLabel: "FIS Championships",
    value: "fis-freeride-world-championships",
  },
  {
    label: "Freeride World Tour",
    shortLabel: "Freeride World Tour",
    value: "freeride-world-tour",
  },
  {
    label: "FWT Challenger",
    shortLabel: "FWT Challenger",
    value: "fwt-challenger",
  },
  {
    label: "FWT Qualifier",
    shortLabel: "FWT Qualifier",
    value: "fwt-qualifier",
  },
  {
    label: "FWT Junior",
    shortLabel: "FWT Junior",
    value: "fwt-junior",
  },
  {
    label: "Freeride Asia",
    shortLabel: "Freeride Asia",
    value: "freeride-asia",
  },
];

export function getEventSeriesHref(series: EventSeries) {
  return `/events?series=${series}`;
}

export function getEventSeriesLabel(series: EventSeries) {
  return (
    eventSeriesOptions.find((option) => option.value === series)?.label ?? series
  );
}
