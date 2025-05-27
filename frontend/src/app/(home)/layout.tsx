import TopBar from "@/components/ui/top-bar";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBar />
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
