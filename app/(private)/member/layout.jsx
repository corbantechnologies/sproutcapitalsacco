import MemberNavbar from "@/components/members/Navbar";
import React from "react";

const metadata = {
  title: "Member Dashboard",
  description: "Member Dashboard",
};

function MemberLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <MemberNavbar />
      <main>{children}</main>
    </div>
  );
}

export default MemberLayout;
