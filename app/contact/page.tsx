"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sujets = [
  "Question generale",
  "Demande de demonstration",
  "Partenariat",
  "Support technique",
  "Autre"
];

export default function ContactPage() {
  const [form, setForm] = useState({
    nom_complet: "",
    telephone: "",
    email: "",
    sujet: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.nom_complet || !form.sujet || !form.message) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      setSuccess(true);
      setForm({ nom_complet: "", telephone: "", email: "", sujet: "", message: "" });
    } catch (err) {
      setError("Erreur lors de l envoi. Veuillez reessayer.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          
          <div>
            <p className="text-[#C4A962] font-semibold text-sm tracking-wider mb-4">COORDONNEES</p>
            <h1 className="text-4xl font-bold text-[#1a3c34] mb-2">Nous sommes</h1>
            <p className="text-4xl font-bold text-[#C4A962] italic mb-10">a votre ecoute.</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1a3c34]/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1a3c34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#1a3c34]">Email</p>
                  <p className="text-gray-600">contact@kesselagritech.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1a3c34]/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1a3c34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#1a3c34]">WhatsApp</p>
                  <p className="text-gray-600">+237 659 374 501</p>
                  <p className="text-sm text-[#C4A962]">Reponse rapide garantie</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1a3c34]/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1a3c34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#1a3c34]">Adresse</p>
                  <p className="text-gray-600">Kribi, Region du Sud</p>
                  <p className="text-gray-600">Cameroun</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-6 bg-[#1a3c34]/5 rounded-xl">
              <p className="font-semibold text-[#1a3c34] mb-2">Vous etes une organisation ?</p>
              <p className="text-gray-600 text-sm mb-3">Demandez une demonstration personnalisee de notre plateforme pour ONGs et programmes agricoles.</p>
              <a href="/organisations" className="text-[#C4A962] font-medium hover:underline">
                Decouvrir l offre Organisations &rarr;
              </a>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1a3c34] italic mb-6">Envoyez-nous un message</h2>
            
            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-[#1a3c34] mb-2">Message envoye !</p>
                <p className="text-gray-600">Nous vous repondrons dans les plus brefs delais.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    <input
                      type="text"
                      placeholder="Votre nom"
                      value={form.nom_complet}
                      onChange={(e) => setForm({ ...form, nom_complet: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A962] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                    <input
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={form.telephone}
                      onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A962] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A962] focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                  <select
                    value={form.sujet}
                    onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A962] focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Selectionnez un sujet</option>
                    {sujets.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Decrivez votre demande..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A962] focus:border-transparent outline-none resize-none"
                  />
                </div>
                
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
                
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-[#C4A962] text-white font-semibold rounded-lg hover:bg-[#b39952] transition disabled:opacity-50"
                >
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}