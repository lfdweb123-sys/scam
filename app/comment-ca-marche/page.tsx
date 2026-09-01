import type { Metadata } from "next";
import Link from "next/link";
import { SEUIL_CONFIRMATION } from "@/lib/firebase-admin";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description: "Comment un signalement est modéré et comment un site devient confirmé sur ScamWatch.",
  alternates: { canonical: "/comment-ca-marche" },
};

const ETAPES = [
  {
    titre: "1. Vous signalez un site",
    texte:
      "Indiquez l'adresse du site, le type de fraude et décrivez ce qui s'est passé. Aucun compte n'est nécessaire.",
  },
  {
    titre: "2. Vérification automatique",
    texte:
      "Chaque signalement est analysé automatiquement pour écarter le spam, les contenus hors sujet, haineux ou publicitaires. La modération n'exige pas de preuve formelle : elle filtre les abus, pas la sincérité du témoignage.",
  },
  {
    titre: "3. Publication sur la fiche du site",
    texte:
      "Une fois approuvé, le signalement apparaît publiquement sur la fiche du site concerné, et le compteur de signalements est mis à jour.",
  },
  {
    titre: `4. Statut confirmé à ${SEUIL_CONFIRMATION} signalements`,
    texte: `Lorsqu'un site atteint ${SEUIL_CONFIRMATION} signalements approuvés, il passe automatiquement au statut « confirmé » et apparaît en tête du registre.`,
  },
];

export default function CommentCaMarchePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">Comment ça marche</h1>

      <ol className="mt-10 space-y-8">
        {ETAPES.map((etape) => (
          <li key={etape.titre} className="border-b border-line pb-8">
            <h2 className="font-serif text-xl text-ink">{etape.titre}</h2>
            <p className="mt-2 font-sans text-base leading-relaxed text-muted">{etape.texte}</p>
          </li>
        ))}
      </ol>

      <div className="mt-4">
        <Link
          href="/signaler"
          className="inline-block border border-ink px-5 py-2.5 font-sans text-sm text-ink hover:bg-ink hover:text-paper"
        >
          Signaler un site
        </Link>
      </div>
    </div>
  );
}
