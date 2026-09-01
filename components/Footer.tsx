import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surfaceMuted">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-8 font-sans text-sm text-muted sm:grid-cols-3">
          <div>
            <p className="font-heading text-base text-ink">ScamWatch</p>
            <p className="mt-2 max-w-xs">
              Un registre collaboratif alimenté par les signalements d&apos;internautes,
              modéré automatiquement, pour aider chacun à repérer les sites
              frauduleux avant d&apos;y laisser ses informations ou son argent.
            </p>
          </div>

          <div>
            <p className="font-medium text-ink">Le registre</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/signaler" className="hover:underline">
                  Signaler un site
                </Link>
              </li>
              <li>
                <Link href="/comment-ca-marche" className="hover:underline">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:underline">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-ink">Informations légales</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/mentions-legales" className="hover:underline">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="hover:underline">
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales#droit-de-reponse" className="hover:underline">
                  Droit de réponse
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-line pt-6 text-xs text-muted">
          © {year} ScamWatch. Les signalements publiés reflètent l&apos;expérience
          rapportée par des internautes et ne constituent pas une décision de
          justice. Tout site mentionné peut exercer son droit de réponse.
        </p>
      </div>
    </footer>
  );
}
