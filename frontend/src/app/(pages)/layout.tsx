import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import TopBar from "@/components/ui/top-bar";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBar />
      <NavBar secondary />
      {children}
      <Footer />
    </>
  );
}
