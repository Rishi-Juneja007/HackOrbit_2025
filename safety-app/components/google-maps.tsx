"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Layers, Navigation, MapPin, ExternalLink, CreditCard } from "lucide-react"

interface CrimeDataPoint {
  lat: number
  lng: number
  state: string
  district: string
  totalCases: number
  avgCrimeRate: number
  maxSeverity: number
  zoneType: "danger" | "warning" | "safe"
}

interface GoogleMapsProps {
  userLocation: { lat: number; lng: number } | null
  onZoneChange: (zone: "danger" | "warning" | "safe") => void
}

export function GoogleMaps({ userLocation, onZoneChange }: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [billingError, setBillingError] = useState(false)
  const [crimeData, setCrimeData] = useState<CrimeDataPoint[]>([])
  const [currentZone, setCurrentZone] = useState<"danger" | "warning" | "safe">("safe")
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap")

  // Check if API key is available
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey === "your_google_maps_api_key_here" || apiKey === "your_actual_api_key_here") {
      setHasApiKey(false)
      setApiError("Google Maps API key not configured")
      loadCrimeDataAndDetermineZone()
    } else {
      setHasApiKey(true)
      loadGoogleMaps()
    }
  }, [])

  const loadCrimeDataAndDetermineZone = () => {
    // Load crime data (same as before)
    const sampleCrimeData: CrimeDataPoint[] = [
      // Delhi - High crime
      {
        lat: 28.6139,
        lng: 77.209,
        state: "Delhi",
        district: "New Delhi",
        totalCases: 1200,
        avgCrimeRate: 85.7,
        maxSeverity: 5,
        zoneType: "danger",
      },
      {
        lat: 28.5355,
        lng: 77.249,
        state: "Delhi",
        district: "South Delhi",
        totalCases: 45,
        avgCrimeRate: 1.7,
        maxSeverity: 5,
        zoneType: "danger",
      },
      {
        lat: 28.7041,
        lng: 77.1025,
        state: "Delhi",
        district: "North Delhi",
        totalCases: 890,
        avgCrimeRate: 98.9,
        maxSeverity: 4,
        zoneType: "danger",
      },
      // Mumbai - Moderate
      {
        lat: 19.076,
        lng: 72.8777,
        state: "Maharashtra",
        district: "Mumbai City",
        totalCases: 800,
        avgCrimeRate: 6.5,
        maxSeverity: 4,
        zoneType: "warning",
      },
      {
        lat: 19.1136,
        lng: 72.8697,
        state: "Maharashtra",
        district: "Mumbai Suburban",
        totalCases: 456,
        avgCrimeRate: 4.9,
        maxSeverity: 2,
        zoneType: "safe",
      },
      // Other cities...
      {
        lat: 12.9716,
        lng: 77.5946,
        state: "Karnataka",
        district: "Bengaluru Urban",
        totalCases: 456,
        avgCrimeRate: 5.4,
        maxSeverity: 3,
        zoneType: "safe",
      },
      {
        lat: 13.0827,
        lng: 80.2707,
        state: "Tamil Nadu",
        district: "Chennai",
        totalCases: 234,
        avgCrimeRate: 5.0,
        maxSeverity: 3,
        zoneType: "safe",
      },
      {
        lat: 22.5726,
        lng: 88.3639,
        state: "West Bengal",
        district: "Kolkata",
        totalCases: 345,
        avgCrimeRate: 7.7,
        maxSeverity: 3,
        zoneType: "warning",
      },
      {
        lat: 17.385,
        lng: 78.4867,
        state: "Telangana",
        district: "Hyderabad",
        totalCases: 234,
        avgCrimeRate: 3.4,
        maxSeverity: 2,
        zoneType: "safe",
      },
      {
        lat: 26.9124,
        lng: 75.7873,
        state: "Rajasthan",
        district: "Jaipur",
        totalCases: 456,
        avgCrimeRate: 14.7,
        maxSeverity: 4,
        zoneType: "warning",
      },
      {
        lat: 26.8467,
        lng: 80.9462,
        state: "Uttar Pradesh",
        district: "Lucknow",
        totalCases: 567,
        avgCrimeRate: 20.3,
        maxSeverity: 4,
        zoneType: "danger",
      },
    ]

    setCrimeData(sampleCrimeData)

    // Determine user's zone
    if (userLocation) {
      const zone = determineUserZone(userLocation, sampleCrimeData)
      setCurrentZone(zone)
      onZoneChange(zone)
    }
  }

  const loadGoogleMaps = () => {
    if (window.google) {
      setIsLoaded(true)
      loadCrimeDataAndDetermineZone()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=visualization&callback=initGoogleMap`
    script.async = true
    script.defer = true

    // Handle API errors
    script.onerror = () => {
      setApiError("Failed to load Google Maps API")
      loadCrimeDataAndDetermineZone()
    }

    // Listen for Google Maps API errors
    window.gm_authFailure = () => {
      setBillingError(true)
      setApiError("Google Maps API billing not enabled")
      loadCrimeDataAndDetermineZone()
    }

    window.initGoogleMap = () => {
      setIsLoaded(true)
      loadCrimeDataAndDetermineZone()
    }

    document.head.appendChild(script)
  }

  const determineUserZone = (
    location: { lat: number; lng: number },
    data: CrimeDataPoint[],
  ): "danger" | "warning" | "safe" => {
    const nearbyPoints = data.filter((point) => {
      const distance = calculateDistance(location.lat, location.lng, point.lat, point.lng)
      return distance < 10 // Within 10km
    })

    if (nearbyPoints.length === 0) return "safe"

    const highRiskNearby = nearbyPoints.some((point) => point.zoneType === "danger")
    const mediumRiskNearby = nearbyPoints.some((point) => point.zoneType === "warning")

    if (highRiskNearby) return "danger"
    if (mediumRiskNearby) return "warning"
    return "safe"
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Initialize Google Map (only if API is loaded and billing is enabled)
  useEffect(() => {
    if (!isLoaded || !hasApiKey || !mapRef.current || !window.google || billingError) return

    const defaultCenter = userLocation || { lat: 20.5937, lng: 78.9629 }

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: userLocation ? 12 : 5,
        center: defaultCenter,
        mapTypeId: mapType,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      mapInstanceRef.current = map

      // Add user location marker
      if (userLocation) {
        new window.google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Your Location",
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="3"/>
                <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
            anchor: new window.google.maps.Point(12, 12),
          },
        })
      }

      // Create heatmap and markers
      createHeatmapAndMarkers(map, crimeData)
    } catch (error) {
      console.error("Error initializing Google Maps:", error)
      setApiError("Error initializing Google Maps")
      setBillingError(true)
    }
  }, [isLoaded, hasApiKey, userLocation, crimeData, mapType, billingError])

  const createHeatmapAndMarkers = (map: any, data: CrimeDataPoint[]) => {
    if (!window.google?.maps?.visualization) return

    // Create heatmap
    const heatmapData = data.map((point) => ({
      location: new window.google.maps.LatLng(point.lat, point.lng),
      weight: Math.min(point.avgCrimeRate / 10, 10),
    }))

    new window.google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
      radius: 50,
      opacity: 0.6,
      gradient: [
        "rgba(0, 255, 0, 0)",
        "rgba(255, 255, 0, 1)",
        "rgba(255, 165, 0, 1)",
        "rgba(255, 0, 0, 1)",
        "rgba(139, 0, 0, 1)",
      ],
    })

    // Add crime markers
    data.forEach((point) => {
      const marker = new window.google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: map,
        title: `${point.district}, ${point.state}`,
        icon: {
          url: getMarkerIcon(point.zoneType),
          scaledSize: new window.google.maps.Size(20, 20),
        },
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${point.district}</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${point.state}</p>
            <div style="margin: 8px 0;">
              <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: white; background-color: ${getZoneColor(point.zoneType)};">
                ${point.zoneType.toUpperCase()} ZONE
              </span>
            </div>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Total Cases:</strong> ${point.totalCases}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Crime Rate:</strong> ${point.avgCrimeRate.toFixed(1)} per 100k</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Severity:</strong> ${point.maxSeverity}/5</p>
          </div>
        `,
      })

      marker.addListener("click", () => {
        infoWindow.open(map, marker)
      })
    })
  }

  const getMarkerIcon = (zoneType: string): string => {
    const color = zoneType === "danger" ? "#EF4444" : zoneType === "warning" ? "#F59E0B" : "#10B981"
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8" fill="${color}" stroke="#FFFFFF" strokeWidth="2"/>
      </svg>
    `)}`
  }

  const getZoneColor = (zoneType: string): string => {
    switch (zoneType) {
      case "danger":
        return "#EF4444"
      case "warning":
        return "#F59E0B"
      case "safe":
        return "#10B981"
      default:
        return "#6B7280"
    }
  }

  const recenterMap = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setCenter(userLocation)
      mapInstanceRef.current.setZoom(12)
    }
  }

  const toggleMapType = () => {
    const newType = mapType === "roadmap" ? "satellite" : "roadmap"
    setMapType(newType)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(newType)
    }
  }

  // Fallback Map Component (when Google Maps API is not available)
  const FallbackMap = () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 relative overflow-hidden rounded-lg">
      {/* Crime Heat Zones */}
      {crimeData.slice(0, 6).map((crime, index) => (
        <div
          key={index}
          className={`absolute w-16 h-16 rounded-full opacity-60 ${
            crime.zoneType === "danger" ? "bg-red-500" : crime.zoneType === "warning" ? "bg-yellow-500" : "bg-green-500"
          }`}
          style={{
            left: `${15 + index * 12}%`,
            top: `${20 + (index % 3) * 20}%`,
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

      {/* Fallback Message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-gray-600 bg-white/80 p-6 rounded-lg shadow-lg max-w-sm">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-70" />
          <h3 className="text-lg font-semibold mb-2">Crime Safety Map</h3>
          <p className="text-sm mb-4">Interactive map showing crime data across India</p>
          {billingError ? (
            <div className="text-xs text-red-600">
              <p>Google Maps billing not enabled</p>
              <p>Showing fallback visualization</p>
            </div>
          ) : !hasApiKey ? (
            <div className="text-xs text-gray-500">
              <p>Google Maps API not configured</p>
              <p>Showing fallback visualization</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Zone indicator for current location */}
      {userLocation && (
        <div className="absolute top-4 left-4 bg-white/90 px-3 py-2 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                currentZone === "danger" ? "bg-red-500" : currentZone === "warning" ? "bg-yellow-500" : "bg-green-500"
              }`}
            ></div>
            <span className="text-sm font-medium capitalize">{currentZone} Zone</span>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>India Crime Safety Map</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {hasApiKey && isLoaded && !billingError
                ? "Real-time heatmap based on women crime data from NCRB"
                : "Crime data visualization (Google Maps setup required for full features)"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getZoneColor(currentZone)} text-white`}>{currentZone.toUpperCase()} ZONE</Badge>
            {hasApiKey && isLoaded && !billingError && (
              <>
                <Button variant="outline" size="sm" onClick={recenterMap}>
                  <Navigation className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={toggleMapType}>
                  <Layers className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-full p-0">
        {/* Billing Error Alert */}
        {billingError && (
          <Alert className="m-4 border-red-200 bg-red-50">
            <CreditCard className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-2">
                <p>
                  <strong>Google Maps Billing Not Enabled</strong>
                </p>
                <p className="text-sm">To enable Google Maps with full features:</p>
                <ol className="text-sm list-decimal list-inside space-y-1 ml-2">
                  <li>
                    Go to{" "}
                    <a
                      href="https://console.cloud.google.com/billing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Google Cloud Billing
                    </a>
                  </li>
                  <li>Enable billing for your project</li>
                  <li>Google provides $200 free credit monthly</li>
                  <li>Refresh this page after enabling billing</li>
                </ol>
                <p className="text-xs mt-2 text-red-600">
                  <strong>Note:</strong> The app works fully in demo mode without billing enabled.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* API Setup Alert */}
        {!hasApiKey && !billingError && (
          <Alert className="m-4 border-blue-200 bg-blue-50">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="space-y-2">
                <p>
                  <strong>Google Maps API Setup Required</strong>
                </p>
                <p className="text-sm">To enable full interactive maps with heatmaps:</p>
                <ol className="text-sm list-decimal list-inside space-y-1 ml-2">
                  <li>
                    Go to{" "}
                    <a
                      href="https://console.cloud.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Google Cloud Console
                    </a>
                  </li>
                  <li>Enable Maps JavaScript API & Places API</li>
                  <li>Create an API key and add it to your environment variables</li>
                  <li>Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file</li>
                  <li>Enable billing (Google provides $200 free credit)</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Map Container */}
        <div className="w-full h-full">
          {hasApiKey && isLoaded && !billingError ? (
            <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: "400px" }} />
          ) : (
            <FallbackMap />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
