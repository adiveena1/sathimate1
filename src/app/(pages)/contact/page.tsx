'use client';

import { ArrowRight, Mail, MapPin, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-muted-foreground">support@sathimate.in</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-primary/10 rounded-lg mt-0.5">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-sm text-muted-foreground">India</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-primary/10 rounded-lg mt-0.5">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Support</h3>
                  <p className="text-sm text-muted-foreground">Response time: 24-48 hours</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="pt-6 border-t border-border space-y-3">
              <p className="font-semibold text-sm">Other ways to connect:</p>
              <div className="space-y-2">
                <Link href="https://t.me/Sathimate" target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:underline">
                  → Telegram Community
                </Link>
                <Link href="https://www.instagram.com/sathimate.in/" target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:underline">
                  → Instagram
                </Link>
                <Link href="https://www.reddit.com/r/sathimate/" target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:underline">
                  → Reddit Community
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      type="text"
                      placeholder="John"
                      className="bg-background border-muted-foreground/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      type="text"
                      placeholder="Doe"
                      className="bg-background border-muted-foreground/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="bg-background border-muted-foreground/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    type="text"
                    placeholder="How can we help?"
                    className="bg-background border-muted-foreground/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="bg-background border-muted-foreground/20 resize-none"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1"
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground">
                    I agree to be contacted by Sathimate and have read the{' '}
                    <Link href="/privacy-policy" className="text-primary hover:underline">
                      privacy policy
                    </Link>
                  </label>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold" size="lg">
                  Send Message
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-6">
                We typically respond within 24-48 hours. Thank you for reaching out!
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-12 border-t border-border space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">How do I create an account?</h3>
                <p className="text-sm text-muted-foreground">
                  Sign up on our platform using your email or social media account. Complete your profile with your travel preferences to get started.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Is it safe to use Sathimate?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! We prioritize safety and trust. All users go through verification, and we have comprehensive safety guidelines in place.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">How do I find travel partners?</h3>
                <p className="text-sm text-muted-foreground">
                  Browse our community, filter by travel dates and preferences, and connect with travelers heading the same way.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">What if I have a safety concern?</h3>
                <p className="text-sm text-muted-foreground">
                  Please contact our support team immediately at support@sathimate.in or use the report feature in the app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
