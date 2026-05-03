"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriPatterns from "@/components/AgriPatterns";

export default function PrivacyEnPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />

      <section className="bg-forest-dark pt-28 pb-16 relative">
        <AgriPatterns />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Legal</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Privacy<br /><em className="text-amber-light">Policy.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-white/70 text-sm">
            Version 1.0 · Effective May 3, 2026 · <Link href="/confidentialite" className="underline hover:text-amber">Version française</Link>
          </p>
        </div>
      </section>

      <section className="py-24 bg-neutral">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm">
            <div className="prose prose-lg max-w-none">

              <div className="reveal">
                <p className="text-ink-mid leading-relaxed mb-8">
                  Kessel Agritech ("<strong>Kessel</strong>", "we") is committed to protecting the privacy of users of our mobile application and related services (the "<strong>Service</strong>"). This policy explains what personal data we collect, why, how we use it, and what your rights are.
                </p>
              </div>

              <div className="reveal reveal-delay-1">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>1. Data Controller</h2>
                <div className="bg-forest-light p-6 rounded-xl mb-6">
                  <p className="text-forest-dark"><strong>Kessel Agritech</strong> (RCCM registration in progress)</p>
                  <p className="text-ink-mid">Represented by: Atine Mvom Philippe André, Founder and Director</p>
                  <p className="text-ink-mid">Address: Ebome, Kribi, Cameroon</p>
                  <p className="text-ink-mid">Email: <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a></p>
                </div>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Given the size of our organization, the Data Controller also serves as the Data Protection Officer (DPO).
                </p>
              </div>

              <div className="reveal reveal-delay-2">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>2. Data we collect</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  We only collect data strictly necessary for the operation of the Service. <strong>No data is sold to third parties.</strong>
                </p>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-forest-dark text-white">
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Category</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Data</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Identity</td><td className="p-3 text-ink-mid">Phone number, first name, last name (optional), language</td><td className="p-3 text-ink-mid">Account creation and management</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Location</td><td className="p-3 text-ink-mid">GPS coordinates when capturing field photos</td><td className="p-3 text-ink-mid">Geolocate agricultural reports</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Photos</td><td className="p-3 text-ink-mid">Images captured via camera (field evidence)</td><td className="p-3 text-ink-mid">Document project reports</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Business</td><td className="p-3 text-ink-mid">Projects, tasks, expenses, revenues, reports</td><td className="p-3 text-ink-mid">Agricultural management service</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Payment</td><td className="p-3 text-ink-mid">Mobile money number (Orange Money, MTN MoMo) or bank transfer details (on request, Kessel Team)</td><td className="p-3 text-ink-mid">Processing via CamPay or bank transfer (no card data stored)</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Technical</td><td className="p-3 text-ink-mid">Push notification token, session IDs, device model</td><td className="p-3 text-ink-mid">Notifications, security, support</td></tr>
                      <tr><td className="p-3 font-medium">Logs</td><td className="p-3 text-ink-mid">Crashes, anonymized technical IDs</td><td className="p-3 text-ink-mid">Diagnostics via Sentry</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-forest-dark mb-2 mt-6">2.1 What we do NOT collect</h3>
                <ul className="space-y-2 mb-8">
                  {[
                    "Phone contact list",
                    "Browsing history outside the application",
                    "Photos or files on your phone (other than those captured via Kessel)",
                    "Biometric data",
                    "Credit card numbers (mobile money via CamPay or bank transfer for Kessel Team only)",
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

              <div className="reveal reveal-delay-3">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>3. Legal basis for processing</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  In compliance with Cameroonian Law No. 2010/012 of December 21, 2010 and GDPR principles which we apply by alignment, each processing operation is based on one of the following grounds:
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Performance of contract (account, projects, reports, payments).",
                    "Explicit consent (GPS location, camera access).",
                    "Legitimate interest (security, technical diagnostics).",
                    "Legal obligation (financial operations, fraud prevention).",
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
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>4. App permissions</h2>
                <div className="overflow-x-auto mb-8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-forest-dark text-white">
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Permission</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Why</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Refusable?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Camera</td><td className="p-3 text-ink-mid">Capture field evidence</td><td className="p-3 text-ink-mid">Yes</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Precise location</td><td className="p-3 text-ink-mid">Geolocate photos</td><td className="p-3 text-ink-mid">Yes</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Notifications</td><td className="p-3 text-ink-mid">Reminders, messages, price alerts</td><td className="p-3 text-ink-mid">Yes</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Local storage</td><td className="p-3 text-ink-mid">Offline mode</td><td className="p-3 text-ink-mid">No (essential)</td></tr>
                      <tr><td className="p-3 font-medium">Internet</td><td className="p-3 text-ink-mid">Server synchronization</td><td className="p-3 text-ink-mid">No (essential)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="reveal reveal-delay-5">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>5. Hosting and processors</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  Your data is hosted by the following providers, all contractually committed to high security standards:
                </p>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-forest-dark text-white">
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Processor</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Service</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Supabase Inc.</td><td className="p-3 text-ink-mid">Database, auth, file storage</td><td className="p-3 text-ink-mid">United States (us-west-2, Oregon)</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Expo (EAS)</td><td className="p-3 text-ink-mid">Push notifications</td><td className="p-3 text-ink-mid">United States</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Vercel Inc.</td><td className="p-3 text-ink-mid">Website and admin tools</td><td className="p-3 text-ink-mid">United States / EU (global CDN)</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">CamPay</td><td className="p-3 text-ink-mid">Mobile money payments</td><td className="p-3 text-ink-mid">Cameroon</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Sentry</td><td className="p-3 text-ink-mid">Crash diagnostics</td><td className="p-3 text-ink-mid">European Union</td></tr>
                      <tr><td className="p-3 font-medium">Google FCM</td><td className="p-3 text-ink-mid">Notification delivery</td><td className="p-3 text-ink-mid">United States</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-ink-mid leading-relaxed mb-8">
                  Some processors are located outside Cameroon (United States, European Union). To ensure adequate protection, these transfers are governed by the <strong>Standard Contractual Clauses</strong> of the European Commission and the providers' compliance policies.
                </p>
              </div>

              <div className="reveal reveal-delay-6">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>6. Retention period</h2>
                <div className="overflow-x-auto mb-8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-forest-dark text-white">
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Data type</th>
                        <th className="p-3 text-left font-semibold" style={{ fontFamily: "var(--serif)" }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Account (active)</td><td className="p-3 text-ink-mid">As long as the account is active</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Account (after deletion)</td><td className="p-3 text-ink-mid">30 days (reversibility), then permanent erasure</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Photos and reports</td><td className="p-3 text-ink-mid">As long as the project is active, or until manual deletion</td></tr>
                      <tr className="border-b border-neutral-mid"><td className="p-3 font-medium">Technical logs</td><td className="p-3 text-ink-mid">90 days maximum</td></tr>
                      <tr><td className="p-3 font-medium">Payment records</td><td className="p-3 text-ink-mid">10 years (accounting obligation)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>7. Your rights</h2>
                <ul className="space-y-2 mb-4">
                  {[
                    "Right of access: obtain a copy of all data we hold about you.",
                    "Right to rectification: correct inaccurate data.",
                    "Right to erasure: request deletion of your account.",
                    "Right to portability: receive your data in a structured format.",
                    "Right to object: object to a particular processing operation.",
                    "Right to withdraw consent: at any time.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-ink-mid leading-relaxed mb-4">
                  To exercise these rights, write to <a href="mailto:contact@kesselagritech.com" className="text-amber hover:underline">contact@kesselagritech.com</a>. We will respond within <strong>30 days</strong> maximum.
                </p>
                <p className="text-ink-mid leading-relaxed mb-8">
                  If you disagree, you may file a complaint with the <strong>National Agency for Information and Communication Technologies (ANTIC)</strong> in Cameroon, or any competent authority in your country.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>8. Security</h2>
                <ul className="space-y-2 mb-4">
                  {[
                    "End-to-end encrypted communications (HTTPS/TLS 1.3).",
                    "Passwords stored as hashes (PBKDF2 with unique salt).",
                    "Strict database access policies (Row Level Security).",
                    "Multi-factor authentication for the technical team.",
                    "Encrypted and redundant backups.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-mid">
                      <svg className="w-5 h-5 text-forest shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-ink-mid leading-relaxed mb-8">
                  In the event of a data breach affecting your rights, we commit to notifying you within a maximum of <strong>72 hours</strong>.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>9. Minors</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  The Service is not intended for persons under 18. We do not knowingly collect data from minors. If you believe a child has provided us with data, contact us for immediate deletion.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>10. Cookies and local storage</h2>
                <p className="text-ink-mid leading-relaxed mb-4">
                  The mobile app does not use web cookies. However, it stores locally on your device:
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Session tokens (encrypted via iOS SecureStore / Android Keystore).",
                    "Encrypted local copy of your data for offline mode.",
                    "Your preferences (language, notification settings).",
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

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>11. Changes to this policy</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  We may update this policy. Substantial changes will be notified via in-app notification and email at least 30 days before the effective date.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>12. Applicable law</h2>
                <p className="text-ink-mid leading-relaxed mb-8">
                  This policy is governed by Cameroonian law. Disputes shall fall under the exclusive jurisdiction of the courts of Kribi, Cameroon.
                </p>
              </div>

              <div className="reveal">
                <h2 className="text-2xl font-bold text-forest-dark mb-4" style={{ fontFamily: "var(--serif)" }}>13. Contact</h2>
                <p className="text-ink-mid leading-relaxed">
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
