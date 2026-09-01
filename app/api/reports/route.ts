import { NextRequest, NextResponse } from "next/server";
import { getDb, SEUIL_CONFIRMATION } from "@/lib/firebase-admin";
import { normalizeDomain, domainToId } from "@/lib/domain";
import { moderateReport } from "@/lib/moderation";
import { sendReportNotification } from "@/lib/brevo";
import { checkRateLimit } from "@/lib/rate-limit";
import { CATEGORIES, type ReportDoc, type SiteDoc } from "@/lib/types";

export const runtime = "nodejs";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "0.0.0.0";
}

export async function POST(req: NextRequest) {
  let body: {
    url?: string;
    description?: string;
    evidenceUrl?: string;
    category?: string;
    website?: string; // champ piège anti-robot (honeypot)
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ honeypot : un vrai visiteur ne le remplit jamais.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const rawUrl = (body.url || "").trim();
  const description = (body.description || "").trim();
  const category = CATEGORIES.includes(body.category as any)
    ? (body.category as string)
    : "Autre";
  const evidenceUrl = (body.evidenceUrl || "").trim();

  if (!rawUrl) {
    return NextResponse.json({ error: "Le site à signaler est requis." }, { status: 400 });
  }
  if (description.length < 20) {
    return NextResponse.json(
      { error: "Merci de décrire l'arnaque en au moins 20 caractères." },
      { status: 400 }
    );
  }
  if (description.length > 4000) {
    return NextResponse.json({ error: "Description trop longue." }, { status: 400 });
  }

  const domain = normalizeDomain(rawUrl);
  if (!domain) {
    return NextResponse.json(
      { error: "Adresse de site invalide. Exemple attendu : exemple.com" },
      { status: 400 }
    );
  }

  const domainId = domainToId(domain);
  const ip = getClientIp(req);

  const allowed = await checkRateLimit(ip, domainId);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de signalements envoyés récemment pour ce site. Réessayez plus tard." },
      { status: 429 }
    );
  }

  const moderation = await moderateReport({ domain, description, category });

  const db = getDb();
  const now = Date.now();

  if (!moderation.approved) {
    // On journalise le rejet mais on ne l'affiche jamais publiquement,
    // et on ne le compte pas dans le total du site.
    await db.collection("reports").add({
      domainId,
      domain,
      description,
      evidenceUrl: evidenceUrl || null,
      category,
      createdAt: now,
      moderation: {
        status: "rejete",
        reason: moderation.reason,
        severity: moderation.severity,
      },
    } satisfies ReportDoc);

    return NextResponse.json(
      {
        error:
          "Ce signalement n'a pas pu être publié automatiquement. " +
          moderation.reason,
      },
      { status: 422 }
    );
  }

  const siteRef = db.collection("sites").doc(domainId);

  const result = await db.runTransaction(async (tx) => {
    const siteSnap = await tx.get(siteRef);
    let reportCount: number;
    let justConfirmed = false;

    if (!siteSnap.exists) {
      reportCount = 1;
      const newSite: SiteDoc = {
        domain,
        reportCount,
        status: reportCount >= SEUIL_CONFIRMATION ? "confirme" : "surveillance",
        firstReportedAt: now,
        lastReportedAt: now,
        confirmedAt: reportCount >= SEUIL_CONFIRMATION ? now : null,
        categories: [category],
      };
      justConfirmed = newSite.status === "confirme";
      tx.set(siteRef, newSite);
    } else {
      const existing = siteSnap.data() as SiteDoc;
      reportCount = existing.reportCount + 1;
      const wasConfirmed = existing.status === "confirme";
      justConfirmed = !wasConfirmed && reportCount >= SEUIL_CONFIRMATION;
      const categories = existing.categories.includes(category)
        ? existing.categories
        : [...existing.categories, category];

      tx.update(siteRef, {
        reportCount,
        status: reportCount >= SEUIL_CONFIRMATION ? "confirme" : existing.status,
        lastReportedAt: now,
        confirmedAt: justConfirmed ? now : existing.confirmedAt,
        categories,
      });
    }

    const reportRef = db.collection("reports").doc();
    tx.set(reportRef, {
      domainId,
      domain,
      description,
      evidenceUrl: evidenceUrl || null,
      category,
      createdAt: now,
      moderation: {
        status: "approuve",
        reason: moderation.reason,
        severity: moderation.severity,
      },
    } satisfies ReportDoc);

    return { reportCount, justConfirmed };
  });

  // On n'attend pas indéfiniment l'envoi d'email : il ne doit jamais
  // bloquer la réponse à l'internaute.
  sendReportNotification({
    domain,
    description,
    severity: moderation.severity,
    reportCount: result.reportCount,
    justConfirmed: result.justConfirmed,
  }).catch((err) => console.error("Notification Brevo échouée :", err));

  return NextResponse.json({
    ok: true,
    domain,
    reportCount: result.reportCount,
    status: result.justConfirmed || result.reportCount >= SEUIL_CONFIRMATION
      ? "confirme"
      : "surveillance",
  });
}
