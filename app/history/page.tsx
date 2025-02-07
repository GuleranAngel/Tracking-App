"use client"

import { useEffect } from "react"
import HistoryTable from "../components/HistoryTable"
import { useAuth } from "../components/AuthProvider"
import { useRouter } from "next/navigation"
import MainLayout from "../components/MainLayout"

export default function HistoryPage() {
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
      <h1 className="text-4xl font-bold mb-8">Measurement History</h1>
      <HistoryTable userId={user.id} />
    </MainLayout>
  )
}

