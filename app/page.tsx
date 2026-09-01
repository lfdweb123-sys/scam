import Link from "next/link";
import { getConfirmedSites, getWatchedSites, getSiteCount } from "@/lib/data";
import type { SiteDoc } from "@/lib/types";
import { SEUIL_CONFIRMATION } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

function SiteRow({ site, rank }: { site: SiteDoc; rank: number }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-line py-4">
      <div className="flex items-baseline gap-4">
        <span className="w-6 shrink-0 font-sans text-sm text-muted">
          {String(rank).padStart(2, "0")}
        </span>
        <Link href={`/site/${encodeURIComponent(site.domain)}`} className="font-serif text-lg text-ink hover:underline">
          {site.domain}
        </Link>
      </div>
      <span className="shrink-0 font-sans text-sm text-muted">
        {site.reportCount} signalement{site.reportCount > 1 ? "s" : ""}
      </span>
    </li>
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
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <section className="max-w-prose border-b border-line pb-12">
        <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
          Vérifiez un site avant d&apos;y faire confiance.
        </h1>
        <p className="mt-5 font-sans text-base leading-relaxed text-muted sm:text-lg">
          ScamWatch rassemble les signalements d&apos;internautes sur des sites
          suspectés de fraude : faux e-commerce, phishing, faux investissements.
          Chaque signalement est vérifié automatiquement avant publication.
          Un site atteignant {SEUIL_CONFIRMATION} signalements approuvés est
          classé comme confirmé.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signaler"
            className="inline-block border border-ink px-5 py-2.5 font-sans text-sm text-ink hover:bg-ink hover:text-paper"
          >
            Signaler un site
          </Link>
          <Link
            href="/comment-ca-marche"
            className="inline-block px-5 py-2.5 font-sans text-sm text-muted hover:text-ink hover:underline"
          >
            Comment fonctionne le registre
          </Link>
        </div>

        <dl className="mt-10 grid max-w-sm grid-cols-2 gap-6 font-sans">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Sites confirmés</dt>
            <dd className="mt-1 font-serif text-3xl text-ink">{counts.confirmed}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Sites suivis</dt>
            <dd className="mt-1 font-serif text-3xl text-ink">{counts.total}</dd>
          </div>
        </dl>
      </section>

      {loadError ? (
        <p className="mt-12 max-w-prose font-sans text-sm text-muted">
          Le registre est momentanément indisponible. Réessayez dans quelques instants.
        </p>
      ) : (
        <div className="mt-12 grid gap-16 lg:grid-cols-2">
          <section>
            <h2 className="font-serif text-2xl text-ink">Sites confirmés</h2>
            <p className="mt-1 font-sans text-sm text-muted">
              {SEUIL_CONFIRMATION} signalements approuvés ou plus.
            </p>
            {confirmed.length === 0 ? (
              <p className="mt-6 font-sans text-sm text-muted">
                Aucun site n&apos;a encore atteint le seuil de confirmation.
              </p>
            ) : (
              <ul className="mt-4">
                {confirmed.map((site, i) => (
                  <SiteRow key={site.domain} site={site} rank={i + 1} />
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink">Sous surveillance</h2>
            <p className="mt-1 font-sans text-sm text-muted">
              Signalements en cours, seuil de confirmation non atteint.
            </p>
            {watched.length === 0 ? (
              <p className="mt-6 font-sans text-sm text-muted">
                Aucun site sous surveillance pour le moment.
              </p>
            ) : (
              <ul className="mt-4">
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
