import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import type React from "react" // Added import for React

type MeasurementCardProps = {
  title: string
  value: number
  latestMeasurement: number | null
  onChange: (value: number) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef: (el: HTMLInputElement | null) => void
}

export default function MeasurementCard({
  title,
  value,
  latestMeasurement,
  onChange,
  onKeyDown,
  inputRef,
}: MeasurementCardProps) {
  const unit = title === "weight" ? "kg" : "cm"

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-muted p-3 md:p-4">
          <CardTitle className="text-sm md:text-lg font-semibold capitalize">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 md:space-y-4 p-3 md:p-4">
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">Latest</span>
            <span className="text-base md:text-2xl font-bold text-primary">
              {latestMeasurement !== null ? `${latestMeasurement} ${unit}` : "-"}
            </span>
          </div>
          <div className="pt-2 md:pt-4 border-t border-border">
            <span className="text-xs md:text-sm font-medium text-muted-foreground mb-1 md:mb-2 block">
              New measurement
            </span>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={value || ""}
                onChange={(e) => onChange(Number.parseFloat(e.target.value))}
                onKeyDown={onKeyDown}
                ref={inputRef}
                className="text-sm md:text-xl font-bold bg-background"
                min="0"
                step={title === "weight" ? "0.1" : "0.1"}
                placeholder="Enter new value"
              />
              <span className="text-sm md:text-lg font-normal text-muted-foreground">{unit}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

