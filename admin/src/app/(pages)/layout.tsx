import Sidebar from "@/components/sidebar";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />
      <main className="w-full flex-1 lg:ml-0">{children}</main>
    </div>
  );
}
