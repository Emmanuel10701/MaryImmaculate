"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Footer from "./components/Foooter/page"; 
import ModernNavbar from "./components/Navbar/page";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isMainDashboard = pathname === "/MainDashboard";

  return (
    <>
      {!isMainDashboard && <ModernNavbar />}


      <main className="min-h-screen">{children}</main>

      {!isMainDashboard && <Footer />}
    </>
  );
}