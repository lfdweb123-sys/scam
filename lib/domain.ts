/**
 * Normalise une entrée utilisateur (URL ou nom de domaine) en un
 * identifiant de domaine propre : minuscules, sans protocole, sans "www.",
 * sans chemin ni paramètres.
 *
 * Retourne null si l'entrée ne ressemble pas à un domaine valide.
 */
export function normalizeDomain(input: string): string | null {
  if (!input) return null;
  let value = input.trim().toLowerCase();
  if (!value) return null;

  if (!/^[a-z]+:\/\//.test(value)) {
    value = `https://${value}`;
  }

  try {
    const url = new URL(value);
    let host = url.hostname;
    if (host.startsWith("www.")) host = host.slice(4);

    const isValid = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(
      host
    );
    if (!isValid) return null;

    return host;
  } catch {
    return null;
  }
}

/** Convertit un domaine en identifiant de document Firestore sûr. */
export function domainToId(domain: string): string {
  return domain.replace(/\./g, "_");
}

export function idToDomain(id: string): string {
  return id.replace(/_/g, ".");
}
