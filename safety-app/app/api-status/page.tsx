"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ApiKeyChecker } from "@/components/api-key-checker"
import { ApiSetupGuide } from "@/components/api-setup-guide"
import { EnvSetupInstructions } from "@/components/env-setup-instructions"

export default function ApiStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold">API Configuration</h1>
              <p className="text-xs text-gray-600">Google Maps API Setup & Status</p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Google Maps API Configuration</h2>
            <p className="text-gray-600">
              Check your API key status and follow the setup guide to enable full interactive maps.
            </p>
          </div>

          {/* API Key Status */}
          <ApiKeyChecker />

          {/* Environment Setup Instructions */}
          <EnvSetupInstructions />

          {/* Setup Guide */}
          <ApiSetupGuide />

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
              <CardDescription>Common issues and solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">API Key Not Working?</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-2">
                    <li>Make sure you've enabled the Maps JavaScript API</li>
                    <li>Check that billing is enabled in Google Cloud Console</li>
                    <li>Verify API key restrictions match your domain</li>
                    <li>Restart your development server after adding the key</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm">Still Getting Errors?</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-2">
                    <li>Check the browser console for detailed error messages</li>
                    <li>Ensure your .env.local file is in the project root directory</li>
                    <li>Verify the environment variable name is exactly: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</li>
                    <li>Try creating a new API key if the current one isn't working</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm">Demo Mode Features</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-2">
                    <li>Crime zone detection still works without API key</li>
                    <li>Safety alerts and emergency features are fully functional</li>
                    <li>Visual crime data representation using fallback map</li>
                    <li>All core safety features available in demo mode</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
