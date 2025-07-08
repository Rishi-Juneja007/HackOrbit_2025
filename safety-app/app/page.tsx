import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, MapPin, AlertTriangle, Users, Clock, Phone } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900">SafeTravel by Vibe Coders</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Real-Time Danger Detection for <span className="text-purple-600">Women Travelers</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Stay safe with intelligent location monitoring, crime data analysis, and automatic emergency alerts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Start Protecting Yourself
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How SafeTravel Protects You</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Real-Time Location Tracking</CardTitle>
                <CardDescription>Continuous GPS monitoring with intelligent zone detection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced location services track your movement and identify when you enter high-risk areas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
                <CardTitle>Crime Data Heatmaps</CardTitle>
                <CardDescription>Visual danger zones based on historical crime data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Red and green zones show crime statistics against women, helping you avoid dangerous areas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-orange-500 mb-2" />
                <CardTitle>Smart Time Monitoring</CardTitle>
                <CardDescription>Automatic alerts after 5 minutes in danger zones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  If you remain in a red zone for over 5 minutes, emergency contacts are automatically notified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-10 w-10 text-green-500 mb-2" />
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>Instant alerts to your trusted contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your location and status are shared with emergency contacts when danger is detected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-500 mb-2" />
                <CardTitle>Community Safety</CardTitle>
                <CardDescription>Crowdsourced safety information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real-time updates from other users help maintain accurate safety information
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Privacy Protected</CardTitle>
                <CardDescription>Your data is encrypted and secure</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Location data is encrypted and only shared during emergencies with your consent
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Travel Safely?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of women who trust SafeTravel for their security</p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Create Your Account Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="font-bold">SafeTravel by Vibe Coders</span>
          </div>
          <p className="text-gray-400">© 2025 SafeTravel by Vibe Coders. Protecting women travelers worldwide.</p>
        </div>
      </footer>
    </div>
  )
}
