import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variantClasses = {
  primary:
    "bg-[var(--color-fk-black)] text-white hover:bg-zinc-800 border-[var(--color-fk-black)] shadow-[0_14px_30px_-20px_rgba(11,13,16,0.7)]",
  secondary:
    "bg-white text-[var(--color-fk-black)] hover:bg-zinc-50 border-zinc-300",
  ghost:
    "bg-transparent text-[var(--color-fk-black)] hover:bg-white border-transparent",
};

export function Button({
  children,
  href,
  variant = "primary",
  className,
}: ButtonProps) {
  const classes = cn(
    "inline-flex h-11 items-center justify-center border px-5 text-sm font-bold transition-all duration-300 active:translate-y-[1px] active:scale-[0.99]",
    variantClasses[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
