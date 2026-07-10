import { Badge } from "./Badge";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const tone =
    normalized.includes("published") || normalized.includes("open")
      ? "green"
      : normalized.includes("review") || normalized.includes("soon")
        ? "blue"
        : normalized.includes("risk") || normalized.includes("high")
          ? "red"
          : normalized.includes("draft") || normalized.includes("new")
            ? "amber"
            : "neutral";

  return <Badge tone={tone}>{status.replaceAll("_", " ")}</Badge>;
}
