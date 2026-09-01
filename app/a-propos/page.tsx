import type { Metadata } from "next";
import { SEUIL_CONFIRMATION } from "@/lib/firebase-admin";

export const metadata: Metadata = {
  title: "À propos",
  description: "Pourquoi ScamWatch existe et comment le registre est construit.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">À propos de ScamWatch</h1>

      <div className="mt-8 space-y-6 font-sans text-base leading-relaxed text-muted">
        <p>
          Chaque année, des internautes perdent de l&apos;argent ou des
          données personnelles sur des sites qui n&apos;existaient que pour
          les tromper : faux e-commerce, fausses offres d&apos;emploi, faux
          investissements. Ces sites disparaissent souvent avant que
          quiconque n&apos;ait eu le temps de prévenir les autres.
        </p>
        <p>
          ScamWatch est un registre public où chacun peut signaler un site
          suspect, sans créer de compte, et consulter les signalements déjà
          publiés avant de faire confiance à un site inconnu.
        </p>
        <p>
          Pour rester utilisable malgré le volume, chaque signalement est
          examiné par un système de modération automatisé avant publication :
          il écarte le spam, les contenus hors sujet ou les attaques
          personnelles, sans pour autant exiger une preuve formelle qu&apos;un
          internaute ordinaire n&apos;a pas toujours les moyens de fournir. Un
          site passe au statut « confirmé » lorsqu&apos;il atteint{" "}
          {SEUIL_CONFIRMATION} signalements approuvés, ce qui reflète un
          volume de signalements concordants plutôt qu&apos;une décision de
          justice.
        </p>
        <p>
          Tout site mentionné peut demander une correction ou exercer son
          droit de réponse, décrit dans nos{" "}
          <a href="/mentions-legales#droit-de-reponse" className="underline text-ink">
            mentions légales
          </a>
          .
        </p>
      </div>
    </div>
  );
}
