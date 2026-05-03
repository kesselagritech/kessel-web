"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriPatterns from "@/components/AgriPatterns";

export default function TermsEnPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      <section className="bg-forest-dark pt-28 pb-16 relative">
        <AgriPatterns />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Legal</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Terms of<br /><em className="text-amber-light">Use.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-white/70 text-sm">
            Version 1.0 · Effective May 3, 2026 · <Link href="/cgu" className="underline hover:text-amber">Version française</Link>
          </p>
        </div>
      </section>

      <section className="py-24 bg-neutral">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm">
            <div className="prose prose-lg max-w-none">

              <div className="reveal">
                <p className="text-ink-mid leading-relaxed mb-8">
                  These Terms of Use ("<strong>Terms</strong>") govern the use of the Kessel mobile application and all associated services (the "<strong>Service</strong>"), published by Kessel Agritech. By downloading, installing or using the Service, you ("<strong>User</strong>") acknowledge that you have read and accepted these Terms without reservation.
                </p>
              </div>

              <div className="reveal reveal-delay-1">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>1. Publisher identity</h2>
                <div className="bg-forest-light p-6 rounded-xl mb-8">
                  <p className="text-forest-dark"><strong>Kessel Agritech</strong> (RCCM registration in progress)</p>
                  <p className="text-ink-mid">Represented by: Atine Mvom Philippe André, Founder and Director</p>
                  <p className="text-ink-mid">Address: Ebome, Kribi, Cameroon</p>
                  <p className="text-ink-mid">Email: <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a></p>
                </div>
              </div>

              <div className="reveal reveal-delay-2">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>2. Service description</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Kessel is a mobile application designed to help with agricultural project management, intended for farmers and agricultural technicians, primarily in Cameroon. The Service includes:
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Creation and tracking of agricultural projects.",
                    "Planning and management of field tasks.",
                    "Capturing and geolocating photo evidence reports.",
                    "Financial tracking of projects (expenses, revenues).",
                    "Market price monitoring.",
                    "Inviting and collaborating with agricultural technicians.",
                    "Receiving reminders and alerts (weather, prices, tasks).",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-light/30 border border-amber/30 rounded-xl p-5 mb-8">
                  <p className="text-forest-dark font-semibold mb-2">⚠️ Usage doctrine: "Kessel assists, does not prescribe"</p>
                  <p className="text-ink-mid text-sm">
                    The Service provides information, tracking tools and indicators. It is in no way intended to replace the expertise of an agricultural technician, agronomist or any qualified professional. Agricultural decisions are the sole responsibility of the User.
                  </p>
                </div>
              </div>

              <div className="reveal reveal-delay-3">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>3. Access conditions</h2>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-4">3.1 Legal capacity</h3>
                <p className="text-ink-mid leading-relaxed mb-4">
                  The Service is reserved for <strong>adult</strong> persons (18 years and older) with the legal capacity to contract.
                </p>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-4">3.2 Account creation</h3>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Accessing the Service requires creating an account with a valid phone number. You are solely responsible for the confidentiality of your code/password.
                </p>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-4">3.3 Technical compatibility</h3>
                <ul className="space-y-2 mb-8">
                  {[
                    "Android phone (version 7.0 / API 24 minimum) or iPhone (iOS 15 minimum).",
                    "Internet connection for synchronization (offline mode for most functions).",
                    "Minimum storage of 200 MB.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal reveal-delay-4">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>4. Plans, subscription and payment</h2>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-4">4.1 Available plans</h3>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Kessel offers two formulas: a free individual formula and a paid collective formula ("Kessel Team").
                </p>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-forest-dark text-white">
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Plan</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Price</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Audience & included</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-mid">
                        <td className="p-3 font-medium">Kessel</td>
                        <td className="p-3 text-ink-mid">Free (0 FCFA)</td>
                        <td className="p-3 text-ink-mid">Individual farmer · 1 invited technician · market prices for <strong>one region</strong> only · core features (projects, tasks, finances, field reports, notifications)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Kessel Team</td>
                        <td className="p-3 text-ink-mid">10,000 FCFA / month<br />or 100,000 FCFA / year<br /><span className="text-xs text-amber">(2 months free on yearly)</span></td>
                        <td className="p-3 text-ink-mid">Multiple registered collaborators · multiple invited technicians · market prices for <strong>all regions</strong> of Cameroon · access to technician catalog</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-4">4.2 Payment methods (Kessel Team)</h3>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Kessel Team subscription can be paid via two methods:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-ink-mid">
                    <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    <span><strong>CamPay</strong>: mobile money (Orange Money or MTN Mobile Money), in-app.</span>
                  </li>
                  <li className="flex items-start gap-2 text-ink-mid">
                    <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    <span><strong>Bank transfer</strong>: on request to <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a> (banking details and invoices provided).</span>
                  </li>
                </ul>
                <p className="text-ink-mid leading-relaxed mb-4">
                  No credit cards are currently accepted. Any fees charged by your mobile operator or bank are at your expense.
                </p>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-4">4.3 Subscription cycle and renewal</h3>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Kessel Team subscription is offered as <strong>monthly</strong> (10,000 FCFA for 30 days) or <strong>yearly</strong> (100,000 FCFA for 365 days, i.e. 2 months free compared to monthly billing).
                </p>
                <p className="text-ink-mid leading-relaxed mb-4">
                  The subscription is <strong>not auto-renewed</strong>. Upon expiration of the paid period, your account automatically returns to the free Kessel plan. To keep Team features, you must manually reactivate via the application or by bank transfer.
                </p>
                <p className="text-ink-mid leading-relaxed mb-8">
                  No charge is made without explicit new action on your part. No prorated refund is issued for periods already paid, except in exceptional cases assessed individually.
                </p>
              </div>

              <div className="reveal reveal-delay-5">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>5. User commitments</h2>
                <ul className="space-y-2 mb-8">
                  {[
                    "Comply with Cameroonian law (notably Law No. 2010/012 on cybercrime).",
                    "Not use the Service for fraudulent or unethical purposes.",
                    "Not attempt to circumvent security measures.",
                    "Not perform reverse engineering or decompilation of the code.",
                    "Not overload or disrupt servers.",
                    "Not impersonate another user.",
                    "Respect agricultural technicians: no harassment, no discriminatory remarks.",
                    "Guarantee the truthfulness of agricultural information you enter.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-brick shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>6. User-published content</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  You retain ownership of content you publish via the Service (photos, reports, project data). However, you grant us a <strong>non-exclusive, worldwide, royalty-free license</strong> to use, store, reproduce and adapt such content, only as necessary to provide the Service.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>7. Intellectual property</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  The Kessel application, its trademark, logo (the hexagon and "K"), interface, source code, and all associated documentation are the exclusive property of Kessel Agritech. Any unauthorized reproduction is subject to prosecution.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>8. Availability</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  We strive to ensure Service availability 24/7, but cannot guarantee absolute availability. The Service may be temporarily interrupted for maintenance, updates or in case of force majeure.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>9. Limitation of liability</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  The Service is provided "<strong>as is</strong>". We do not guarantee accuracy of all information (market prices, weather, reminders), absence of bugs, or suitability for a particular use other than that described.
                </p>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Our liability is limited to the amount actually paid by the User over the 12 months preceding the triggering event. We are in no case liable for indirect damages (crop loss, lost profits, user data loss).
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>10. Personal data</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  The processing of your personal data is governed by our <Link href="/confidentialite/en" className="text-amber hover:underline">Privacy Policy</Link>, which is an integral part of these Terms.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>11. Account deletion</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  You may delete your account at any time from in-app Settings, or by emailing <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a>. Deletion is effective within 30 days (reversibility window).
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>12. Termination by Kessel</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  We may suspend or terminate your access in case of serious breach of these Terms, fraudulent use, security risk or prolonged inactivity (more than 24 months).
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>13. Changes to these Terms</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  We may modify these Terms. Substantial changes will be notified at least 30 days before their effective date.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>14. Applicable law</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  These Terms are governed by <strong>Cameroonian law</strong>. Disputes shall fall under the exclusive jurisdiction of the courts of <strong>Kribi, Cameroon</strong>.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>15. Contact</h2>
                <p className="text-ink-mid leading-relaxed">
                  For any question regarding these Terms:<br />
                  📧 <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a><br />
                  📱 WhatsApp: <a href="https://wa.me/237659374501" className="text-amber hover:underline">+237 659 374 501</a><br />
                  🏢 Kessel Agritech, Ebome, Kribi, Cameroon
                </p>
              </div>

            </div>

            <div className="mt-12 pt-8 border-t border-neutral-mid text-center">
              <p className="text-ink-light text-sm">Last updated: May 3, 2026 · Version 1.0</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
