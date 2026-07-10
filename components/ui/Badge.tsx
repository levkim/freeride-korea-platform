import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "red" | "blue" | "green" | "amber";
  className?: string;
};

const toneClasses = {
  neutral: "border-zinc-200 bg-white text-zinc-700",
  red: "border-red-200 bg-red-50 text-red-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-[11px] font-black uppercase tracking-normal",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
