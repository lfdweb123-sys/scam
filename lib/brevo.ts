/**
 * Envoie une notification email via l'API transactionnelle Brevo.
 * N'échoue jamais bruyamment : une erreur d'envoi ne doit pas bloquer
 * la publication d'un signalement.
 */
export async function sendReportNotification(params: {
  domain: string;
  description: string;
  severity: string;
  reportCount: number;
  justConfirmed: boolean;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const recipient = process.env.NOTIFICATION_EMAIL;
  const sender = process.env.NOTIFICATION_SENDER_EMAIL || "notifications@scamwatch.app";

  if (!apiKey || !recipient) {
    console.warn("Brevo non configuré (BREVO_API_KEY / NOTIFICATION_EMAIL manquant).");
    return;
  }

  const { domain, description, severity, reportCount, justConfirmed } = params;

  const subject = justConfirmed
    ? `Site confirmé comme arnaque : ${domain}`
    : `Nouveau signalement : ${domain}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #0A0A0A;">
      <h2 style="margin: 0 0 12px;">${justConfirmed ? "Seuil de confirmation atteint" : "Nouveau signalement publié"}</h2>
      <p><strong>Domaine :</strong> ${domain}</p>
      <p><strong>Nombre total de signalements :</strong> ${reportCount}</p>
      <p><strong>Sévérité estimée :</strong> ${severity}</p>
      <p><strong>Description :</strong></p>
      <p style="white-space: pre-wrap; border-left: 3px solid #D9D9D6; padding-left: 12px;">${escapeHtml(description)}</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { email: sender, name: "ScamWatch" },
        to: [{ email: recipient }],
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Échec de l'envoi Brevo :", response.status, body);
    }
  } catch (error) {
    console.error("Erreur réseau lors de l'envoi Brevo :", error);
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
