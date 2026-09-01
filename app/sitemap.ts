import type { MetadataRoute } from "next";
import { getAllSitesForSitemap } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scamwatch.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/signaler`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/comment-ca-marche`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/a-propos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/mentions-legales`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cgu`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const sites = await getAllSitesForSitemap();
    const siteRoutes: MetadataRoute.Sitemap = sites.map((site) => ({
      url: `${SITE_URL}/site/${encodeURIComponent(site.domain)}`,
      lastModified: new Date(site.lastReportedAt),
      changeFrequency: "daily",
      priority: site.status === "confirme" ? 0.9 : 0.6,
    }));
    return [...staticRoutes, ...siteRoutes];
  } catch (error) {
    console.error("Erreur de génération du sitemap :", error);
    return staticRoutes;
  }
}
