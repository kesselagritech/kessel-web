"use client";
// app/cgv/en/page.tsx — Terms of Sale (library) v1.2 (EN) — [legal-v2] [nokash-v1]
// The French version prevails in case of discrepancy.

import Link from "next/link";
import { LegalShell, Section, H3, P, A, List, Box, EditorBox, EDITOR } from "@/components/legal/LegalShell";

const MAIL = <A href={`mailto:${EDITOR.email}`}>{EDITOR.email}</A>;

export default function TermsOfSaleEnPage() {
  return (
    <LegalShell
      title="Terms of"
      accent="Sale."
      meta={
        <>
          Version 1.2 · Effective October 19, 2026 ·{" "}
          <Link href="/cgv" className="underline hover:text-amber">Version française</Link>
        </>
      }
      footerNote="Last updated: October 19, 2026 · Version 1.2 · The French version prevails in case of discrepancy."
    >
      <div className="reveal">
        <P last>
          These Terms of Sale apply to any purchase of a document from the <strong>Kessel library</strong> on
          kesselagritech.com. Clicking &quot;Buy&quot; (or the button of the chosen payment method) means accepting the Terms of Sale in force at that moment. They complement
          the <Link href="/cgu/en" className="text-amber hover:underline">Terms of Use</Link> and the{" "}
          <Link href="/confidentialite/en" className="text-amber hover:underline">Privacy Policy</Link>.
        </P>
      </div>

      <Section title="1. Seller">
        <EditorBox lang="en" />
      </Section>

      <Section title="2. What you buy">
        <P>
          The library offers educational digital documents: <strong>business plans</strong>, <strong>technical sheets</strong>{" "}
          (technical itineraries) and <strong>educational guides</strong>. Before purchase, each document page shows its title,
          description, price and last update date.
        </P>
        <P last>
          A purchased document is read <strong>online, on the website</strong>, from your account. No file is downloaded or sent
          by email, and no physical goods are delivered.
        </P>
      </Section>

      <Section title="3. Prices">
        <List
          items={[
            "Prices are shown in CFA francs (FCFA) on each document page, before any payment.",
            "The price paid is the one shown when you click \"Buy\" (or the button of the chosen payment method). Kessel adds no fee.",
            "Payment is charged in FCFA, including by bank card. Any fees charged by your Mobile Money operator or bank, including currency conversion fees for a card issued outside the FCFA zone, do not depend on Kessel.",
            "Kessel may change its prices at any time; a change never applies to a purchase already paid.",
          ]}
        />
      </Section>

      <Section title="4. Ordering and payment">
        <List
          items={[
            "A website account (email and password) is required. It is separate from your mobile app account.",
            "Payment is made on the secure page of our payment provider NOKASH, by Mobile Money (Orange Money, MTN Mobile Money) or by bank card (Visa, Mastercard). Kessel never receives or stores your card details.",
            "A purchase is only confirmed once NOKASH confirms the payment and our servers verify it. Returning to the website is not enough.",
            "With Mobile Money, confirmation may arrive late if you approve the transaction later on your phone: the document then unlocks automatically.",
          ]}
        />
        <Box tone="amber">
          <p className="text-forest-dark font-semibold">Charged but the document is still locked?</p>
          <p className="text-ink-mid text-sm">
            Write to {MAIL} or on WhatsApp at {EDITOR.phone} with your account email, the document, the date and the transaction
            reference (received by SMS or email). We check with NOKASH and either unlock the document or refund you.
          </p>
        </Box>
      </Section>

      <Section title="5. Delivery and access to the document">
        <List
          items={[
            "Delivery time: access opens immediately once payment is confirmed, under \"My purchases\".",
            "Method: online reading on the website, from your account, on a computer or phone.",
            "Access is personal and linked to your account. It lasts as long as your account exists and the library is operated.",
            "Updates to a purchased document are included at no extra cost.",
            "Your website account is never deleted for inactivity. If you request its deletion, access to your purchases is permanently lost.",
            "Should Kessel stop operating the library, you would be notified by email at least 30 days in advance.",
          ]}
        />
      </Section>

      <Section title="6. Cancellation, withdrawal and refunds">
        <H3>6.1 Cancellation before payment</H3>
        <P>
          Until payment is confirmed, you may abandon the purchase at no cost: close the payment page or do not approve the
          transaction on your phone. No amount is then charged and no purchase is recorded.
        </P>
        <H3>6.2 No withdrawal after access</H3>
        <P>
          The document is digital content supplied immediately, at your request, once payment is confirmed. By clicking
          &quot;Buy&quot; (or the button of the chosen payment method), you request this immediate access: <strong>no refund is due once the document is accessible</strong>,
          except in the cases listed in 6.3.
        </P>
        <H3>6.3 Refund cases</H3>
        <List
          items={[
            "Double payment for the same document.",
            "Payment charged without the document being unlocked, with no solution within 7 days of your complaint.",
            "Document withdrawn from the library, unreadable, or clearly different from its description.",
            "Card payment made without the cardholder's authorisation (see 6.5).",
          ]}
        />
        <H3>6.4 Procedure</H3>
        <P>
          Requests go to {MAIL} within 30 days of purchase, with your account email, the document, the date and the transaction
          reference. An accepted refund is paid within 14 days, through the payment method used (card or Mobile Money account
          charged), via NOKASH. Access to the refunded document is then removed from the account.
        </P>
        <H3>6.5 Disputed or fraudulent payment</H3>
        <P last>
          If the holder of a card or Mobile Money account reports a payment they did not authorise, Kessel immediately suspends
          access to the document concerned, checks the transaction with NOKASH, refunds the payment found to be fraudulent and may
          block the account used. Kessel keeps the evidence of the purchase (date, account, transaction reference, access to the
          document) and provides it to NOKASH in the event of a dispute.
        </P>
      </Section>

      <Section title="7. What you may do with the document">
        <P>You may read the document and use it for your own project or business.</P>
        <List
          variant="cross"
          items={[
            "Resell, rent out or distribute the document, in whole or in part.",
            "Share your account or credentials.",
            "Copy, mass-print, screen-capture or republish the content on another medium, website or social network.",
            "Extract the content by automated means.",
          ]}
        />
        <P last>
          Quoting a short excerpt with &quot;Kessel Agritech&quot; named as the source is allowed. Documents remain the exclusive
          property of Kessel Agritech.
        </P>
      </Section>

      <Section title="8. Nature of the content and liability">
        <H3>8.1 Educational documents, not a guarantee of results</H3>
        <P>
          Yields, prices, costs, margins and financial projections are estimates made at the document&apos;s date, from cited
          sources. They vary with land, climate, market and project management. Documents are neither a feasibility study of your
          project nor financial or investment advice. Have your project reviewed by a technician or agronomist before committing
          funds.
        </P>
        <H3>8.2 Limitation of liability</H3>
        <P last>
          Kessel&apos;s liability for a purchase is limited to the price paid for the document concerned. Kessel is not liable for
          crop losses, loss of earnings or investment decisions made on the basis of a document, except gross negligence or
          mandatory legal provision to the contrary.
        </P>
      </Section>

      <Section title="9. Customer service and complaints">
        <P last>Send any complaint to {MAIL} or on WhatsApp at {EDITOR.phone}. We reply within 15 days at most.</P>
      </Section>

      <Section title="10. Personal data">
        <P last>
          Purchase-related data is processed under our{" "}
          <Link href="/confidentialite/en" className="text-amber hover:underline">Privacy Policy</Link>. Purchase records are kept
          for 10 years, as required by accounting law.
        </P>
      </Section>

      <Section title="11. Changes to the Terms of Sale">
        <P last>Kessel may amend these Terms of Sale. Each purchase is governed by the version in force on the day of purchase.</P>
      </Section>

      <Section title="12. Governing law and disputes">
        <P last>
          These Terms of Sale are governed by Cameroonian law, in particular Law No. 2010/021 of December 21, 2010 on electronic
          commerce and Framework Law No. 2011/012 of May 6, 2011 on consumer protection. In case of dispute, an amicable solution
          is sought first. Failing that, the competent courts of Douala have jurisdiction, unless a mandatory rule of the
          buyer&apos;s country of residence provides otherwise.
        </P>
      </Section>
    </LegalShell>
  );
}
