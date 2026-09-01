import Anthropic from "@anthropic-ai/sdk";

export type ModerationResult = {
  approved: boolean;
  reason: string;
  severity: "faible" | "moyenne" | "elevee";
};

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY manquant.");
    client = new Anthropic({ apiKey });
  }
  return client;
}

const SYSTEM_PROMPT = `Tu es le modérateur automatique d'un registre public de signalements d'arnaques en ligne (sites web frauduleux, faux e-commerce, phishing, etc.).

Ton rôle : filtrer le contenu manifestement inutilisable, PAS vérifier si l'arnaque est réelle. Sois permissif : les internautes ne sont pas des juristes, leurs signalements peuvent être courts, mal écrits ou émotionnels. Approuve par défaut.

Rejette uniquement si le signalement correspond clairement à l'un de ces cas :
- Spam publicitaire, contenu promotionnel, lien d'affiliation
- Vide, incompréhensible, ou sans aucun rapport avec un signalement d'arnaque
- Attaque personnelle contre un individu nommé (harcèlement, insulte visant une personne physique plutôt qu'un site/service) plutôt qu'un signalement factuel sur un site
- Contenu haineux, discriminatoire ou à caractère sexuel
- Données personnelles sensibles d'un tiers (numéro de carte bancaire complet, mot de passe, etc.) qui ne devraient pas être publiées publiquement

Ne rejette PAS un signalement uniquement parce que :
- Il manque de preuve formelle
- Il est bref
- Le ton est énervé ou déçu (c'est normal pour une victime d'arnaque)

Réponds UNIQUEMENT avec un objet JSON strict, sans texte autour, au format :
{"approved": true|false, "reason": "courte explication en français, une phrase", "severity": "faible"|"moyenne"|"elevee"}

"severity" reflète la gravité du préjudice décrit (perte financière, vol de données, etc.), pas la qualité du texte.`;

export async function moderateReport(params: {
  domain: string;
  description: string;
  category?: string;
}): Promise<ModerationResult> {
  const { domain, description, category } = params;

  try {
    const anthropic = getClient();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Domaine signalé : ${domain}\nCatégorie choisie : ${category || "non précisée"}\nDescription fournie par l'internaute :\n"""\n${description}\n"""`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (
      typeof parsed.approved !== "boolean" ||
      typeof parsed.reason !== "string" ||
      !["faible", "moyenne", "elevee"].includes(parsed.severity)
    ) {
      throw new Error("Réponse de modération mal formée.");
    }

    return parsed as ModerationResult;
  } catch (error) {
    console.error("Erreur de modération Claude :", error);
    // En cas d'échec technique de l'API, on met en attente plutôt que de
    // publier ou de rejeter automatiquement.
    return {
      approved: false,
      reason: "Vérification automatique indisponible, signalement mis en attente.",
      severity: "faible",
    };
  }
}
