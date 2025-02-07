import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Measurement } from "./BodyMeasurementTracker"

type MeasurementFormProps = {
  onSubmit: (measurement: Measurement) => void
}

export default function MeasurementForm({ onSubmit }: MeasurementFormProps) {
  const [measurement, setMeasurement] = useState<Omit<Measurement, "date">>({
    chest: 0,
    waist: 0,
    hips: 0,
    bicep: 0,
    thigh: 0,
    calves: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...measurement,
      date: new Date().toISOString().split("T")[0],
    })
    setMeasurement({
      chest: 0,
      waist: 0,
      hips: 0,
      bicep: 0,
      thigh: 0,
      calves: 0,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeasurement({
      ...measurement,
      [e.target.name]: Number.parseFloat(e.target.value),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add New Measurement</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(measurement).map((key) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-gray-700 capitalize">
              {key}
            </Label>
            <Input
              type="number"
              id={key}
              name={key}
              value={measurement[key as keyof typeof measurement]}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
              className="w-full"
            />
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Add Measurement
      </Button>
    </form>
  )
}

