import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/public/MobileMenu";

const navItems: [string, string][] = [
  ["About", "/about"],
  ["News & Video", "/news-video"],
  ["Events", "/events"],
  ["Freeride\nTour", "/freeride-tour"],
  ["Athlete\nProgram", "/athlete-program"],
  ["Safety\nEducation", "/safety-education"],
  ["Culture", "/culture"],
  ["SHOP", "/shop"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 shadow-[0_12px_40px_-35px_rgba(11,13,16,0.6)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 md:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/brand/logo-header.png"
            alt="FREERIDE KOREA"
            width={154}
            height={64}
            priority
            className="h-16 w-auto object-contain"
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
        <nav className="hidden min-w-0 items-center gap-6 text-[14px] font-black uppercase text-[var(--color-fk-black)] xl:flex">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="group relative whitespace-pre-line py-2 text-center leading-[0.95] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-[var(--color-fk-red)]"
            >
              <span className="fk-nav-type">{label}</span>
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-[var(--color-fk-red)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button href="/contact-join" className="hidden md:inline-flex">
            Contact / Join
          </Button>
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}
