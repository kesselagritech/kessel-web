"use client";
// app/cgu/en/page.tsx — Terms of Use v2.0 (EN) — [legal-v2]
// The French version prevails in case of discrepancy.

import Link from "next/link";
import { LegalShell, Section, H3, P, A, List, Box, EditorBox, EDITOR } from "@/components/legal/LegalShell";

const MAIL = <A href={`mailto:${EDITOR.email}`}>{EDITOR.email}</A>;
const CGV = <Link href="/cgv/en" className="text-amber hover:underline">Terms of Sale</Link>;

export default function TermsEnPage() {
  return (
    <LegalShell
      title="Terms of"
      accent="Use."
      meta={
        <>
          Version 2.0 · Published October 12, 2026 ·{" "}
          <Link href="/cgu" className="underline hover:text-amber">Version française</Link>
        </>
      }
      footerNote="Last updated: October 12, 2026 · Version 2.0 · The French version prevails in case of discrepancy."
    >
      <div className="reveal">
        <P last>
          These Terms of Use (&quot;<strong>Terms</strong>&quot;) govern the use of the <strong>kesselagritech.com</strong>{" "}
          website and the <strong>Kessel</strong> mobile app (together, the &quot;<strong>Service</strong>&quot;), published by
          Kessel Agritech. By using the Service, you (&quot;<strong>User</strong>&quot;) accept these Terms. Library purchases are
          also governed by the {CGV}.
        </P>
      </div>

      <Section title="1. Publisher">
        <EditorBox lang="en" />
      </Section>

      <Section title="2. The Service">
        <H3>2.1 The kesselagritech.com website</H3>
        <P>Open to farm promoters and project holders across Africa, it offers:</P>
        <List
          items={[
            "A paid library of business plans, technical sheets and educational guides.",
            "A free farm project comparator.",
            "Free information pages (crops and livestock, agro-ecological zones, guides, technical itineraries).",
            "A collaborator space to follow, read-only, the farm of a promoter who has given you their code.",
          ]}
        />
        <H3>2.2 The Kessel mobile app</H3>
        <P>Designed for Cameroon and free of charge, it lets you:</P>
        <List
          items={[
            "Create and track farm projects and their tasks.",
            "File field reports with geotagged photos.",
            "Track project finances (expenses, revenues, harvests).",
            "Invite farm technicians to your projects.",
            "Work with Kessel supervisors: messaging and specifications.",
            "View indicative market prices, reminders and alerts.",
          ]}
        />
        <Box tone="amber">
          <p className="text-forest-dark font-semibold">Usage rule: &quot;Kessel helps, it does not prescribe&quot;</p>
          <p className="text-ink-mid text-sm">
            The app, the comparator and the library documents provide information, tools and estimates. They do not replace the
            advice of a technician, an agronomist or a financial adviser. Farming and investment decisions remain the sole
            responsibility of the User.
          </p>
        </Box>
      </Section>

      <Section title="3. Access and accounts">
        <H3>3.1 Age</H3>
        <P>Creating an account and making purchases are reserved for people aged 18 and over.</P>
        <H3>3.2 Two separate accounts</H3>
        <List
          items={[
            "App account: phone number and PIN code.",
            "Website account: email address and password. It gives access to your purchases and the collaborator space.",
          ]}
        />
        <P>
          You provide accurate information and keep your credentials secret. Any action taken with your credentials is deemed to
          be taken by you.
        </P>
        <H3>3.3 Compatible devices (app)</H3>
        <List
          items={[
            "Android 7.0 or later, or iPhone with iOS 15 or later.",
            "Internet connection to sync; most features work offline.",
            "200 MB of free storage.",
          ]}
        />
      </Section>

      <Section title="4. What is free, what is paid">
        <P>
          The app, the comparator, the information pages and the collaborator space are free. Library documents are paid, one
          by one. In short:
        </P>
        <List
          items={[
            "The price is shown in FCFA on each document page, before payment.",
            "Payment goes through CamPay: Mobile Money (MTN, Orange) and, where offered, bank card.",
            "The document is read online from your website account, updates included.",
            "No refund once the document is accessible, except double payment, payment without access or non-conforming document.",
            "Personal or internal business use only: no resale, sharing or redistribution.",
          ]}
        />
        <P>Full details are in the {CGV}, which prevail in case of conflict.</P>
        <P last>
          A &quot;Kessel Team&quot; plan for organisations is under study. It is not active. No charge can be made without an
          explicit action on your part.
        </P>
      </Section>

      <Section title="5. Your commitments">
        <P>You agree not to:</P>
        <List
          variant="cross"
          items={[
            "Break the law, in particular Law No. 2010/012 of December 21, 2010 on cybersecurity and cybercrime.",
            "Use the Service fraudulently or against public decency.",
            "Bypass security measures, decompile the code or overload the servers.",
            "Impersonate another user or share your accounts.",
            "Copy, resell or distribute purchased documents.",
            "Harass or make discriminatory remarks towards a technician, a supervisor or a promoter.",
            "Disclose data of a farm viewed in the collaborator space without the promoter's consent.",
            "Enter farm or financial information you know to be false.",
          ]}
        />
      </Section>

      <Section title="6. Your content">
        <P last>
          You remain the owner of what you publish (photos, reports, project data). You grant us a non-exclusive, worldwide,
          royalty-free licence to store, reproduce and display this content, only as needed to run the Service. You warrant that
          you hold the rights to this content.
        </P>
      </Section>

      <Section title="7. Intellectual property">
        <P last>
          The Kessel brand, its logo (the hexagon and the &quot;K&quot;), the website, the app, their code, texts and library
          documents are the exclusive property of Kessel Agritech. Any unauthorised reproduction or use is prohibited and may lead
          to legal action.
        </P>
      </Section>

      <Section title="8. Availability">
        <P last>
          We aim for continuous availability but cannot guarantee it. The Service may be interrupted for maintenance, updates or
          force majeure.
        </P>
      </Section>

      <Section title="9. Limitation of liability">
        <P>The Service is provided &quot;as is&quot;. We do not guarantee:</P>
        <List
          items={[
            "The absolute accuracy of information (market prices, estimates, projections, reminders).",
            "The total absence of errors or interruptions.",
            "Fitness of the Service for a use other than the one described.",
          ]}
        />
        <P last>
          Our liability is limited to the sums you paid us in the last 12 months. We are not liable for indirect damage (crop
          loss, loss of earnings, loss of data), except gross negligence or mandatory legal provision to the contrary.
        </P>
      </Section>

      <Section title="10. Personal data">
        <P last>
          Your data is processed under our{" "}
          <Link href="/confidentialite/en" className="text-amber hover:underline">Privacy Policy</Link>, which forms part of these
          Terms.
        </P>
      </Section>

      <Section title="11. Account deletion">
        <H3>11.1 App account</H3>
        <List
          items={[
            "You can delete it at any time from the app (Settings → Delete my account) or by writing to " + EDITOR.email + ".",
            "Your account and projects are erased upon request; photos and backup copies within 30 days at most.",
            "Data you entered in other users' projects remains there, without your name.",
          ]}
        />
        <Box tone="amber">
          <p className="text-forest-dark font-semibold">Inactivity: deletion after 6 months</p>
          <p className="text-ink-mid text-sm">
            An app account with no sign-in for 6 consecutive months is permanently deleted, together with its projects. A single
            sign-in resets the counter. This rule applies from November 12, 2026.
          </p>
        </Box>
        <H3>11.2 Website account (library)</H3>
        <P last>
          It is <strong>never deleted for inactivity</strong>, so your purchases remain accessible. You can request its deletion
          at {MAIL}; access to purchased documents is then permanently lost. Purchase records are kept for 10 years, as required
          by accounting law.
        </P>
      </Section>

      <Section title="12. Suspension by Kessel">
        <P last>
          We may suspend or close an account in case of serious breach of these Terms or the Terms of Sale, fraud or threat to
          the security of the Service. Except in emergencies, we notify you beforehand.
        </P>
      </Section>

      <Section title="13. Changes to these Terms">
        <P last>
          Any significant change is announced at least 30 days in advance: by in-app notification, by email for website
          accounts, and on this page.
        </P>
      </Section>

      <Section title="14. Governing law and disputes">
        <P last>
          These Terms are governed by Cameroonian law. In case of dispute, an amicable solution is sought first. Failing that,
          the competent courts of Douala have jurisdiction, unless a mandatory rule provides otherwise.
        </P>
      </Section>

      <Section title="15. Contact">
        <Box>
          <p className="text-ink-mid">Email: {MAIL}</p>
          <p className="text-ink-mid">
            WhatsApp: <A href={EDITOR.wa}>{EDITOR.phone}</A>
          </p>
        </Box>
      </Section>
    </LegalShell>
  );
}
