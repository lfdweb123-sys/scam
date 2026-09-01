"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

export default function ReportForm() {
  const searchParams = useSearchParams();
  const prefillDomain = searchParams.get("domaine") || "";

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [resultDomain, setResultDomain] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      url: String(formData.get("url") || ""),
      description: String(formData.get("description") || ""),
      evidenceUrl: String(formData.get("evidenceUrl") || ""),
      category: String(formData.get("category") || ""),
      website: String(formData.get("website") || ""), // honeypot
    };

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue.");
        return;
      }

      setStatus("success");
      setResultDomain(data.domain);
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Impossible d'envoyer le signalement. Vérifiez votre connexion.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line bg-paper px-6 py-8">
        <h2 className="font-heading text-2xl text-ink">Signalement publié</h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
          Merci. Votre signalement concernant{" "}
          <span className="text-ink">{resultDomain}</span> a été vérifié
          automatiquement et publié sur le registre.
        </p>
        <a
          href={`/site/${encodeURIComponent(resultDomain || "")}`}
          className="mt-6 inline-block border border-ink bg-ink px-5 py-2.5 font-sans text-sm text-paper hover:bg-accent hover:border-accent"
        >
          Voir la fiche du site
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Champ piège anti-robot, masqué visuellement mais accessible au DOM */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir ce champ</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="url" className="block font-sans text-sm text-ink">
          Adresse du site concerné
        </label>
        <input
          type="text"
          id="url"
          name="url"
          required
          placeholder="exemple.com"
          defaultValue={prefillDomain}
          className="mt-2 w-full border border-line bg-paper px-4 py-3 font-sans text-base text-ink placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="category" className="block font-sans text-sm text-ink">
          Type de fraude
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue=""
          className="mt-2 w-full border border-line bg-paper px-4 py-3 font-sans text-base text-ink focus:border-accent focus:ring-1 focus:ring-accent"
        >
          <option value="" disabled>
            Choisir une catégorie
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block font-sans text-sm text-ink">
          Décrivez ce qui s&apos;est passé
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          maxLength={4000}
          rows={7}
          placeholder="Ce que vous avez commandé ou reçu, ce que le site a promis, ce qui s'est réellement passé..."
          className="mt-2 w-full border border-line bg-paper px-4 py-3 font-sans text-base text-ink placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <p className="mt-2 font-sans text-xs text-muted">
          20 caractères minimum. Évitez d&apos;inclure des données personnelles
          sensibles (numéros de carte bancaire, mots de passe).
        </p>
      </div>

      <div>
        <label htmlFor="evidenceUrl" className="block font-sans text-sm text-ink">
          Lien vers une preuve (facultatif)
        </label>
        <input
          type="url"
          id="evidenceUrl"
          name="evidenceUrl"
          placeholder="https://..."
          className="mt-2 w-full border border-line bg-paper px-4 py-3 font-sans text-base text-ink placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <p className="mt-2 font-sans text-xs text-muted">
          Capture d&apos;écran hébergée, e-mail reçu, page archivée...
        </p>
      </div>

      {status === "error" && message ? (
        <p role="alert" className="border-l-2 border-ink bg-ink/[0.03] py-2 pl-4 font-sans text-sm font-medium text-ink">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="border border-ink bg-ink px-6 py-3 font-sans text-sm text-paper transition-colors hover:bg-accent hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Envoi en cours…" : "Publier le signalement"}
      </button>

      <p className="font-sans text-xs leading-relaxed text-muted">
        Chaque signalement est examiné automatiquement avant publication.
        En publiant, vous confirmez que les informations fournies sont
        exactes à votre connaissance. Voir nos{" "}
        <a href="/cgu" className="underline">
          conditions d&apos;utilisation
        </a>
        .
      </p>
    </form>
  );
}
