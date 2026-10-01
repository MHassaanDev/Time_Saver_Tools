import React from 'react'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import { useSEO } from '../lib/useSEO.js'
import { SITE } from '../config/site.js'

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export default function Terms() {
  useSEO({ title: 'Terms of Service', description: `Terms of service for ${SITE.name}.`, canonicalPath: '/terms' })
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms' }]} />
      <h1 className="text-3xl font-extrabold mb-1">Terms of Service</h1>
      <p className="text-xs text-ink-400 mb-8">
        This is a plain-language document, not reviewed legal counsel language — see the note at the bottom.
      </p>

      <div className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
        <Section title="Acceptance of terms">
          <p>
            By using {SITE.name} (the "Site"), you agree to these Terms of Service. If you don't agree,
            please don't use the Site.
          </p>
        </Section>

        <Section title="Use of the Site">
          <p>
            The Site provides free, browser-based tools. You may use them for personal or commercial
            purposes without creating an account, subject to these Terms and the Privacy Policy.
          </p>
        </Section>

        <Section title="Tool usage and your responsibility">
          <p>
            You're responsible for the content you paste, type, or upload into any tool, and for how you
            use the output. Always verify results you plan to rely on (a generated hash, a decoded
            token, formatted code, a converted value) before using it in anything important, sensitive,
            or production-facing — tools can have bugs, and this Site makes no guarantee of perfect
            accuracy for every possible input.
          </p>
        </Section>

        <Section title="Prohibited use">
          <p>You agree not to use the Site to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Process content you don't have the legal right to handle;</li>
            <li>Violate any applicable law or regulation;</li>
            <li>Attempt to disrupt, overload, or gain unauthorized access to the Site or its infrastructure;</li>
            <li>Circumvent, disable, or interfere with the Site's security-related features, including the sandboxing used by the HTML/CSS/JS Playground.</li>
          </ul>
        </Section>

        <Section title="Intellectual property">
          <p>
            The Site's design, branding, original code, and content are owned by {SITE.name} or its
            operator, except where noted otherwise. Content you create using the tools (for example,
            code you write in the Playground, or a CV you build with a future tool) remains yours.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            The Site may use third-party services (such as analytics, web fonts, and, where enabled,
            advertising networks like Google AdSense) that have their own terms and privacy practices —
            see the Privacy Policy for details. We aren't responsible for third-party services' own
            conduct or content.
          </p>
        </Section>

        <Section title="Availability">
          <p>
            We aim to keep the Site available and fast, but don't guarantee uninterrupted access. The
            Site, individual tools, or features may be modified, suspended, or discontinued at any time,
            with or without notice.
          </p>
        </Section>

        <Section title="Accuracy and \u201cas is\u201d basis">
          <p>
            Tools are provided for convenience and are not a substitute for professional judgment where
            one is warranted (for example: security-sensitive hashing/encoding decisions, legal
            documents, or financial calculations). The Site is provided "as is" and "as available,"
            without warranties of any kind, express or implied, including but not limited to accuracy,
            merchantability, or fitness for a particular purpose.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, {SITE.name} and its operator won't be liable for any
            indirect, incidental, special, or consequential damages arising from your use of, or
            inability to use, the Site or its tools — including data loss, lost profits, or reliance on
            inaccurate tool output.
          </p>
        </Section>

        <Section title="Changes to the Site and these Terms">
          <p>
            We may update the Site's features and these Terms over time (for example, as new tools or
            categories are added). Continued use of the Site after changes take effect means you accept
            the updated Terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these Terms:{' '}
            <a href={`mailto:${SITE.contactEmail}`} className="text-brand-600 dark:text-brand-400 hover:underline">
              {SITE.contactEmail}
            </a>.
          </p>
        </Section>

        <p className="text-xs text-ink-400 pt-4 border-t border-ink-200 dark:border-ink-800">
          This page is plain-language boilerplate appropriate for a small tools website and hasn't been
          reviewed by a lawyer. It's not a substitute for professional legal review — consider having it
          reviewed once the Site has real traffic, advertising revenue, or a registered business behind
          it.
        </p>
      </div>
    </div>
  )
}
