"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { normalizeDomain } from "@/lib/domain";

export default function QuickSearch() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const raw = String(formData.get("q") || "");
    const domain = normalizeDomain(raw);

    if (!domain) {
      setError("Adresse invalide. Exemple : exemple.com");
      return;
    }

    setError(null);
    router.push(`/site/${encodeURIComponent(domain)}`);
  }

  return (
    <div className="mt-8 max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex items-stretch border border-line bg-paper"
      >
        <span className="flex items-center pl-4 text-muted" aria-hidden="true">
          <Search size={18} strokeWidth={1.75} />
        </span>
        <label htmlFor="quick-search" className="sr-only">
          Rechercher une URL ou un nom de domaine
        </label>
        <input
          id="quick-search"
          name="q"
          type="text"
          placeholder="Rechercher une URL, un nom de domaine…"
          className="w-full bg-transparent px-3 py-3.5 font-sans text-base text-ink placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 bg-accent px-6 font-sans text-sm text-paper transition-colors hover:bg-accentHover"
        >
          Vérifier
        </button>
      </form>
      {error ? (
        <p role="alert" className="mt-2 font-sans text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
