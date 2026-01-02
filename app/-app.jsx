"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Footer from "./components/Foooter/page"; 
import ModernNavbar from "./components/Navbar/page";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isMainDashboard = pathname === "/MainDashboard";
  const isStudentportal = pathname === "/pages/StudentPortal";
  const isMain = pathname === "/pages/main";

  return (
    <>
      {!isMainDashboard && !isStudentportal && !isMain && <ModernNavbar />}


      <main className="min-h-screen">{children}</main>

      {!isMainDashboard && !isStudentportal && !isMain && <Footer />}
    </>
  );
}