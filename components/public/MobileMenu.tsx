"use client";

import Link from "next/link";
import { useState } from "react";

type MobileMenuProps = {
  items: [string, string][];
};

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="group relative flex h-12 w-14 shrink-0 items-center justify-center border border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-200 hover:bg-white active:translate-y-[1px]"
      >
        <span className="grid w-9 gap-1.5">
          <span className="h-1 bg-[var(--color-fk-black)] transition-transform duration-300 group-hover:translate-x-1" />
          <span className="h-1 bg-[var(--color-fk-black)] transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="h-1 bg-[var(--color-fk-black)] transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 bg-[rgba(11,13,16,0.28)] backdrop-blur-sm">
          <div className="ml-auto flex h-full w-full max-w-sm flex-col border-l border-zinc-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(11,13,16,0.55)]">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
              <p className="fk-nav-type text-2xl leading-none">MENU</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-zinc-200 px-3 py-2 text-xs font-black uppercase transition-colors hover:bg-zinc-50"
              >
                Close
              </button>
            </div>
            <nav className="mt-8 grid gap-5">
              {items.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="fk-nav-type border-b border-zinc-200 pb-4 text-3xl leading-[0.98] transition-colors hover:text-[var(--color-fk-red)]"
                >
                  {label.replace("\n", " ")}
                </Link>
              ))}
              <Link
                href="/contact-join"
                onClick={() => setOpen(false)}
                className="mt-3 bg-[var(--color-fk-black)] px-5 py-4 text-center text-sm font-black uppercase text-white"
              >
                Contact / Join
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
