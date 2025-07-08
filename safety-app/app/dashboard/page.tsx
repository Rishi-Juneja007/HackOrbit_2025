"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, MapPin, AlertTriangle, Clock, Phone, Settings, LogOut, TrendingUp, CreditCard } from "lucide-react"
import { LocationPermission } from "@/components/location-permission"
import { GoogleMaps } from "@/components/google-maps"
import { BillingSetupGuide } from "@/components/billing-setup-guide"
import { ApiKeyChecker } from "@/components/api-key-checker"

export default function DashboardPage() {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [dangerZone, setDangerZone] = useState<"safe" | "warning" | "danger">("safe")
  const [timeInZone, setTimeInZone] = useState(0)
  const [isTracking, setIsTracking] = useState(false)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [crimeStats, setCrimeStats] = useState({
    totalIncidents: 0,
    againstWomen: 0,
    thisMonth: 0,
    nearbyRisk: "low" as "low" | "medium" | "high",
  })
  const [showBillingGuide, setShowBillingGuide] = useState(false)

  const handleLocationGranted = (location: { lat: number; lng: number }) => {
    setCurrentLocation(location)
    setIsTracking(true)
    setLocationPermissionGranted(true)
    setLocationError(null)

    // Load crime statistics for the area
    loadCrimeStatistics(location)
  }

  const handleLocationDenied = (error: string) => {
    setLocationError(error)
    setLocationPermissionGranted(false)
    // Use Delhi as demo location
    const demoLocation = { lat: 28.6139, lng: 77.209 }
    setCurrentLocation(demoLocation)
    loadCrimeStatistics(demoLocation)
  }

  const handleZoneChange = (zone: "danger" | "warning" | "safe") => {
    setDangerZone(zone)
    if (zone !== "danger") {
      setTimeInZone(0)
    }
  }

  const loadCrimeStatistics = (location: { lat: number; lng: number }) => {
    // Simulate loading crime statistics based on location
    // In a real app, this would be an API call to your backend
    const isHighRiskArea = location.lat > 28.5 && location.lat < 28.8 && location.lng > 77.0 && location.lng < 77.3 // Delhi area

    setCrimeStats({
      totalIncidents: isHighRiskArea ? 2847 : 1234,
      againstWomen: isHighRiskArea ? 1856 : 789,
      thisMonth: isHighRiskArea ? 89 : 34,
      nearbyRisk: isHighRiskArea ? "high" : "medium",
    })
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (dangerZone === "danger" && isTracking) {
      interval = setInterval(() => {
        setTimeInZone((prev) => {
          const newTime = prev + 1
          if (newTime >= 300) {
            // 5 minutes
            triggerEmergencyAlert()
          }
          return newTime
        })
      }, 1000)
    } else {
      setTimeInZone(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [dangerZone, isTracking])

  const triggerEmergencyAlert = () => {
    // In a real app, this would send SMS/call to emergency contacts
    alert(
      "🚨 EMERGENCY ALERT: You've been in a danger zone for 5+ minutes. Emergency contacts have been notified with your location!",
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "safe":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "danger":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getZoneText = (zone: string) => {
    switch (zone) {
      case "safe":
        return "Safe Zone"
      case "warning":
        return "Caution Zone"
      case "danger":
        return "Danger Zone"
      default:
        return "Unknown"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold">SafeTravel India</h1>
              <p className="text-xs text-gray-600">Women Safety Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Location Permission Component */}
        {!locationPermissionGranted && (
          <LocationPermission onLocationGranted={handleLocationGranted} onLocationDenied={handleLocationDenied} />
        )}

        {/* Billing Setup Guide */}
        {showBillingGuide && (
          <div className="mb-6">
            <BillingSetupGuide />
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => setShowBillingGuide(false)}>
                Continue with Demo Mode
              </Button>
            </div>
          </div>
        )}

        {/* Billing Error Alert */}
        {!showBillingGuide && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <CreditCard className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 flex items-center justify-between">
              <div>
                <p className="font-semibold">Google Maps billing not enabled</p>
                <p className="text-sm">App running in demo mode with full safety features</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowBillingGuide(true)}>
                Enable Billing
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Status Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Location Access</span>
                    <Badge variant={locationPermissionGranted ? "default" : "secondary"}>
                      {locationPermissionGranted ? "Granted" : "Demo Mode"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Location Tracking</span>
                    <Badge variant={isTracking ? "default" : "secondary"}>{isTracking ? "Active" : "Inactive"}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Current Zone</span>
                    <Badge className={`${getZoneColor(dangerZone)} text-white`}>{getZoneText(dangerZone)}</Badge>
                  </div>

                  {dangerZone === "danger" && (
                    <div className="flex items-center justify-between">
                      <span>Time in Danger Zone</span>
                      <Badge variant="destructive">{formatTime(timeInZone)}</Badge>
                    </div>
                  )}

                  {currentLocation && (
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      <p>Lat: {currentLocation.lat.toFixed(4)}</p>
                      <p>Lng: {currentLocation.lng.toFixed(4)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* API Key Status */}
            <ApiKeyChecker />

            {/* Crime Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Area Crime Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Incidents (2023)</span>
                  <span className="font-semibold">{crimeStats.totalIncidents.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Against Women</span>
                  <span className="font-semibold text-red-600">{crimeStats.againstWomen.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">This Month</span>
                  <span className="font-semibold">{crimeStats.thisMonth}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm">Area Risk Level</span>
                  <span className={`font-semibold capitalize ${getRiskColor(crimeStats.nearbyRisk)}`}>
                    {crimeStats.nearbyRisk}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">RishiJuneja</p>
                      <p className="text-sm text-gray-600">+91 98765 43210</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Women Helpline</p>
                      <p className="text-sm text-gray-600">1091</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Add Contact
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Alert
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Share Location
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Report Incident
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Google Maps */}
          <div className="lg:col-span-2">
            <GoogleMaps userLocation={currentLocation} onZoneChange={handleZoneChange} />
          </div>
        </div>

        {/* Alerts */}
        {dangerZone === "danger" && (
          <Alert className="mt-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>⚠️ HIGH RISK AREA:</strong> You are currently in an area with high crime rates against women.
              {timeInZone > 240 && ` Emergency contacts will be notified in ${300 - timeInZone} seconds.`}
              <br />
              <span className="text-sm mt-1 block">
                Stay alert, avoid isolated areas, and consider moving to a safer location.
              </span>
            </AlertDescription>
          </Alert>
        )}

        {dangerZone === "warning" && (
          <Alert className="mt-6 border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>⚠️ CAUTION:</strong> You are in an area with moderate crime rates. Stay vigilant and avoid
              traveling alone after dark.
            </AlertDescription>
          </Alert>
        )}

        {dangerZone === "safe" && (
          <Alert className="mt-6 border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>✅ SAFE AREA:</strong> You are currently in a relatively safe area with low crime rates.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
