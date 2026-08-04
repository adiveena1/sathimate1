import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Sathimate',
  description: 'Learn how Sathimate protects your data and privacy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">Last updated: March 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sathimate ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Personal Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Name, email address, and phone number</li>
                  <li>Profile information including age, location, and bio</li>
                  <li>Travel preferences and group details</li>
                  <li>Payment information (processed securely)</li>
                  <li>Communication with our support team</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>IP address and browser information</li>
                  <li>Pages visited and time spent</li>
                  <li>Device type and operating system</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Provide, maintain, and improve our services</li>
              <li>Match you with compatible travel partners</li>
              <li>Communicate with you about your account</li>
              <li>Send promotional emails and updates (with your consent)</li>
              <li>Enhance security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your personal information. Your data is encrypted in transit and at rest using SSL/TLS protocols. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
              <li>Service providers who assist in operating our website</li>
              <li>Law enforcement when legally required</li>
              <li>Your consent for specific purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-semibold">Sathimate Support Team</p>
              <p className="text-muted-foreground">Email: privacy@sathimate.in</p>
              <p className="text-muted-foreground">Website: sathimate.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
