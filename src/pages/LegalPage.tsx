import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from './PageShell';

/**
 * Impressum + Datenschutzerklärung. The privacy section states only what is technically true for
 * this static GitHub-Pages site. The Impressum operator fields are PLACEHOLDERS — fill in the
 * real name/address/contact before relying on this page legally.
 */
export default function LegalPage() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView();
  }, [hash]);

  return (
    <PageShell
      title="Impressum & Datenschutz"
      intro="Rechtliche Angaben zu dieser nicht-kommerziellen, edukativen Website. Legal notice and privacy policy for this non-commercial, educational website."
    >
      <div className="max-w-2xl space-y-12 text-[0.95rem] leading-relaxed text-bone/80">
        <section id="impressum" className="scroll-mt-24">
          <h2 className="type-title mb-4 !text-2xl text-bone">Impressum</h2>
          {/* TODO: Betreiberdaten eintragen — Platzhalter, keine echten Angaben. */}
          <p className="mb-3">
            Angaben gemäß Informationspflicht (§ 5 ECG / § 25 MedienG bzw. § 5 TMG):
          </p>
          <p className="mb-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            [Vor- und Nachname des Betreibers]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ und Ort, Land]
            <br />
            E-Mail: [Kontakt-E-Mail-Adresse]
          </p>
          <p>
            Mesozoica ist ein nicht-kommerzielles, edukatives Hobbyprojekt ohne Werbung und ohne
            Verkauf von Waren oder Dienstleistungen. Quellen- und Lizenzangaben zu allen
            3D-Modellen finden sich auf der Credits-Seite.
          </p>
        </section>

        <section id="datenschutz" className="scroll-mt-24">
          <h2 className="type-title mb-4 !text-2xl text-bone">Datenschutzerklärung</h2>
          <p className="mb-3">
            Diese Website ist eine statische Seite ohne Benutzerkonten, Formulare, Kommentare oder
            Newsletter. Es werden <strong>keine Cookies</strong> gesetzt, es findet{' '}
            <strong>kein Tracking</strong> und <strong>keine Analyse</strong> statt, und es werden
            keine personenbezogenen Daten durch die Seite selbst erhoben, gespeichert oder an
            Dritte weitergegeben. Schriften, Bilder, Videos und 3D-Modelle werden lokal von dieser
            Seite ausgeliefert — es werden keine externen Dienste (CDNs, Google Fonts, Social-Media
            -Plugins) eingebunden.
          </p>
          <p className="mb-3">
            <span className="text-bone/95">Hosting:</span> Die Seite wird über GitHub Pages
            (GitHub, Inc., USA) ausgeliefert. Beim Aufruf verarbeitet GitHub technisch notwendige
            Verbindungsdaten (z.&nbsp;B. IP-Adresse) in Server-Logs zur Bereitstellung und
            Absicherung des Dienstes. Details dazu in der{' '}
            <a
              href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/30 underline-offset-2 hover:text-bone"
            >
              GitHub Privacy Statement
            </a>
            .
          </p>
          <p className="mb-3">
            <span className="text-bone/95">KI-Hinweis (EU AI Act, Art. 50):</span> Alle
            Hintergrundbilder und -videos dieser Seite sind KI-generiert und entsprechend auf der
            Seite gekennzeichnet.
          </p>
          <p className="text-bone/60">
            English summary: this static site sets no cookies, runs no tracking or analytics, and
            collects no personal data itself. It is hosted on GitHub Pages, which processes
            technically necessary connection data (e.g. IP addresses) in server logs. All
            background images and videos are AI-generated and labelled as such.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
