import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/public/MobileMenu";
import { eventSeriesOptions, getEventSeriesHref } from "@/lib/events/series";

type PublicNavItem = {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
};

const navItems: PublicNavItem[] = [
  { label: "소개", href: "/about" },
  { label: "뉴스·영상", href: "/news-video" },
  {
    label: "대회·이벤트",
    href: "/events",
    children: eventSeriesOptions.map((series) => ({
      label: series.shortLabel,
      href: getEventSeriesHref(series.value),
    })),
  },
  { label: "프리라이드 투어", href: "/freeride-tour" },
  { label: "교육", href: "/safety-education" },
  { label: "선수 프로그램", href: "/athlete-program" },
  { label: "컬쳐", href: "/culture" },
  { label: "샵", href: "/shop" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 shadow-[0_12px_40px_-35px_rgba(11,13,16,0.6)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 md:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/brand/logo-header.png"
            alt="FREERIDE KOREA"
            width="72"
            height="72"
            className="h-[72px] w-[72px] shrink-0 object-contain"
          />
          <span className="hidden shrink-0 sm:block">
            <span className="block text-2xl font-black leading-[1.0] tracking-normal">
              FREERIDE
            </span>
            <span className="block text-2xl font-black leading-[1.0] tracking-normal">
              KOREA
            </span>
          </span>
        </Link>
        <nav className="hidden min-w-0 items-center gap-6 text-[15px] font-black uppercase text-[var(--color-fk-black)] xl:flex">
          {navItems.map((item) => (
            <div key={item.href} className="group/nav relative py-2">
              <Link
                href={item.href}
                className="relative block whitespace-pre-line text-center leading-[0.95] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-[var(--color-fk-red)]"
              >
                <span className="inline-block font-black tracking-normal">
                  {item.label}
                </span>
                <span className="absolute inset-x-0 -bottom-2 h-0.5 origin-left scale-x-0 bg-[var(--color-fk-red)] transition-transform duration-300 ease-out group-hover/nav:scale-x-100" />
              </Link>
              {item.children ? (
                <div className="pointer-events-none absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-200 ease-out group-hover/nav:pointer-events-auto group-hover/nav:translate-y-0 group-hover/nav:opacity-100">
                  <div className="grid gap-1 border border-zinc-200 bg-white p-3 shadow-[0_28px_80px_-40px_rgba(11,13,16,0.45)]">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block border-b border-zinc-100 px-3 py-3 text-left text-[19px] font-black leading-none tracking-normal text-zinc-900 transition-colors last:border-b-0 hover:text-[var(--color-fk-red)]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            href="/contact-join"
            className="hidden border-zinc-300 bg-zinc-200 text-zinc-950 hover:bg-zinc-300 md:inline-flex"
          >
            문의·참여
          </Button>
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}
