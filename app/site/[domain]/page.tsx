import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { getSiteByDomain, getApprovedReportsForDomain } from "@/lib/data";
import { normalizeDomain } from "@/lib/domain";
import { SEUIL_CONFIRMATION } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ domain: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const domain = normalizeDomain(decodeURIComponent(resolvedParams.domain));

  if (!domain) {
    return { title: "Domaine invalide" };
  }

  const site = await getSiteByDomain(domain);

  if (!site) {
    return {
      title: `${domain} — Aucun signalement`,
      description: `Aucun signalement n'a été publié au sujet de ${domain} sur ScamWatch pour le moment.`,
      alternates: { canonical: `/site/${encodeURIComponent(domain)}` },
    };
  }

  const title =
    site.status === "confirme"
      ? `${site.domain} — Site confirmé comme arnaque`
      : `${site.domain} — ${site.reportCount} signalement${site.reportCount > 1 ? "s" : ""}`;

  const description = `Consultez les ${site.reportCount} signalement${
    site.reportCount > 1 ? "s" : ""
  } publiés au sujet de ${site.domain} sur ScamWatch, le registre public des sites suspectés de fraude en ligne.`;

  return {
    title,
    description,
    alternates: { canonical: `/site/${encodeURIComponent(site.domain)}` },
    openGraph: { title, description },
  };
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SiteDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const domain = normalizeDomain(decodeURIComponent(resolvedParams.domain));

  if (!domain) {
    notFound();
  }

  const site = await getSiteByDomain(domain);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <Link href="/" className="font-sans text-sm text-muted hover:text-ink hover:underline">
        ← Retour au registre
      </Link>

      {!site ? (
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 border border-ink px-3 py-1 font-sans text-xs uppercase tracking-wide text-ink">
            <ShieldCheck size={14} strokeWidth={1.75} aria-hidden="true" />
            Aucun signalement
          </span>
          <h1 className="mt-4 break-words font-heading text-3xl text-ink sm:text-4xl">{domain}</h1>
          <p className="mt-4 max-w-prose font-sans text-base leading-relaxed text-muted">
            Aucun internaute n&apos;a encore signalé ce site sur ScamWatch. Cela
            ne garantit pas qu&apos;il soit fiable — restez prudent avant tout
            paiement — mais aucun signalement n&apos;est actuellement publié à
            son sujet.
          </p>
          <div className="mt-8 border-t border-line pt-8">
            <Link
              href={`/signaler?domaine=${encodeURIComponent(domain)}`}
              className="inline-block border border-ink bg-ink px-5 py-2.5 font-sans text-sm text-paper hover:bg-accent hover:border-accent"
            >
              Signaler ce site
            </Link>
          </div>
        </div>
      ) : (
        <SiteReportPanel domain={domain} site={site} />
      )}
    </div>
  );
}

async function SiteReportPanel({
  domain,
  site,
}: {
  domain: string;
  site: NonNullable<Awaited<ReturnType<typeof getSiteByDomain>>>;
}) {
  const reports = await getApprovedReportsForDomain(domain, 100);
  const isConfirmed = site.status === "confirme";

  return (
    <>
      <div className="mt-6 border-b border-line pb-8">
        <span
          className={`inline-flex items-center gap-2 border px-3 py-1 font-sans text-xs uppercase tracking-wide ${
            isConfirmed ? "border-ink bg-ink text-paper" : "border-ink text-ink"
          }`}
        >
          {isConfirmed ? (
            <ShieldAlert size={14} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <ShieldCheck size={14} strokeWidth={1.75} aria-hidden="true" />
          )}
          {isConfirmed ? "Confirmé comme arnaque" : "Sous surveillance"}
        </span>
        <h1 className="mt-4 break-words font-heading text-3xl text-ink sm:text-4xl">
          {site.domain}
        </h1>
        <p className="mt-3 font-sans text-sm text-muted">
          {site.reportCount} signalement{site.reportCount > 1 ? "s" : ""} approuvé
          {site.reportCount > 1 ? "s" : ""} · premier signalement le{" "}
          {formatDate(site.firstReportedAt)}
          {isConfirmed && site.confirmedAt
            ? ` · confirmé le ${formatDate(site.confirmedAt)}`
            : ""}
        </p>
        {isConfirmed ? (
          <p className="mt-4 max-w-prose font-sans text-sm leading-relaxed text-muted">
            Ce site a atteint {SEUIL_CONFIRMATION} signalements approuvés par notre
            modération automatique. Cela reflète un volume de signalements
            concordants de la part d&apos;internautes, et non une décision de
            justice. L&apos;opérateur de ce site peut exercer son{" "}
            <Link href="/mentions-legales#droit-de-reponse" className="underline">
              droit de réponse
            </Link>
            .
          </p>
        ) : (
          <p className="mt-4 max-w-prose font-sans text-sm leading-relaxed text-muted">
            Ce site fait l&apos;objet de signalements en cours d&apos;examen par la
            communauté. Il passera au statut confirmé à partir de{" "}
            {SEUIL_CONFIRMATION} signalements approuvés.
          </p>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-xl text-ink">Signalements publiés</h2>

        {reports.length === 0 ? (
          <p className="mt-4 font-sans text-sm text-muted">Aucun signalement à afficher.</p>
        ) : (
          <ul className="mt-6 space-y-8">
            {reports.map((report, i) => (
              <li key={i} className="border-b border-line pb-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-sans text-xs uppercase tracking-wide text-muted">
                    {report.category}
                  </span>
                  <span className="font-sans text-xs text-muted">
                    {formatDate(report.createdAt)}
                  </span>
                </div>
                <p className="mt-3 whitespace-pre-wrap break-words font-sans text-base leading-relaxed text-ink">
                  {report.description}
                </p>
                {report.evidenceUrl ? (
                  <a
                    href={report.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-3 inline-block font-sans text-sm text-muted underline hover:text-ink"
                  >
                    Voir la pièce jointe fournie
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-12 border-t border-line pt-8">
        <Link
          href={`/signaler?domaine=${encodeURIComponent(site.domain)}`}
          className="inline-block border border-ink bg-ink px-5 py-2.5 font-sans text-sm text-paper hover:bg-accent hover:border-accent"
        >
          Signaler ce site à mon tour
        </Link>
      </div>
    </>
  );
}
