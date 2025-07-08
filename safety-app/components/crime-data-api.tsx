"use client"

// API functions for crime data management
export interface CrimeDataPoint {
  id: number
  state: string
  district: string
  year: number
  crimeHead: string
  casesReported: number
  latitude: number
  longitude: number
  population: number
  crimeRate: number
  severityScore: number
  zoneType: "danger" | "warning" | "safe"
}

export class CrimeDataAPI {
  private static baseUrl = "/api/crime-data"

  static async getCrimeData(bounds?: {
    north: number
    south: number
    east: number
    west: number
  }): Promise<CrimeDataPoint[]> {
    try {
      const params = new URLSearchParams()
      if (bounds) {
        params.append("north", bounds.north.toString())
        params.append("south", bounds.south.toString())
        params.append("east", bounds.east.toString())
        params.append("west", bounds.west.toString())
      }

      const response = await fetch(`${this.baseUrl}?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch crime data")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching crime data:", error)
      return []
    }
  }

  static async getCrimeStatistics(location: { lat: number; lng: number }, radius = 10) {
    try {
      const response = await fetch(`${this.baseUrl}/statistics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location, radius }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch crime statistics")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching crime statistics:", error)
      return {
        totalIncidents: 0,
        againstWomen: 0,
        thisMonth: 0,
        nearbyRisk: "low",
      }
    }
  }

  static async reportIncident(incident: {
    location: { lat: number; lng: number }
    type: string
    description: string
    severity: number
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incident),
      })

      return response.ok
    } catch (error) {
      console.error("Error reporting incident:", error)
      return false
    }
  }
}
