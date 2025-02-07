import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { Measurement } from "./BodyMeasurementTracker"
import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "@radix-ui/react-icons"

type MeasurementChartProps = {
  measurements: Measurement[]
}

export default function MeasurementChart({ measurements }: MeasurementChartProps) {
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null)

  const colors = {
    weight: "#FF6B6B",
    chest: "#4ECDC4",
    waist: "#45B7D1",
    hips: "#F7B731",
    bicep: "#5D9CEC",
    thigh: "#AC92EC",
    calves: "#EC87C0",
  }

  const sortedMeasurements = [...measurements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}`
  }

  const dataKeys = ["weight", "chest", "waist", "hips", "bicep", "thigh", "calves"]

  const chartData = sortedMeasurements.map((measurement) => ({
    ...measurement,
    ...Object.fromEntries(dataKeys.map((key) => [key, measurement[key as keyof Measurement] || null])),
  }))

  const calculateDifference = (key: string) => {
    if (sortedMeasurements.length < 2) return null
    const firstValue = sortedMeasurements[0][key as keyof Measurement]
    const lastValue = sortedMeasurements[sortedMeasurements.length - 1][key as keyof Measurement]
    if (typeof firstValue === "number" && typeof lastValue === "number") {
      return +(lastValue - firstValue).toFixed(1)
    }
    return null
  }

  const getDifferenceIcon = (difference: number | null) => {
    if (difference === null) return <MinusIcon className="inline-block" />
    if (difference > 0) return <ArrowUpIcon className="inline-block text-red-500" />
    if (difference < 0) return <ArrowDownIcon className="inline-block text-green-500" />
    return <MinusIcon className="inline-block" />
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold">Measurement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                onMouseMove={(e) => {
                  if (e.activePayload) {
                    setSelectedMeasurement(e.activePayload[0].payload)
                  }
                }}
                onMouseLeave={() => setSelectedMeasurement(null)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--foreground))"
                  tickFormatter={formatDate}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
                  label={{
                    value: "cm",
                    angle: -90,
                    position: "insideLeft",
                    fill: "hsl(var(--foreground))",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
                  label={{
                    value: "kg",
                    angle: 90,
                    position: "insideRight",
                    fill: "hsl(var(--foreground))",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value: number, name: string) => [
                    `${value?.toFixed(1) || "N/A"} ${name === "weight" ? "kg" : "cm"}`,
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend wrapperStyle={{ fontSize: 10, color: "hsl(var(--foreground))" }} />
                {dataKeys.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[key as keyof typeof colors]}
                    yAxisId={key === "weight" ? "right" : "left"}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {selectedMeasurement && (
            <div className="mt-4 bg-muted p-4 rounded-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Selected Date: {new Date(selectedMeasurement.date).toLocaleDateString()}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                {dataKeys.map((key) => (
                  <div key={key} className="bg-card p-2 md:p-4 rounded-lg shadow">
                    <h4 className="text-xs md:text-sm font-medium text-muted-foreground capitalize">{key}</h4>
                    <p className="text-sm md:text-lg font-bold" style={{ color: colors[key as keyof typeof colors] }}>
                      {selectedMeasurement[key as keyof Measurement]?.toFixed(1) || "N/A"}{" "}
                      {key === "weight" ? "kg" : "cm"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 bg-muted p-4 rounded-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-2">Overall Progress</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
              {dataKeys.map((key) => {
                const difference = calculateDifference(key)
                return (
                  <div key={key} className="bg-card p-2 md:p-4 rounded-lg shadow">
                    <h4 className="text-xs md:text-sm font-medium text-muted-foreground capitalize">{key}</h4>
                    <p className="text-sm md:text-lg font-bold" style={{ color: colors[key as keyof typeof colors] }}>
                      {getDifferenceIcon(difference)}
                      {difference !== null ? ` ${Math.abs(difference)} ${key === "weight" ? "kg" : "cm"}` : " N/A"}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

