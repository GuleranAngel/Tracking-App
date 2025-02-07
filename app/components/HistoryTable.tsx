"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Measurement } from "./BodyMeasurementTracker"
import { supabase } from "@/lib/supabase"

type HistoryTableProps = {
  userId: string
}

export default function HistoryTable({ userId }: HistoryTableProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchMeasurements()
  }, []) // Removed userId from dependencies

  const fetchMeasurements = async () => {
    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching measurements:", error)
    } else {
      setMeasurements(data || [])
    }
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = async (measurement: Measurement) => {
    const { error } = await supabase.from("measurements").update(measurement).eq("id", measurement.id)

    if (error) {
      console.error("Error updating measurement:", error)
    } else {
      setMeasurements(measurements.map((m) => (m.id === measurement.id ? measurement : m)))
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("measurements").delete().eq("id", id)

    if (error) {
      console.error("Error deleting measurement:", error)
    } else {
      setMeasurements(measurements.filter((m) => m.id !== id))
    }
  }

  const handleChange = (measurement: Measurement, key: keyof Measurement, value: string) => {
    const updatedMeasurement = { ...measurement, [key]: key === "date" ? value : Number.parseFloat(value) }
    setMeasurements(measurements.map((m) => (m.id === measurement.id ? updatedMeasurement : m)))
  }

  return (
    <div className="space-y-4">
      <Table className="bg-gray-800 rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">Weight</TableHead>
            <TableHead className="text-gray-300">Chest</TableHead>
            <TableHead className="text-gray-300">Waist</TableHead>
            <TableHead className="text-gray-300">Hips</TableHead>
            <TableHead className="text-gray-300">Bicep</TableHead>
            <TableHead className="text-gray-300">Thigh</TableHead>
            <TableHead className="text-gray-300">Calves</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {measurements.map((measurement) => (
            <TableRow key={measurement.id}>
              {Object.entries(measurement).map(([key, value]) => {
                if (key === "id" || key === "user_id") return null
                return (
                  <TableCell key={key} className="text-gray-300">
                    {editingId === measurement.id ? (
                      <Input
                        type={key === "date" ? "date" : "number"}
                        value={value}
                        onChange={(e) => handleChange(measurement, key as keyof Measurement, e.target.value)}
                        className="bg-gray-700 text-gray-100 border-gray-600"
                      />
                    ) : key === "date" ? (
                      value
                    ) : (
                      `${value} ${key === "weight" ? "kg" : "cm"}`
                    )}
                  </TableCell>
                )
              })}
              <TableCell>
                {editingId === measurement.id ? (
                  <Button onClick={() => handleSave(measurement)} variant="outline" size="sm" className="mr-2">
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => handleEdit(measurement.id)} variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                )}
                <Button onClick={() => handleDelete(measurement.id)} variant="destructive" size="sm">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

