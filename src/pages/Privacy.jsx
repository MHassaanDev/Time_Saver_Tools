import React from 'react'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import { useSEO } from '../lib/useSEO.js'
import { TOOLS } from '../lib/toolRegistry.js'
import { SITE } from '../config/site.js'

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export default function Privacy() {
  useSEO({ title: 'Privacy Policy', description: `How ${SITE.name} handles your data.`, canonicalPath: '/privacy' })
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]} />
      <h1 className="text-3xl font-extrabold mb-1">Privacy Policy</h1>
      <p className="text-xs text-ink-400 mb-8">Last updated: see version history in the project repository.</p>

      <div className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
        <Section title="Overview">
          <p>
            {SITE.name} ("we", "us") provides free, browser-based tools at this website (the "Site").
            This policy explains what information is and isn't collected when you use the Site, and how
            it's handled. We don't require an account to use any tool on the Site.
          </p>
        </Section>

        <Section title="What tool input is — and isn't — collected">
          <p>
            Every tool listed below processes your input entirely inside your own browser using
            JavaScript. What you type, paste, or upload into these tools is not transmitted to our
            servers, not logged, and not stored by us:
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1 list-disc list-inside">
            {TOOLS.map(t => <li key={t.id}>{t.name}</li>)}
          </ul>
          <p>
            If a future tool requires sending data to a server or a third-party API to function, that
            tool's own page will say so explicitly, and this policy will be updated to describe exactly
            what's sent and why before that tool goes live.
          </p>
        </Section>

        <Section title="Automatically collected technical information">
          <p>
            Like most websites, our hosting provider and any analytics we use may automatically log
            standard technical information when you visit — such as approximate location (derived from
            IP address, not GPS), browser type, device type, referring page, and pages visited. This is
            standard web server/analytics behavior, not something specific to the tools themselves, and
            is separate from the tool-input guarantee above.
          </p>
        </Section>

        <Section title="Analytics">
          <p>
            We may use Google Analytics to understand which tools are used and how, via anonymized
            usage events (for example, "JSON formatted" or "UUID generated") — never the actual content
            you process. We never send your pasted code, generated passwords, decoded tokens, or any
            other tool input/output to analytics as event data.
          </p>
        </Section>

        <Section title="Cookies and similar technologies">
          <p>
            The Site may use cookies or similar browser storage for: remembering your theme preference
            (light/dark), analytics (see above), and, once enabled, advertising (see below). Some tools
            (like the HTML/CSS/JS Playground) use your browser's local storage to save drafts on your
            own device — this data never leaves your browser and isn't a cookie in the traditional
            sense, but is disclosed here for completeness.
          </p>
        </Section>

        <Section title="Advertising">
          <p>
            The Site is built to support Google AdSense as a monetization method. As of this policy's
            last update, advertising may not yet be active sitewide — check the current state of the
            Site for what's actually live. Once enabled, Google AdSense and its advertising partners may
            use cookies or similar technologies to show ads that are more relevant to you, and may
            collect data about your visits to this and other sites for that purpose. Where required by
            applicable law (for example, in the EEA and UK), we will request your consent before showing
            personalized ads, and will provide a way to manage or withdraw that consent.
          </p>
          <p>
            You can learn more about how Google uses data from sites that use its services at{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank" rel="noopener noreferrer"
              className="text-brand-600 dark:text-brand-400 hover:underline"
            >
              Google's Partner Sites policy
            </a>.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            Fonts are loaded from Google Fonts, which may log standard request information (such as IP
            address) as part of serving font files. We do not sell your data to third parties.
          </p>
        </Section>

        <Section title="How information is used">
          <p>
            Any technical/analytics information collected is used only to understand Site usage, fix
            problems, and (once advertising is live) support ad-based monetization. It is not used to
            build a profile tied to your identity beyond what your browser/analytics/ad-network settings
            already permit.
          </p>
        </Section>

        <Section title="Data retention">
          <p>
            We don't store tool input/output at all (see above), so there's nothing of that kind to
            retain or delete. Aggregated, anonymized analytics data may be retained for as long as is
            useful for understanding Site usage trends.
          </p>
        </Section>

        <Section title="Security">
          <p>
            The Site is served over HTTPS. Because most tools process data entirely client-side, there's
            no server-side database of your tool inputs to secure or that could be breached. Standard
            precautions are taken for the parts of the Site that do involve external services
            (analytics, fonts, and future advertising).
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Depending on where you live, you may have rights over your personal data — such as the right
            to know what's collected, to request deletion, or to opt out of certain data uses (for
            example, under GDPR in the EU/EEA, UK GDPR, or the CCPA/CPRA in California). Because this
            Site is designed to avoid collecting personal data through the tools themselves, there is
            typically very little tied to you to act on — but for any technical/analytics/advertising
            data, or to make a request, contact us at the address below and we'll respond as required by
            applicable law.
          </p>
        </Section>

        <Section title="Children's privacy">
          <p>
            The Site is not directed at children under 13 (or the relevant minimum age in your
            jurisdiction), and we do not knowingly collect personal information from children.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            This policy may be updated as the Site changes — for example, when a new tool is added, when
            advertising is enabled, or when a new analytics feature is introduced. Material changes
            (such as a tool starting to send data to a server) will be reflected here.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy or a request regarding your data:{' '}
            <a href={`mailto:${SITE.contactEmail}`} className="text-brand-600 dark:text-brand-400 hover:underline">
              {SITE.contactEmail}
            </a>.
          </p>
        </Section>
      </div>
    </div>
  )
}
