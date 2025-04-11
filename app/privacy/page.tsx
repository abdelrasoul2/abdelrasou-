"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"
import { AdUnit } from "@/components/ad-unit"

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          {/* Ad Unit at the top of the content */}
          <div className="mb-8">
            <AdUnit
              slot="5678901234"
              className="mx-auto h-[250px] bg-muted/20 flex items-center justify-center rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to TypingMaster. We respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you about how we look after your personal data when you visit our
                website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. The Data We Collect</h2>
              <p className="text-muted-foreground">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped
                together as follows:
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground">
                <li>Identity Data: includes username, email address</li>
                <li>
                  Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting
                  and location, browser plug-in types and versions, operating system and platform
                </li>
                <li>Usage Data: includes information about how you use our website and services</li>
                <li>Performance Data: includes typing speed, accuracy, and game statistics</li>
              </ul>
            </section>

            {/* Ad Unit in the middle of the content */}
            <div className="my-8">
              <AdUnit
                slot="6789012345"
                className="mx-auto h-[250px] bg-muted/20 flex items-center justify-center rounded-lg"
              />
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
              <p className="text-muted-foreground">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal
                data in the following circumstances:
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground">
                <li>To register you as a new user</li>
                <li>To provide and improve our services</li>
                <li>To track your progress and performance</li>
                <li>To personalize your experience</li>
                <li>To communicate with you</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track the activity on our service and hold certain
                information. Cookies are files with a small amount of data which may include an anonymous unique
                identifier.
              </p>
              <p className="text-muted-foreground mt-2">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
              <p className="text-muted-foreground">
                We may employ third-party companies and individuals due to the following reasons:
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground">
                <li>To facilitate our service</li>
                <li>To provide the service on our behalf</li>
                <li>To perform service-related services</li>
                <li>To assist us in analyzing how our service is used</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                We want to inform users of this service that these third parties have access to your personal
                information. The reason is to perform the tasks assigned to them on our behalf. However, they are
                obligated not to disclose or use the information for any other purpose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Google AdSense</h2>
              <p className="text-muted-foreground">
                We use Google AdSense to display advertisements on our website. Google AdSense may use cookies and web
                beacons to collect data about your visits to this and other websites in order to provide relevant
                advertisements about goods and services that may interest you.
              </p>
              <p className="text-muted-foreground mt-2">
                Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our
                site and/or other sites on the Internet. You may opt out of personalized advertising by visiting
                <a href="https://www.google.com/settings/ads" className="text-orange-500 hover:underline">
                  {" "}
                  Google Ads Settings
                </a>
                .
              </p>
            </section>

            {/* Ad Unit at the bottom of the content */}
            <div className="my-8">
              <AdUnit
                slot="7890123456"
                className="mx-auto h-[250px] bg-muted/20 flex items-center justify-center rounded-lg"
              />
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Security</h2>
              <p className="text-muted-foreground">
                We value your trust in providing us your personal information, thus we are striving to use commercially
                acceptable means of protecting it. But remember that no method of transmission over the internet, or
                method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. Thus, you are advised to review this page
                periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on
                this page. These changes are effective immediately after they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at
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
