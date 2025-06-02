import Auth from "@/components/auth/Auth";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Auth>
      <div className="mt-20 flex bg-gray-50">
        <DashboardSidebar />
        <div className="w-full">
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </Auth>
  );
}
