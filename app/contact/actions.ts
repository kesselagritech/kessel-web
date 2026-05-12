"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUJETS: Record<string, string> = {
  question: "Question generale",
  demo: "Demande de demonstration",
  organisation: "Offre Organisations",
  partenariat: "Partenariat",
  autre: "Autre",
};

export async function sendContactMessage(formData: FormData) {
  const nom = String(formData.get("nom") || "").trim();
  const telephone = String(formData.get("telephone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const sujetRaw = String(formData.get("sujet") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const honeypot = String(formData.get("website") || "").trim();

  // Anti-spam : si le champ cache est rempli, c'est un bot
  if (honeypot) return { ok: true as const };

  // Validations
  if (!nom || !email || !message) {
    return { ok: false as const, error: "Merci de remplir nom, email et message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "Email invalide." };
  }
  if (nom.length > 200 || message.length > 5000) {
    return { ok: false as const, error: "Contenu trop long." };
  }

  const sujet = SUJETS[sujetRaw] || "Non specifie";

  try {
    const { error } = await resend.emails.send({
      from: "Site Kessel <onboarding@resend.dev>",
      to: "contact@kesselagritech.com",
      replyTo: email,
      subject: `[Site Kessel] ${sujet} - ${nom}`,
      text: `Nouveau message depuis le formulaire de contact kesselagritech.com

Nom        : ${nom}
Email      : ${email}
Telephone  : ${telephone || "(non renseigne)"}
Sujet      : ${sujet}

Message :
--------
${message}
`,
    });

    if (error) {
      console.error("Resend error:", error);
      return { ok: false as const, error: "Envoi impossible. Reessayez ou ecrivez a contact@kesselagritech.com." };
    }
    return { ok: true as const };
  } catch (e) {
    console.error("Send exception:", e);
    return { ok: false as const, error: "Erreur reseau. Reessayez plus tard." };
  }
}
