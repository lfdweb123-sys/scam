import { createHash } from "crypto";
import { getDb } from "@/lib/firebase-admin";

const FENETRE_HEURES = 24;
const MAX_SIGNALEMENTS_PAR_FENETRE = 3;

/**
 * Limite le nombre de signalements qu'une même IP peut publier sur un même
 * domaine dans une fenêtre de temps. L'IP n'est jamais stockée en clair,
 * seulement son empreinte (hash), et uniquement dans ce but anti-abus.
 *
 * Retourne true si la publication est autorisée.
 */
export async function checkRateLimit(ip: string, domainId: string): Promise<boolean> {
  const salt = process.env.RATE_LIMIT_SALT || "scamwatch";
  const fingerprint = createHash("sha256").update(`${salt}:${ip}:${domainId}`).digest("hex");

  const db = getDb();
  const ref = db.collection("throttle").doc(fingerprint);
  const snap = await ref.get();

  const now = Date.now();
  const fenetreMs = FENETRE_HEURES * 60 * 60 * 1000;

  if (!snap.exists) {
    await ref.set({ count: 1, windowStart: now });
    return true;
  }

  const data = snap.data() as { count: number; windowStart: number };

  if (now - data.windowStart > fenetreMs) {
    await ref.set({ count: 1, windowStart: now });
    return true;
  }

  if (data.count >= MAX_SIGNALEMENTS_PAR_FENETRE) {
    return false;
  }

  await ref.update({ count: data.count + 1 });
  return true;
}
