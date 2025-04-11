"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Keyboard, BarChart, Award, Users } from "lucide-react"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">About TypingMaster</h1>
          <p className="text-muted-foreground mb-8">Learn about our mission to improve typing skills worldwide</p>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground">
                    At TypingMaster, our mission is to help people of all ages and backgrounds improve their typing
                    skills through engaging, interactive, and educational games. We believe that typing proficiency is
                    an essential skill in today's digital world, and we're committed to making the learning process
                    enjoyable and effective.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Whether you're a student, professional, or someone looking to enhance your digital literacy, our
                    platform offers a variety of games and exercises designed to boost your typing speed, accuracy, and
                    confidence.
                  </p>
                </div>
                <div className="bg-muted/20 rounded-lg p-6 border border-orange-500/20">
                  <h3 className="font-medium mb-3 text-orange-500">Why Typing Skills Matter</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Increased productivity in school and workplace</li>
                    <li>• Reduced fatigue during computer use</li>
                    <li>• Enhanced focus on content rather than typing process</li>
                    <li>• Better communication in digital environments</li>
                    <li>• Valuable skill for nearly all modern careers</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-background">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-orange-500/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Keyboard className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Engaging Games</h3>
                    <p className="text-muted-foreground">
                      We transform typing practice into fun, interactive games that keep users motivated and engaged.
                      From bubble shooters to falling words, our diverse game selection ensures learning never feels
                      like a chore.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-orange-500/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <BarChart className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Progress Tracking</h3>
                    <p className="text-muted-foreground">
                      Our platform provides detailed statistics on your typing performance, including words per minute
                      (WPM), accuracy, and improvement over time. Visualize your progress and identify areas for
                      improvement.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-orange-500/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Achievement System</h3>
                    <p className="text-muted-foreground">
                      Earn achievements and rewards as you reach typing milestones. Our gamified approach keeps you
                      motivated and celebrates your progress, making skill development rewarding and enjoyable.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Who We Serve</h2>
              <div className="bg-muted/10 rounded-lg p-6 border border-orange-500/20">
                <div className="flex items-start mb-4">
                  <Users className="h-6 w-6 text-orange-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Our Community</h3>
                    <p className="text-muted-foreground">
                      TypingMaster serves a diverse community of users worldwide, including:
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-medium mb-2">Students</h4>
                    <p className="text-muted-foreground">
                      From elementary to university level, students use TypingMaster to develop essential typing skills
                      that enhance their academic performance and prepare them for future careers.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Professionals</h4>
                    <p className="text-muted-foreground">
                      Working professionals across various industries use our platform to improve their typing
                      efficiency, boosting productivity and reducing fatigue during computer work.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Educators</h4>
                    <p className="text-muted-foreground">
                      Teachers and educational institutions incorporate TypingMaster into their curriculum to help
                      students develop digital literacy skills in an engaging way.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Language Learners</h4>
                    <p className="text-muted-foreground">
                      With support for multiple languages including Arabic and English, our platform helps language
                      learners practice typing in different scripts and improve their language skills.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
              <p className="text-muted-foreground mb-6">
                Ready to improve your typing skills? Join thousands of users who have enhanced their typing abilities
                with TypingMaster. Our platform is accessible from any device with a keyboard, making it easy to
                practice whenever and wherever you want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/game">
                  <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
                    Try Our Games
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
