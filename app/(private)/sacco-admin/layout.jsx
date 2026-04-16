import SaccoAdminNavbar from "@/components/saccoadmin/Navbar";
import React from "react";

function SaccoAdminLayout({ children }) {
  return (
    <div className="admin-theme min-h-screen bg-white">
      <SaccoAdminNavbar />
      <main>{children}</main>
    </div>
  );
}

export default SaccoAdminLayout;
