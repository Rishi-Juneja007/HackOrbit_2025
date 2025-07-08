"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle, Shield, Navigation } from "lucide-react"

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [crimeData, setCrimeData] = useState<Array<{ lat: number; lng: number; severity: number }>>([])

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Location access denied:", error)
          // Use default location (NYC) for demo
          setUserLocation({ lat: 40.7589, lng: -73.9851 })
        },
      )
    }

    // Simulate crime data loading
    setCrimeData([
      { lat: 40.7589, lng: -73.9851, severity: 5 }, // Times Square - High
      { lat: 40.7614, lng: -73.9776, severity: 4 }, // Midtown - High
      { lat: 40.7282, lng: -73.7949, severity: 2 }, // Queens - Medium
      { lat: 40.6782, lng: -73.9442, severity: 1 }, // Brooklyn - Low
    ])
  }, [])

  const getDangerLevel = (lat: number, lng: number) => {
    if (!userLocation) return "unknown"

    // Calculate distance to high-crime areas
    const highCrimeAreas = crimeData.filter((crime) => crime.severity >= 4)
    const mediumCrimeAreas = crimeData.filter((crime) => crime.severity >= 2 && crime.severity < 4)

    for (const crime of highCrimeAreas) {
      const distance = Math.sqrt(Math.pow(lat - crime.lat, 2) + Math.pow(lng - crime.lng, 2))
      if (distance < 0.01) return "danger" // Within ~1km
    }

    for (const crime of mediumCrimeAreas) {
      const distance = Math.sqrt(Math.pow(lat - crime.lat, 2) + Math.pow(lng - crime.lng, 2))
      if (distance < 0.02) return "warning" // Within ~2km
    }

    return "safe"
  }

  const currentDangerLevel = userLocation ? getDangerLevel(userLocation.lat, userLocation.lng) : "unknown"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Safety Heatmap</h1>
          <p className="text-gray-600">Real-time crime data visualization and location monitoring</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userLocation ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Lat: {userLocation.lat.toFixed(4)}</p>
                    <p className="text-sm text-gray-600">Lng: {userLocation.lng.toFixed(4)}</p>
                    <Badge
                      className={
                        currentDangerLevel === "danger"
                          ? "bg-red-500"
                          : currentDangerLevel === "warning"
                            ? "bg-yellow-500"
                            : currentDangerLevel === "safe"
                              ? "bg-green-500"
                              : "bg-gray-500"
                      }
                    >
                      {currentDangerLevel === "danger"
                        ? "Danger Zone"
                        : currentDangerLevel === "warning"
                          ? "Caution Zone"
                          : currentDangerLevel === "safe"
                            ? "Safe Zone"
                            : "Unknown"}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Locating...</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm">High Crime Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Medium Crime Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Low Crime Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Your Location</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crime Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Incidents</span>
                  <span className="font-semibold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Against Women</span>
                  <span className="font-semibold text-red-600">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">This Month</span>
                  <span className="font-semibold">23</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Map */}
          <div className="lg:col-span-3">
            <Card className="h-[700px]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Interactive Safety Map</span>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Recenter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full p-0">
                <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
                  {/* Simulated Google Maps Interface */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
                    {/* Crime Heat Zones */}
                    {crimeData.map((crime, index) => (
                      <div
                        key={index}
                        className={`absolute w-16 h-16 rounded-full opacity-60 ${
                          crime.severity >= 4 ? "bg-red-500" : crime.severity >= 2 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{
                          left: `${20 + index * 15}%`,
                          top: `${30 + index * 10}%`,
                        }}
                      />
                    ))}

                    {/* User Location */}
                    {userLocation && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                          <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            You are here
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button size="sm" variant="secondary">
                        +
                      </Button>
                      <Button size="sm" variant="secondary">
                        -
                      </Button>
                    </div>

                    {/* Map Type Toggle */}
                    <div className="absolute bottom-4 left-4">
                      <Button size="sm" variant="secondary">
                        Satellite
                      </Button>
                    </div>

                    {/* Current Danger Alert */}
                    {currentDangerLevel === "danger" && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-semibold">High Crime Area</span>
                        </div>
                        <p className="text-sm mt-1">Exercise extreme caution</p>
                      </div>
                    )}

                    {currentDangerLevel === "safe" && (
                      <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span className="font-semibold">Safe Area</span>
                        </div>
                        <p className="text-sm mt-1">Low crime rate in this area</p>
                      </div>
                    )}

                    {/* Placeholder for actual Google Maps */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold">Google Maps Integration</p>
                        <p className="text-sm">Interactive map with real crime data heatmaps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
