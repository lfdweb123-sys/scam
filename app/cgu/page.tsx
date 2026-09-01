import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  alternates: { canonical: "/cgu" },
};

export default function CguPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <h1 className="font-heading text-3xl text-ink sm:text-4xl">
        Conditions d&apos;utilisation
      </h1>

      <div className="mt-10 space-y-10 font-sans text-sm leading-relaxed text-ink">
        <section>
          <h2 className="font-heading text-xl">Objet</h2>
          <p className="mt-3 text-muted">
            ScamWatch permet à toute personne de consulter et de publier des
            signalements concernant des sites web suspectés de fraude, sans
            création de compte. L&apos;utilisation du site implique
            l&apos;acceptation pleine et entière des présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl">Règles de publication</h2>
          <p className="mt-3 text-muted">En publiant un signalement, vous vous engagez à :</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>décrire une expérience réelle et personnelle, avec exactitude ;</li>
            <li>ne pas publier de contenu diffamatoire, injurieux ou haineux ;</li>
            <li>ne pas publier de données personnelles sensibles d&apos;un tiers ;</li>
            <li>ne pas utiliser le service à des fins publicitaires ou concurrentielles déloyales ;</li>
            <li>ne pas multiplier les signalements sur un même site dans le but d&apos;en fausser le décompte.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl">Modération</h2>
          <p className="mt-3 text-muted">
            Chaque signalement soumis est analysé par un système de
            modération automatisé avant toute publication. Ce système peut
            rejeter ou mettre en attente un contenu qui ne respecte pas les
            présentes règles. L&apos;éditeur se réserve le droit de retirer a
            posteriori tout contenu publié qui s&apos;avérerait non conforme.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl">Responsabilité</h2>
          <p className="mt-3 text-muted">
            Les signalements publiés engagent la responsabilité de leur
            auteur. ScamWatch ne vérifie pas l&apos;exactitude factuelle des
            faits décrits et ne saurait être tenu responsable des
            conséquences d&apos;un signalement inexact. Le registre est fourni
            à titre informatif et ne remplace pas une vérification
            personnelle avant toute transaction.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl">Contact</h2>
          <p className="mt-3 text-muted">
            Pour toute question relative aux présentes conditions ou pour
            signaler un abus, écrivez à [adresse e-mail de contact].
          </p>
        </section>
      </div>
    </div>
  );
}
