import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">Mentions légales</h1>

      <div className="mt-10 space-y-10 font-sans text-sm leading-relaxed text-ink">
        <section>
          <h2 className="font-serif text-xl">Éditeur du site</h2>
          <p className="mt-3 text-muted">
            Site édité par La Faveur Infinie de Dieu, représentée par Sononkpon
            Gérard.
            <br />
            [À compléter : adresse postale, forme juridique / statut, numéro
            d&apos;immatriculation le cas échéant.]
            <br />
            Contact : [adresse e-mail de contact]
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl">Hébergement</h2>
          <p className="mt-3 text-muted">
            Application hébergée par Vercel Inc. Données stockées par Google
            Firebase (Firestore).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl">Nature du contenu publié</h2>
          <p className="mt-3 text-muted">
            ScamWatch publie des signalements soumis librement par des
            internautes concernant des sites qu&apos;ils estiment frauduleux.
            Ces signalements reflètent l&apos;expérience personnelle de leur
            auteur et sont vérifiés par un système de modération automatisé
            avant publication, afin d&apos;écarter les contenus manifestement
            abusifs, publicitaires ou hors sujet. Cette vérification ne
            constitue ni une enquête, ni une expertise, ni une décision de
            justice établissant la réalité d&apos;une fraude.
          </p>
          <p className="mt-3 text-muted">
            Le statut « confirmé » attribué à un site à partir de 100
            signalements approuvés indique un volume de signalements
            concordants reçus par le registre. Il ne s&apos;agit pas d&apos;une
            qualification juridique de fraude.
          </p>
        </section>

        <section id="droit-de-reponse">
          <h2 className="font-serif text-xl">Droit de réponse</h2>
          <p className="mt-3 text-muted">
            L&apos;éditeur ou le responsable d&apos;un site mentionné sur
            ScamWatch peut demander la publication d&apos;une réponse, la
            correction ou le retrait d&apos;un signalement qu&apos;il estime
            inexact ou infondé, en écrivant à [adresse e-mail de contact] avec
            tout élément permettant d&apos;étayer sa demande. Chaque demande
            est examinée individuellement dans un délai raisonnable.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl">Signalements abusifs</h2>
          <p className="mt-3 text-muted">
            Toute personne publiant un signalement mensonger dans le but de
            nuire à un site ou une entreprise légitime engage sa
            responsabilité. L&apos;éditeur se réserve le droit de retirer tout
            contenu manifestement abusif et de coopérer avec les autorités
            compétentes en cas de nécessité.
          </p>
        </section>
      </div>
    </div>
  );
}
