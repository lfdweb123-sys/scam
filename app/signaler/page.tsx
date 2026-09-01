import type { Metadata } from "next";
import { Suspense } from "react";
import ReportForm from "@/components/ReportForm";

export const metadata: Metadata = {
  title: "Signaler un site",
  description:
    "Signalez un site suspecté de fraude ou d'arnaque en ligne. Aucun compte requis, modération automatique.",
  alternates: { canonical: "/signaler" },
};

export default function SignalerPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <h1 className="font-heading text-3xl text-ink sm:text-4xl">Signaler un site</h1>
      <p className="mt-4 max-w-prose font-sans text-base leading-relaxed text-muted">
        Décrivez ce que vous avez vécu. Votre signalement est examiné
        automatiquement puis publié s&apos;il respecte nos règles de
        publication, sans nécessiter de compte.
      </p>

      <div className="mt-10">
        <Suspense fallback={null}>
          <ReportForm />
        </Suspense>
      </div>
    </div>
  );
}
