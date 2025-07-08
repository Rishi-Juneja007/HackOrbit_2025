"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Copy, FileText, AlertTriangle } from "lucide-react"
import { useState } from "react"

export function EnvSetupInstructions() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepNumber)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Environment Variables Setup
        </CardTitle>
        <CardDescription>Step-by-step guide to add your Google Maps API key</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Important:</strong> The API key must be in a <code>.env.local</code> file, not{" "}
            <code>.env.example</code>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex gap-4 p-4 border rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-600">1</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold">Create .env.local file</h3>
                <p className="text-sm text-gray-600">
                  Create a new file called <code>.env.local</code> in your project root directory (same level as
                  package.json)
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                <div className="text-gray-600 mb-2"># File: .env.local</div>
                <div className="text-gray-400"># Add this line to your .env.local file:</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-4 border rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-600">2</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold">Add your API key</h3>
                <p className="text-sm text-gray-600">
                  Copy this line and replace "your_actual_api_key_here" with your real Google Maps API key
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm relative">
                <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here</code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-2 h-6 w-6 p-0"
                  onClick={() => copyToClipboard("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here", 2)}
                >
                  {copiedStep === 2 ? <CheckCircle className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-4 border rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-600">3</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold">Restart development server</h3>
                <p className="text-sm text-gray-600">
                  Stop your development server (Ctrl+C) and restart it to load the new environment variables
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm relative">
                <code>npm run dev</code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-2 h-6 w-6 p-0"
                  onClick={() => copyToClipboard("npm run dev", 3)}
                >
                  {copiedStep === 3 ? <CheckCircle className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-2">
              <p>
                <strong>File Structure Should Look Like:</strong>
              </p>
              <div className="font-mono text-sm bg-white p-2 rounded border">
                <div>my-project/</div>
                <div>├── .env.local ← Your API key goes here</div>
                <div>├── .env.example ← Template file (don't put real keys here)</div>
                <div>├── package.json</div>
                <div>├── next.config.js</div>
                <div>└── ...</div>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="space-y-2">
              <p>
                <strong>Common Mistakes:</strong>
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                <li>Putting the API key in .env.example instead of .env.local</li>
                <li>Forgetting to restart the development server</li>
                <li>Missing the NEXT_PUBLIC_ prefix</li>
                <li>Adding quotes around the API key (don't use quotes)</li>
                <li>Spaces around the = sign (should be no spaces)</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            After following these steps, refresh this page to check if your API key is detected.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
