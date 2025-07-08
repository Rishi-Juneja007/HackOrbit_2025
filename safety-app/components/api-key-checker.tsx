"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, RefreshCw } from "lucide-react"

export function ApiKeyChecker() {
  const [apiKeyStatus, setApiKeyStatus] = useState<{
    exists: boolean
    isValid: boolean
    isDefault: boolean
    maskedKey: string
    error: string | null
  }>({
    exists: false,
    isValid: false,
    isDefault: false,
    maskedKey: "",
    error: null,
  })
  const [showFullKey, setShowFullKey] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const checkApiKey = async () => {
    setIsChecking(true)

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

      // Check if API key exists
      if (!apiKey) {
        setApiKeyStatus({
          exists: false,
          isValid: false,
          isDefault: false,
          maskedKey: "",
          error:
            "API key not found. Create .env.local file in project root with NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here",
        })
        setIsChecking(false)
        return
      }

      // Check if it's the default placeholder
      const isDefault = apiKey === "your_google_maps_api_key_here" || apiKey === "your_actual_api_key_here"

      // Mask the API key for display
      const maskedKey =
        apiKey.length > 8
          ? `${apiKey.substring(0, 8)}${"*".repeat(apiKey.length - 12)}${apiKey.substring(apiKey.length - 4)}`
          : "*".repeat(apiKey.length)

      if (isDefault) {
        setApiKeyStatus({
          exists: true,
          isValid: false,
          isDefault: true,
          maskedKey,
          error: "Using default placeholder API key",
        })
        setIsChecking(false)
        return
      }

      // Test API key validity by making a simple request
      try {
        const testResponse = await fetch(
          `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&callback=testCallback`,
          { method: "HEAD" },
        )

        setApiKeyStatus({
          exists: true,
          isValid: !testResponse.url.includes("error"),
          isDefault: false,
          maskedKey,
          error: testResponse.url.includes("error") ? "API key may be invalid or restricted" : null,
        })
      } catch (error) {
        // If we can't test the key, assume it exists but validity is unknown
        setApiKeyStatus({
          exists: true,
          isValid: false,
          isDefault: false,
          maskedKey,
          error: "Unable to validate API key - check browser console for errors",
        })
      }
    } catch (error) {
      setApiKeyStatus({
        exists: false,
        isValid: false,
        isDefault: false,
        maskedKey: "",
        error: "Error checking API key status",
      })
    }

    setIsChecking(false)
  }

  useEffect(() => {
    checkApiKey()
  }, [])

  const getStatusIcon = () => {
    if (!apiKeyStatus.exists) {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
    if (apiKeyStatus.isDefault) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
    if (apiKeyStatus.isValid) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }

  const getStatusText = () => {
    if (!apiKeyStatus.exists) return "Not Found"
    if (apiKeyStatus.isDefault) return "Default Placeholder"
    if (apiKeyStatus.isValid) return "Valid"
    return "Needs Validation"
  }

  const getStatusColor = () => {
    if (!apiKeyStatus.exists) return "destructive"
    if (apiKeyStatus.isDefault) return "secondary"
    if (apiKeyStatus.isValid) return "default"
    return "secondary"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Google Maps API Key Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={getStatusColor() as any}>{getStatusText()}</Badge>
        </div>

        {apiKeyStatus.exists && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Key:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {showFullKey ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : apiKeyStatus.maskedKey}
                </code>
                <Button size="sm" variant="ghost" onClick={() => setShowFullKey(!showFullKey)} className="h-6 w-6 p-0">
                  {showFullKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Length:</span>
              <span className="text-sm text-gray-600">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.length || 0} characters
              </span>
            </div>
          </div>
        )}

        {apiKeyStatus.error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{apiKeyStatus.error}</AlertDescription>
          </Alert>
        )}

        {!apiKeyStatus.exists && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="space-y-2">
                <p>
                  <strong>API Key Not Found</strong>
                </p>
                <p className="text-sm">To add your Google Maps API key:</p>
                <ol className="text-sm list-decimal list-inside space-y-1 ml-2">
                  <li>
                    Create a <code>.env.local</code> file in your project root
                  </li>
                  <li>
                    Add: <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_key_here</code>
                  </li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {apiKeyStatus.isDefault && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="space-y-2">
                <p>
                  <strong>Using Placeholder API Key</strong>
                </p>
                <p className="text-sm">Replace the placeholder with your actual Google Maps API key:</p>
                <ol className="text-sm list-decimal list-inside space-y-1 ml-2">
                  <li>Get your API key from Google Cloud Console</li>
                  <li>
                    Update your <code>.env.local</code> file
                  </li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {apiKeyStatus.exists && !apiKeyStatus.isDefault && !apiKeyStatus.isValid && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="space-y-2">
                <p>
                  <strong>API Key Validation Issues</strong>
                </p>
                <p className="text-sm">Common issues to check:</p>
                <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                  <li>Ensure Maps JavaScript API is enabled</li>
                  <li>Check API key restrictions (HTTP referrers)</li>
                  <li>Verify billing is enabled in Google Cloud</li>
                  <li>Check browser console for detailed errors</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {apiKeyStatus.exists && !apiKeyStatus.isDefault && apiKeyStatus.isValid && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>✅ API Key is properly configured!</strong> Google Maps should load successfully.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={checkApiKey} disabled={isChecking}>
            {isChecking ? (
              <>
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-2" />
                Recheck
              </>
            )}
          </Button>

          {!apiKeyStatus.exists && (
            <Button size="sm" asChild>
              <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">
                Get API Key
              </a>
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Environment Variable:</strong> NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </p>
          <p>
            <strong>Required APIs:</strong> Maps JavaScript API, Places API (optional)
          </p>
          <p>
            <strong>File Location:</strong> .env.local (in project root)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
