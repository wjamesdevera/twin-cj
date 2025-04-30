import { Suspense } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Suspense>{children}</Suspense>
      <Footer />
    </>
  );
}
