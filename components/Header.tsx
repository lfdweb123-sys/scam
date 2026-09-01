import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Registre" },
  { href: "/signaler", label: "Signaler un site" },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/a-propos", label: "À propos" },
];

export default function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:py-8">
        <Link href="/" className="block">
          <span className="font-serif text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            ScamWatch
          </span>
          <span className="mt-1 block font-sans text-xs text-muted sm:text-sm">
            Registre public des sites signalés pour fraude en ligne
          </span>
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-ink">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
