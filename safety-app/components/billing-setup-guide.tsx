"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, CheckCircle, CreditCard, AlertTriangle } from "lucide-react"

export function BillingSetupGuide() {
  const steps = [
    {
      title: "Go to Google Cloud Console",
      description: "Access your Google Cloud project",
      action: "Open Console",
      link: "https://console.cloud.google.com/",
      code: null,
    },
    {
      title: "Navigate to Billing",
      description: "Go to the Billing section",
      action: "Open Billing",
      link: "https://console.cloud.google.com/billing",
      code: null,
    },
    {
      title: "Link Billing Account",
      description: "Link a billing account to your project",
      action: "Enable Billing",
      link: "https://console.cloud.google.com/billing/linkedaccount",
      code: null,
    },
    {
      title: "Verify APIs are Enabled",
      description: "Ensure Maps JavaScript API is enabled",
      action: "Check APIs",
      link: "https://console.cloud.google.com/apis/library",
      code: null,
    },
    {
      title: "Test Your Setup",
      description: "Refresh the dashboard to test Google Maps",
      action: "Refresh Page",
      link: null,
      code: "window.location.reload()",
    },
  ]

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Google Cloud Billing Setup
        </CardTitle>
        <CardDescription>Enable billing to use Google Maps with full interactive features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="space-y-2">
              <p>
                <strong>Good News:</strong> Google provides $200 in free credits every month!
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                <li>$200 monthly credit covers ~28,000 map loads</li>
                <li>Most personal projects stay within free tier</li>
                <li>No charges until you exceed the free quota</li>
                <li>You can set spending limits to avoid unexpected charges</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">{index + 1}</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {step.link && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={step.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      {step.action}
                    </a>
                  </Button>
                )}

                {step.code && !step.link && <Badge variant="secondary">{step.action}</Badge>}
              </div>
            </div>
          ))}
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-2">
              <p>
                <strong>What happens after enabling billing:</strong>
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                <li>Google Maps will load with full interactive features</li>
                <li>Real-time heatmaps will display crime data</li>
                <li>Satellite view and street view will be available</li>
                <li>All safety features will work at full capacity</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="space-y-2">
              <p>
                <strong>Important:</strong> The SafeTravel app works fully without Google Maps billing enabled.
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                <li>All safety features (zone detection, alerts) work in demo mode</li>
                <li>Crime data analysis is fully functional</li>
                <li>Emergency contacts and alerts work normally</li>
                <li>Only the interactive map visualization requires billing</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Need help? Check the{" "}
            <a
              href="https://cloud.google.com/billing/docs/how-to/modify-project"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              official Google Cloud billing documentation
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
