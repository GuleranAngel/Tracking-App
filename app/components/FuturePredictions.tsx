"use client"

import { useState, useEffect } from "react"
import type { Measurement } from "./BodyMeasurementTracker"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "@radix-ui/react-icons"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

type FuturePredictionsProps = {
  measurements: Measurement[]
}

export default function FuturePredictions({ measurements }: FuturePredictionsProps) {
  const [weeksToPredict, setWeeksToPredict] = useState(4)
  const [predictDate, setPredictDate] = useState<Date | null>(null)
  const [targetWeight, setTargetWeight] = useState<number | null>(null)
  const [targetWeightWeeks, setTargetWeightWeeks] = useState<number | null>(null)

  const calculateTrend = (key: keyof Omit<Measurement, "id" | "user_id" | "date">) => {
    if (measurements.length < 2) return 0

    const firstValue = measurements[0][key] as number
    const lastValue = measurements[measurements.length - 1][key] as number
    const totalDays =
      (new Date(measurements[measurements.length - 1].date).getTime() - new Date(measurements[0].date).getTime()) /
      (1000 * 60 * 60 * 24)

    return ((lastValue - firstValue) / totalDays) * 7 // Weekly change
  }

  const predictFutureMeasurement = (key: keyof Omit<Measurement, "id" | "user_id" | "date">, weeks: number) => {
    const trend = calculateTrend(key)
    const currentValue = measurements[measurements.length - 1][key] as number

    const predictedValue = currentValue + trend * weeks
    return +predictedValue.toFixed(1)
  }

  const measurementKeys: (keyof Omit<Measurement, "id" | "user_id" | "date">)[] = [
    "weight",
    "chest",
    "waist",
    "hips",
    "bicep",
    "thigh",
    "calves",
  ]

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUpIcon className="inline-block text-red-500" />
    if (trend < 0) return <ArrowDownIcon className="inline-block text-green-500" />
    return <MinusIcon className="inline-block" />
  }

  const getWeeksBetweenDates = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.round(diffDays / 7)
  }

  const getPredictionWeeks = () => {
    if (predictDate) {
      const lastMeasurementDate = new Date(measurements[measurements.length - 1].date)
      return getWeeksBetweenDates(lastMeasurementDate, predictDate)
    }
    return weeksToPredict
  }

  useEffect(() => {
    if (targetWeight !== null) {
      const currentWeight = measurements[measurements.length - 1].weight
      const weightTrend = calculateTrend("weight")
      if (weightTrend !== 0) {
        const weeksToTarget = Math.abs((targetWeight - currentWeight) / weightTrend)
        setTargetWeightWeeks(Math.round(weeksToTarget))
      } else {
        setTargetWeightWeeks(null)
      }
    }
  }, [targetWeight, measurements, calculateTrend]) // Added calculateTrend to dependencies

  return (
    <div className="space-y-4">
      <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-muted">
          <CardTitle className="text-lg font-semibold">Prediction Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="weeks" className="text-sm font-medium">
                Predict for
              </label>
              <Input
                id="weeks"
                type="number"
                value={weeksToPredict}
                onChange={(e) => {
                  setWeeksToPredict(Math.max(1, Number.parseInt(e.target.value)))
                  setPredictDate(null)
                }}
                className="w-20"
                min="1"
              />
              <span className="text-sm font-medium">weeks</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">or select a date:</span>
              <DatePicker
                selected={predictDate}
                onChange={(date: Date) => {
                  setPredictDate(date)
                  setWeeksToPredict(getWeeksBetweenDates(new Date(measurements[measurements.length - 1].date), date))
                }}
                minDate={new Date()}
                className="w-full p-2 rounded-md border border-input bg-background text-foreground text-sm"
                dateFormat="MMMM d, yyyy"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="targetWeight" className="text-sm font-medium">
              Target Weight (kg):
            </label>
            <Input
              id="targetWeight"
              type="number"
              value={targetWeight || ""}
              onChange={(e) => setTargetWeight(e.target.value ? Number(e.target.value) : null)}
              className="w-24"
              min="1"
              step="0.1"
            />
          </div>
          {targetWeightWeeks !== null && (
            <p className="text-sm text-muted-foreground">
              Estimated time to reach target weight: {targetWeightWeeks} weeks
            </p>
          )}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {measurementKeys.map((key) => {
          const currentValue = measurements[measurements.length - 1][key] as number
          const predictedValue = predictFutureMeasurement(key, getPredictionWeeks())
          const weeklyTrend = calculateTrend(key)
          const totalChange = +(predictedValue - currentValue).toFixed(1)

          return (
            <Card key={key} className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-muted">
                <CardTitle className="text-lg font-semibold capitalize">{key}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Current</span>
                  <span className="text-lg font-bold">
                    {currentValue} {key === "weight" ? "kg" : "cm"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Weekly Trend</span>
                  <span className="text-sm">
                    {getTrendIcon(weeklyTrend)} {Math.abs(weeklyTrend).toFixed(2)} {key === "weight" ? "kg" : "cm"}/week
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Predicted</span>
                  <span className="text-lg font-bold">
                    {predictedValue} {key === "weight" ? "kg" : "cm"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Total Change</span>
                  <span
                    className={`text-lg font-bold ${totalChange < 0 ? "text-green-500" : totalChange > 0 ? "text-red-500" : ""}`}
                  >
                    {totalChange > 0 ? "+" : ""}
                    {totalChange} {key === "weight" ? "kg" : "cm"}
                  </span>
                </div>
                {key === "weight" && targetWeightWeeks !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">At Target</span>
                    <span className="text-lg font-bold">{targetWeight} kg</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

