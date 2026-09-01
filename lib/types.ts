export type SiteStatus = "surveillance" | "confirme";

export type SiteDoc = {
  domain: string;
  reportCount: number;
  status: SiteStatus;
  firstReportedAt: number;
  lastReportedAt: number;
  confirmedAt: number | null;
  categories: string[];
};

export type ReportDoc = {
  domainId: string;
  domain: string;
  description: string;
  evidenceUrl: string | null;
  category: string;
  createdAt: number;
  moderation: {
    status: "approuve" | "rejete";
    reason: string;
    severity: "faible" | "moyenne" | "elevee";
  };
};

export const CATEGORIES = [
  "Faux site e-commerce",
  "Phishing / vol d'identifiants",
  "Faux investissement / crypto",
  "Fausse offre d'emploi",
  "Usurpation de marque",
  "Faux support technique",
  "Autre",
] as const;
