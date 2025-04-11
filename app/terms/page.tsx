"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"

export default function TermsOfServicePage() {
  const { t, dir } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen" dir={dir}>
      <div className="container py-6 flex-1">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1 hover:text-orange-500">
              <ArrowLeft className="h-4 w-4" />
              {t("home")}
            </Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to TypingMaster. These Terms of Service govern your use of our website and services. By
                accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of
                the terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Accounts</h2>
              <p className="text-muted-foreground">
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
                termination of your account on our service.
              </p>
              <p className="text-muted-foreground mt-2">
                You are responsible for safeguarding the password that you use to access the service and for any
                activities or actions under your password. You agree not to disclose your password to any third party.
                You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your
                account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The service and its original content, features, and functionality are and will remain the exclusive
                property of TypingMaster and its licensors. The service is protected by copyright, trademark, and other
                laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in
                connection with any product or service without the prior written consent of TypingMaster.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Content</h2>
              <p className="text-muted-foreground">
                Our service allows you to post, link, store, share and otherwise make available certain information,
                text, graphics, videos, or other material. You are responsible for the content that you post to the
                service, including its legality, reliability, and appropriateness.
              </p>
              <p className="text-muted-foreground mt-2">
                By posting content to the service, you grant us the right to use, modify, publicly perform, publicly
                display, reproduce, and distribute such content on and through the service. You retain any and all of
                your rights to any content you submit, post or display on or through the service and you are responsible
                for protecting those rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Advertisements</h2>
              <p className="text-muted-foreground">
                We use Google AdSense to display advertisements on our website. These advertisements may be targeted
                based on the content of the pages you visit, your previous visits to our website, or your visits to
                other websites.
              </p>
              <p className="text-muted-foreground mt-2">
                We are not responsible for the content of these advertisements, and your interaction with any
                advertisements or third-party websites is subject to the terms and privacy policies of those third
                parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Links To Other Web Sites</h2>
              <p className="text-muted-foreground">
                Our service may contain links to third-party web sites or services that are not owned or controlled by
                TypingMaster.
              </p>
              <p className="text-muted-foreground mt-2">
                TypingMaster has no control over, and assumes no responsibility for, the content, privacy policies, or
                practices of any third party web sites or services. You further acknowledge and agree that TypingMaster
                shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to
                be caused by or in connection with use of or reliance on any such content, goods or services available
                on or through any such web sites or services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-muted-foreground mt-2">
                Upon termination, your right to use the service will immediately cease. If you wish to terminate your
                account, you may simply discontinue using the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation Of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall TypingMaster, nor its directors, employees, partners, agents, suppliers, or
                affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from your access to or use of or inability to access or use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes</h2>
              <p className="text-muted-foreground">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material we will try to provide at least 30 days notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p className="text-muted-foreground mt-2">
                By continuing to access or use our service after those revisions become effective, you agree to be bound
                by the revised terms. If you do not agree to the new terms, please stop using the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at
                <a href="mailto:contact@typingmaster.com" className="text-orange-500 hover:underline">
                  {" "}
                  contact@typingmaster.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
