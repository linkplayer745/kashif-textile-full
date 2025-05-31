import { DashboardSidebar } from "@/components/dashboard-sidebar"
import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <DashboardSidebar />
      <div className="lg:pl-80">
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
