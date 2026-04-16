"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";

function MemberNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header
        className="bg-[#236c2e] text-white sticky top-0 z-50 shadow-sm"
        aria-label="Main navigation"
      >
        <div className="mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/member/dashboard" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold tracking-tight">
              Sprout Capital Sacco
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[280px] bg-white text-slate-900 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out border-l shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#236c2e]">Navigation</h2>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-slate-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col p-4">
            {[
              { label: "Dashboard", href: "/member/dashboard" },
              { label: "Loan Applications", href: "/member/loan-applications" },
              { label: "Guarantor Profile", href: "/member/guarantorprofile" },
              { label: "Reports", href: "/member/reports" },
              { label: "Profile Settings", href: "/member/settings" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-[15px] font-medium transition-colors hover:bg-slate-50 hover:text-[#236c2e] rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-auto p-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="w-full border-[#236c2e] text-[#236c2e] hover:bg-[#236c2e] hover:text-white"
              >
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay for Sidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default MemberNavbar;
