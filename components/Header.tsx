"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Registre" },
  { href: "/signaler", label: "Signaler un site" },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/a-propos", label: "À propos" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Ferme le menu mobile à chaque changement de page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloque le scroll du fond quand le menu mobile est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:py-5">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center border border-ink font-serif text-base font-medium text-ink"
          >
            SW
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl font-medium tracking-tight text-ink sm:text-2xl">
              ScamWatch
            </span>
            <span className="mt-1 hidden font-sans text-xs text-muted sm:block">
              Registre public des signalements de fraude en ligne
            </span>
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-x-8 font-sans text-sm text-ink">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`border-b pb-0.5 transition-colors ${
                    pathname === link.href
                      ? "border-ink"
                      : "border-transparent hover:border-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-10 w-10 items-center justify-center border border-ink text-ink md:hidden"
        >
          <span className="relative block h-3 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 block h-px w-5 bg-ink transition-transform duration-200 ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-px w-5 -translate-y-1/2 bg-ink transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 block h-px w-5 bg-ink transition-transform duration-200 ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Panneau de navigation mobile */}
      <nav
        id="menu-mobile"
        aria-label="Navigation mobile"
        className={`grid overflow-hidden border-t border-ink bg-paper transition-[grid-template-rows] duration-200 ease-out md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0"
        }`}
      >
        <ul className="min-h-0 overflow-hidden font-sans text-base text-ink">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} className={i > 0 ? "border-t border-line" : ""}>
              <Link href={link.href} className="block px-6 py-4">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
