"use client";

import { usePathname } from "next/navigation";
import Footer from "./components/Foooter/page"; 
import ModernNavbar from "./components/Navbar/page";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();

  const isMainDashboard = pathname === "/MainDashboard";
  const isStudentPortal = pathname === "/pages/StudentPortal";
  const isAdminLogin = pathname === "/pages/adminLogin";

  return (
    <>
      {/* Navbar is shown on all pages except MainDashboard or StudentPortal */}
      {!isMainDashboard && !isStudentPortal && <ModernNavbar />}

      <main className="min-h-screen">{children}</main>

      {/* Footer is hidden only on MainDashboard, StudentPortal, and AdminLogin */}
      {!isMainDashboard && !isStudentPortal && !isAdminLogin && <Footer />}
    </>
  );
}
