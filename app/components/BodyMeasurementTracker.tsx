"use client"

import { useState, useEffect, useRef } from "react"
import MeasurementCard from "./MeasurementCard"
import MeasurementChart from "./MeasurementChart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export type Measurement = {
  id: string
  user_id: string
  date: string
  weight: number
  chest: number
  waist: number
  hips: number
  bicep: number
  thigh: number
  calves: number
}

type BodyMeasurementTrackerProps = {
  userId: string
}

export default function BodyMeasurementTracker({ userId }: BodyMeasurementTrackerProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [newMeasurement, setNewMeasurement] = useState<Omit<Measurement, "id" | "user_id">>({
    date: new Date().toISOString().split("T")[0],
    weight: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    bicep: 0,
    thigh: 0,
    calves: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    fetchMeasurements()
  }, [])

  const fetchMeasurements = async () => {
    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching measurements:", error)
    } else {
      setMeasurements(data || [])
    }
  }

  const addMeasurement = async () => {
    setIsLoading(true)
    const measurementToAdd = {
      ...newMeasurement,
      user_id: userId,
      weight: newMeasurement.weight || null,
      chest: newMeasurement.chest || null,
      waist: newMeasurement.waist || null,
      hips: newMeasurement.hips || null,
      bicep: newMeasurement.bicep || null,
      thigh: newMeasurement.thigh || null,
      calves: newMeasurement.calves || null,
    }

    const { data, error } = await supabase.from("measurements").insert(measurementToAdd).select()

    if (error) {
      console.error("Error adding measurement:", error)
    } else if (data) {
      setMeasurements([...measurements, data[0]])
      setNewMeasurement({
        date: new Date().toISOString().split("T")[0],
        weight: 0,
        chest: 0,
        waist: 0,
        hips: 0,
        bicep: 0,
        thigh: 0,
        calves: 0,
      })
    }
    setIsLoading(false)
  }

  const handleInputChange = (key: keyof Omit<Measurement, "id" | "user_id">, value: number | string) => {
    setNewMeasurement((prev) => ({ ...prev, [key]: value === "" ? null : value }))
  }

  const getLatestMeasurement = (key: keyof Omit<Measurement, "id" | "user_id" | "date">): number | null => {
    if (measurements.length === 0) return null
    return measurements[measurements.length - 1][key] || null
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, currentKey: string) => {
    if (event.key === "Enter") {
      event.preventDefault()
      const keys = Object.keys(newMeasurement)
      const currentIndex = keys.indexOf(currentKey)
      const nextKey = keys[currentIndex + 1]
      if (nextKey) {
        inputRefs.current[nextKey]?.focus()
      } else {
        addMeasurement()
      }
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Add New Measurement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-full">
              <label
                htmlFor="measurement-date"
                className="block text-sm font-medium text-muted-foreground mb-1 md:mb-2"
              >
                Measurement Date
              </label>
              <DatePicker
                selected={new Date(newMeasurement.date)}
                onChange={(date: Date) => handleInputChange("date", date.toISOString().split("T")[0])}
                className="w-full p-2 rounded-md border border-input bg-background text-foreground text-sm md:text-base"
                dateFormat="MMMM d, yyyy"
                maxDate={new Date()}
              />
            </div>
            {Object.entries(newMeasurement).map(([key, value]) => {
              if (key === "date") return null
              return (
                <MeasurementCard
                  key={key}
                  title={key}
                  value={value as number}
                  latestMeasurement={getLatestMeasurement(key as keyof Omit<Measurement, "id" | "user_id" | "date">)}
                  onChange={(newValue) => handleInputChange(key as keyof Omit<Measurement, "id" | "user_id">, newValue)}
                  onKeyDown={(e) => handleKeyDown(e, key)}
                  inputRef={(el) => (inputRefs.current[key] = el)}
                />
              )
            })}
          </div>
          <div className="mt-4 md:mt-6 flex justify-end">
            <Button onClick={addMeasurement} className={`${isLoading ? "loading" : ""}`} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Measurement"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <MeasurementChart measurements={measurements} />
      </motion.div>
    </div>
  )
}

