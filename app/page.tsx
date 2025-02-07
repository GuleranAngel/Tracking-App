"use client"

import { useEffect } from "react"
import BodyMeasurementTracker from "./components/BodyMeasurementTracker"
import { useAuth } from "./components/AuthProvider"
import { useRouter } from "next/navigation"
import MainLayout from "./components/MainLayout"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <BodyMeasurementTracker userId={user.id} />
      </div>
    </MainLayout>
  )
}

