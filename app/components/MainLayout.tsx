"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "./AuthProvider"
import type React from "react"
import { Menu } from "lucide-react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut()
    setIsLoading(false)
  }

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "History", href: "/history" },
    { name: "Your Future", href: "/future", highlight: true },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold md:text-2xl">Body Measurement Tracker</h1>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-foreground/60"
                  } ${
                    item.highlight
                      ? "bg-gradient-to-r from-purple-400 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className={`${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing out..." : "Sign out"}
                </Button>
              )}
            </nav>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-foreground/60"
                  } ${
                    item.highlight
                      ? "bg-gradient-to-r from-purple-400 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className={`${isLoading ? "loading" : ""} w-full justify-start`}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing out..." : "Sign out"}
                </Button>
              )}
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

