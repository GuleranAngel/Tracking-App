import "./globals.css"
import { Inter } from "next/font/google"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import AuthProvider from "./components/AuthProvider"
import { ThemeProvider } from "./components/theme-provider"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Body Measurement Tracker",
  description: "Track your body measurements over time",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider session={session}>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

