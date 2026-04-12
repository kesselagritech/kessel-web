import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom_complet, telephone, email, sujet, message } = body;

    if (!nom_complet || !sujet || !message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Kessel Contact <contact@kesselagritech.com>",
        to: ["contact@kesselagritech.com"],
        subject: "[Contact Kessel] " + sujet,
        html: "<h2>Nouveau message de contact</h2>" +
          "<p><strong>Nom:</strong> " + nom_complet + "</p>" +
          "<p><strong>Telephone:</strong> " + (telephone || "-") + "</p>" +
          "<p><strong>Email:</strong> " + (email || "-") + "</p>" +
          "<p><strong>Sujet:</strong> " + sujet + "</p>" +
          "<hr/>" +
          "<p>" + message.replace(/\n/g, "<br/>") + "</p>",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}