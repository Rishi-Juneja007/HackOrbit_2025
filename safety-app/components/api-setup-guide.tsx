"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, CheckCircle, Copy } from "lucide-react"
import { useState } from "react"

export function ApiSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepNumber)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const steps = [
    {
      title: "Create Google Cloud Project",
      description: "Set up a new project in Google Cloud Console",
      action: "Go to Google Cloud Console",
      link: "https://console.cloud.google.com/",
      code: null,
    },
    {
      title: "Enable Required APIs",
      description: "Enable Maps JavaScript API and Places API",
      action: "Enable APIs",
      link: "https://console.cloud.google.com/apis/library",
      code: null,
    },
    {
      title: "Create API Key",
      description: "Generate a new API key for your project",
      action: "Create Credentials",
      link: "https://console.cloud.google.com/apis/credentials",
      code: null,
    },
    {
      title: "Add Environment Variable",
      description: "Add your API key to the environment variables",
      action: "Copy to .env.local",
      link: null,
      code: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here",
    },
    {
      title: "Restart Development Server",
      description: "Restart your Next.js development server",
      action: "Run Command",
      link: null,
      code: "npm run dev",
    },
  ]

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Google Maps API Setup Guide
        </CardTitle>
        <CardDescription>Follow these steps to enable full interactive maps with crime data heatmaps</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Why Google Maps API?</strong> The API enables interactive heatmaps, real-time location tracking, and
            detailed crime data visualization across India. The app works in demo mode without it, but full features
            require the API.
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

                {step.code && (
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm relative">
                    <code>{step.code}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(step.code!, index)}
                    >
                      {copiedStep === index ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                )}

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

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Free Tier Available:</strong> Google Maps provides $200 monthly credit, which covers approximately
            28,000 map loads or 40,000 geocoding requests per month for free.
          </AlertDescription>
        </Alert>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Need help? Check the{" "}
            <a
              href="https://developers.google.com/maps/documentation/javascript/get-api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              official Google Maps documentation
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
