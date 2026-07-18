import { Badge } from "./Badge";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const tone =
    normalized.includes("cancelled") || normalized.includes("high")
      ? "red"
      : normalized.includes("live") ||
          normalized.includes("published") ||
          normalized.includes("open") ||
          normalized.includes("completed")
      ? "green"
      : normalized.includes("review") ||
          normalized.includes("soon") ||
          normalized.includes("upcoming")
        ? "blue"
        : normalized.includes("risk")
          ? "red"
          : normalized.includes("draft") || normalized.includes("new")
            ? "amber"
            : "neutral";

  return <Badge tone={tone}>{status.replaceAll("_", " ")}</Badge>;
}
