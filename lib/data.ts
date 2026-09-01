import { getDb } from "@/lib/firebase-admin";
import type { ReportDoc, SiteDoc } from "@/lib/types";
import { domainToId } from "@/lib/domain";

export async function getConfirmedSites(limit = 50): Promise<SiteDoc[]> {
  const db = getDb();
  const snap = await db
    .collection("sites")
    .where("status", "==", "confirme")
    .orderBy("reportCount", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => d.data() as SiteDoc);
}

export async function getWatchedSites(limit = 50): Promise<SiteDoc[]> {
  const db = getDb();
  const snap = await db
    .collection("sites")
    .where("status", "==", "surveillance")
    .orderBy("reportCount", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => d.data() as SiteDoc);
}

export async function getAllSitesForSitemap(limit = 5000): Promise<SiteDoc[]> {
  const db = getDb();
  const snap = await db.collection("sites").limit(limit).get();
  return snap.docs.map((d) => d.data() as SiteDoc);
}

export async function getSiteByDomain(domain: string): Promise<SiteDoc | null> {
  const db = getDb();
  const snap = await db.collection("sites").doc(domainToId(domain)).get();
  if (!snap.exists) return null;
  return snap.data() as SiteDoc;
}

export async function getApprovedReportsForDomain(
  domain: string,
  limit = 100
): Promise<ReportDoc[]> {
  const db = getDb();
  const snap = await db
    .collection("reports")
    .where("domainId", "==", domainToId(domain))
    .where("moderation.status", "==", "approuve")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => d.data() as ReportDoc);
}

export async function getSiteCount(): Promise<{ total: number; confirmed: number }> {
  const db = getDb();
  const [totalSnap, confirmedSnap] = await Promise.all([
    db.collection("sites").count().get(),
    db.collection("sites").where("status", "==", "confirme").count().get(),
  ]);
  return {
    total: totalSnap.data().count,
    confirmed: confirmedSnap.data().count,
  };
}
