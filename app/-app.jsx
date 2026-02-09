"use client";

import { usePathname } from "next/navigation";
import Footer from "./components/Foooter/page"; 
import ModernNavbar from "./components/Navbar/page";
import { useEffect } from "react";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();

  const isMainDashboard = pathname === "/MainDashboard";
  const isStudentPortal = pathname === "/pages/StudentPortal";
  const isAdminLogin = pathname === "/pages/adminLogin";

  // Add or remove zoom class based on route
  useEffect(() => {
    if (isMainDashboard) {
      document.documentElement.classList.add("no-zoom");
    } else {
      document.documentElement.classList.remove("no-zoom");
    }
  }, [isMainDashboard]);

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