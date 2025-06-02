import Sidebar from "@/components/sidebar";
import Auth from "@/components/auth/Auth";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Auth>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <main className="w-full flex-1 p-4 lg:ml-0">{children}</main>
      </div>
    </Auth>
  );
}
