import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | Sathimate',
  description: 'Read our terms and conditions for using Sathimate',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold">Terms and Conditions</h1>
          <p className="text-lg text-muted-foreground">Last updated: March 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Sathimate ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Use License</h2>
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to temporarily download one copy of the materials (information or software) on Sathimate for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the site</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on Sathimate are provided on an 'as is' basis. Sathimate makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Sathimate or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sathimate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Accuracy of Materials</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials appearing on Sathimate could include technical, typographical, or photographic errors. Sathimate does not warrant that any of the materials on the website are accurate, complete, or current. Sathimate may make changes to the materials contained on the website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sathimate has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Sathimate of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              Users agree not to use Sathimate for any unlawful purpose or in any way that could damage, disable, overburden, or impair the service. Users also agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
              <li>Harass, threaten, or abuse other users</li>
              <li>Post offensive, defamatory, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Engage in any form of fraud or deception</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sathimate may revise these terms and conditions for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-semibold">Sathimate Support Team</p>
              <p className="text-muted-foreground">Email: support@sathimate.in</p>
              <p className="text-muted-foreground">Website: sathimate.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
