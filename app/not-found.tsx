import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="font-serif text-3xl text-ink">Page introuvable</h1>
      <p className="mt-4 font-sans text-base text-muted">
        Ce site n&apos;a pas encore de fiche sur ScamWatch, ou la page demandée
        n&apos;existe pas.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/"
          className="border border-ink px-5 py-2.5 font-sans text-sm text-ink hover:bg-ink hover:text-paper"
        >
          Retour au registre
        </Link>
        <Link
          href="/signaler"
          className="px-5 py-2.5 font-sans text-sm text-muted hover:text-ink hover:underline"
        >
          Signaler un site
        </Link>
      </div>
    </div>
  );
}
