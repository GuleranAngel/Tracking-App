"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../components/AuthProvider"
import { useRouter } from "next/navigation"
import MainLayout from "../components/MainLayout"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Measurement } from "../components/BodyMeasurementTracker"
import FuturePredictions from "../components/FuturePredictions"

export default function FuturePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [measurements, setMeasurements] = useState<Measurement[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    } else {
      fetchMeasurements()
    }
  }, [user, router])

  const fetchMeasurements = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching measurements:", error)
    } else {
      setMeasurements(data || [])
    }
  }

  if (!user) {
    return null
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Future Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Based on your past measurements, here's a simple prediction of how your measurements might change in the
              future. You can predict by number of weeks, choose a specific date, or set a target weight. Remember,
              these are estimates based solely on your past progress.
            </p>
            {measurements.length > 1 ? (
              <FuturePredictions measurements={measurements} />
            ) : (
              <p className="text-center text-muted-foreground">
                Not enough data to make predictions. Please add at least two measurements.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Understanding Your Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>These predictions are based solely on the trend calculated from your past measurements.</li>
              <li>
                The prediction assumes that your current trend will continue at the same rate, which may not always be
                the case in real life.
              </li>
              <li>
                Predictions do not take into account factors such as changes in diet, exercise routine, or other
                lifestyle changes.
              </li>
              <li>Short-term predictions are generally more reliable than long-term predictions.</li>
              <li>The target weight feature estimates when you might reach your goal based on your current trend.</li>
              <li>Remember that everyone's body responds differently to changes, and your actual results may vary.</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Disclaimer: These predictions are for informational purposes only and should not be considered as
              guaranteed outcomes. Always consult with a healthcare professional before making significant changes to
              your diet or exercise routine.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

