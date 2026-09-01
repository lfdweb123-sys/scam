import Link from "next/link";
import { Gavel } from "lucide-react";
import { getConfirmedSites, getWatchedSites, getSiteCount } from "@/lib/data";
import type { SiteDoc } from "@/lib/types";
import { SEUIL_CONFIRMATION } from "@/lib/firebase-admin";
import QuickSearch from "@/components/QuickSearch";

export const dynamic = "force-dynamic";

function SiteRow({ site, rank }: { site: SiteDoc; rank: number }) {
  return (
    <li className="border-b border-line">
      <Link
        href={`/site/${encodeURIComponent(site.domain)}`}
        className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-ink/[0.03] focus-visible:bg-ink/[0.03] px-2 -mx-2"
      >
        <div className="flex min-w-0 items-baseline gap-4">
          <span className="w-6 shrink-0 font-sans text-sm text-muted">
            {String(rank).padStart(2, "0")}
          </span>
          <span className="truncate font-heading text-lg text-ink group-hover:underline">
            {site.domain}
          </span>
        </div>
        <span className="shrink-0 whitespace-nowrap font-sans text-sm text-muted">
          {site.reportCount} signalement{site.reportCount > 1 ? "s" : ""}
        </span>
      </Link>
    </li>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line bg-paper px-5 py-4">
      <dt className="font-sans text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 font-heading text-3xl text-ink">{value}</dd>
    </div>
  );
}

export default async function HomePage() {
  let confirmed: SiteDoc[] = [];
  let watched: SiteDoc[] = [];
  let counts = { total: 0, confirmed: 0 };
  let loadError = false;

  try {
    [confirmed, watched, counts] = await Promise.all([
      getConfirmedSites(30),
      getWatchedSites(30),
      getSiteCount(),
    ]);
  } catch (error) {
    console.error("Erreur de chargement du registre :", error);
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      <section className="border-b border-ink pb-14">
        <p className="font-sans text-xs uppercase tracking-[0.15em] text-muted">
          Registre public · mis à jour en continu
        </p>
        <h1 className="mt-4 max-w-prose font-heading text-4xl leading-[1.15] text-ink sm:text-5xl">
          Vérifiez un site avant d&apos;y faire confiance.
        </h1>
        <p className="mt-5 max-w-prose font-sans text-base leading-relaxed text-muted sm:text-lg">
          ScamWatch rassemble les signalements d&apos;internautes sur des sites
          suspectés de fraude : faux e-commerce, phishing, faux investissements.
          Chaque signalement est vérifié automatiquement avant publication.
          Un site atteignant {SEUIL_CONFIRMATION} signalements approuvés est
          classé comme confirmé.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/signaler"
            className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 font-sans text-sm text-paper transition-colors hover:bg-accent hover:border-accent"
          >
            <Gavel size={16} strokeWidth={1.75} aria-hidden="true" />
            Signaler un site
          </Link>
          <Link
            href="/comment-ca-marche"
            className="inline-block font-sans text-sm text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            Comment fonctionne le registre
          </Link>
        </div>

        <QuickSearch />

        <dl className="mt-12 grid max-w-md grid-cols-2 gap-4">
          <StatBox label="Sites confirmés" value={counts.confirmed} />
          <StatBox label="Sites suivis" value={counts.total} />
        </dl>
      </section>

      {loadError ? (
        <p className="mt-12 max-w-prose font-sans text-sm text-muted">
          Le registre est momentanément indisponible. Réessayez dans quelques instants.
        </p>
      ) : (
        <div className="mt-14 grid gap-16 lg:grid-cols-2 lg:gap-12">
          <section>
            <div className="flex items-baseline justify-between border-b border-ink pb-3">
              <h2 className="font-heading text-2xl text-ink">Sites confirmés</h2>
              <span className="font-sans text-xs text-muted">
                {SEUIL_CONFIRMATION}+ signalements
              </span>
            </div>
            {confirmed.length === 0 ? (
              <p className="mt-6 font-sans text-sm text-muted">
                Aucun site n&apos;a encore atteint le seuil de confirmation.
              </p>
            ) : (
              <ul className="mt-2">
                {confirmed.map((site, i) => (
                  <SiteRow key={site.domain} site={site} rank={i + 1} />
                ))}
              </ul>
            )}
          </section>

          <section>
            <div className="flex items-baseline justify-between border-b border-ink pb-3">
              <h2 className="font-heading text-2xl text-ink">Sous surveillance</h2>
              <span className="font-sans text-xs text-muted">en cours</span>
            </div>
            {watched.length === 0 ? (
              <p className="mt-6 font-sans text-sm text-muted">
                Aucun site sous surveillance pour le moment.
              </p>
            ) : (
              <ul className="mt-2">
                {watched.map((site, i) => (
                  <SiteRow key={site.domain} site={site} rank={i + 1} />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
