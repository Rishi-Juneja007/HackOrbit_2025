"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, AlertTriangle, Shield, RefreshCw } from "lucide-react"

interface LocationPermissionProps {
  onLocationGranted: (location: { lat: number; lng: number }) => void
  onLocationDenied: (error: string) => void
}

export function LocationPermission({ onLocationGranted, onLocationDenied }: LocationPermissionProps) {
  const [permissionState, setPermissionState] = useState<"checking" | "prompt" | "granted" | "denied">("checking")
  const [isRequesting, setIsRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkPermission = async () => {
    if ("permissions" in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" })
        setPermissionState(permission.state as any)

        permission.addEventListener("change", () => {
          setPermissionState(permission.state as any)
        })
      } catch (err) {
        console.error("Permission check failed:", err)
        setPermissionState("prompt")
      }
    } else {
      setPermissionState("prompt")
    }
  }

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by this browser"
      setError(errorMsg)
      onLocationDenied(errorMsg)
      return
    }

    setIsRequesting(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setPermissionState("granted")
        setIsRequesting(false)
        onLocationGranted(location)
      },
      (error) => {
        let errorMessage = "Unable to access location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services."
            setPermissionState("denied")
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        setError(errorMessage)
        setIsRequesting(false)
        onLocationDenied(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    )
  }

  const useDemoLocation = () => {
    // Use Times Square, NYC as demo location
    const demoLocation = { lat: 40.7589, lng: -73.9851 }
    onLocationGranted(demoLocation)
  }

  useEffect(() => {
    checkPermission()
  }, [])

  if (permissionState === "granted") {
    return null // Don't show if permission is already granted
  }

  return (
    <div className="mb-6">
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            Location Access Required
          </CardTitle>
          <CardDescription>
            SafeTravel needs your location to provide real-time safety monitoring and emergency alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={requestLocation} disabled={isRequesting} className="bg-purple-600 hover:bg-purple-700">
              {isRequesting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Requesting Access...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Enable Location Access
                </>
              )}
            </Button>

            <Button variant="outline" onClick={useDemoLocation}>
              <MapPin className="h-4 w-4 mr-2" />
              Use Demo Location
            </Button>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Why we need location access:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Monitor your safety in real-time</li>
              <li>Alert you when entering high-crime areas</li>
              <li>Send your location to emergency contacts if needed</li>
              <li>Provide accurate safety recommendations</li>
            </ul>
          </div>

          {permissionState === "denied" && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <div className="space-y-2">
                  <p>
                    <strong>Location access is blocked.</strong> To enable it:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Click the location icon in your browser's address bar</li>
                    <li>Select "Allow" for location access</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
