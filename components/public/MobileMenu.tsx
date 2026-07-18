"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PublicNavItem = {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
};

type MobileMenuProps = {
  items: PublicNavItem[];
};

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const mobileItems: PublicNavItem[] = [
    { label: "Home", href: "/" },
    ...items.map((item) => ({ label: item.label, href: item.href })),
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const menuOverlay =
    open && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[9999] bg-zinc-950/60">
            <button
              type="button"
              aria-label="Close navigation backdrop"
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default"
            />
            <div className="absolute inset-y-0 right-0 flex h-full w-[min(88vw,360px)] flex-col border-l border-zinc-200 bg-white shadow-[0_30px_80px_-40px_rgba(11,13,16,0.65)]">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-zinc-900">
                  Menu
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="border border-zinc-300 px-3 py-2 text-xs font-black uppercase text-zinc-900 transition-colors hover:bg-zinc-100"
                >
                  Close
                </button>
              </div>
              <nav className="grid overflow-y-auto bg-white pb-6">
                {mobileItems.map((item) => (
                  <div key={item.href} className="border-b border-zinc-200">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block px-5 py-4 text-[16px] font-black uppercase leading-tight tracking-normal text-zinc-950 transition-colors hover:bg-zinc-50 hover:text-[var(--color-fk-red)]"
                    >
                      {item.label.replace("\n", " ")}
                    </Link>
                  </div>
                ))}
                <Link
                  href="/contact-join"
                  onClick={() => setOpen(false)}
                  className="mx-5 mt-5 border border-zinc-300 bg-zinc-200 px-5 py-4 text-center text-sm font-black uppercase text-zinc-950 transition-colors hover:bg-zinc-300"
                >
                  문의·참여
                </Link>
              </nav>
            </div>
          </div>,
          document.body,
        )
      : null;

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

      {menuOverlay}
    </>
  );
}
