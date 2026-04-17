"use client";

import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as XIcon, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import React, { useState } from "react";

const MENU_LINKS = [
  { label: "Dashboard", href: "/sacco-admin/dashboard" },

  {
    label: "Members",
    href: "/sacco-admin/members",
    children: [
      { label: "All Members", href: "/sacco-admin/members" },
      { label: "Personal Profiles", href: "/sacco-admin/personal" },
      { label: "Guarantor Profiles", href: "/sacco-admin/personal/guarantorprofile" },
    ],
  },

  {
    label: "Loans",
    href: "/sacco-admin/loans",
    children: [
      { label: "Active Loans", href: "/sacco-admin/loans" },
      { label: "Loan Applications", href: "/sacco-admin/loan-applications" },
      { label: "Loan Products", href: "/sacco-admin/setup/loan-products" },
    ],
  },

  {
    label: "Savings & Deposits",
    href: "/sacco-admin/saving-deposits",
    children: [
      { label: "All Deposits", href: "/sacco-admin/saving-deposits" },
      { label: "Savings Types", href: "/sacco-admin/setup/saving-types" },
    ],
  },

  {
    label: "Accounting & Financials",
    href: "/sacco-admin/accounting",
    children: [
      { label: "Accounting Dashboard", href: "/sacco-admin/accounting" },
      { label: "GL Accounts", href: "/sacco-admin/setup/gl-accounts" },
      { label: "Fee Payments", href: "/sacco-admin/fee-payments" },
      { label: "Payment Accounts", href: "/sacco-admin/setup/payment-accounts" },
      { label: "Fee Types", href: "/sacco-admin/setup/feetypes" },
    ],
  },

  {
    label: "Reports",
    href: "/sacco-admin/reports",
  },

  {
    label: "Setup & Configuration",
    href: "/sacco-admin/setup",
    children: [
      { label: "Platform Setup", href: "/sacco-admin/setup" },
      { label: "General Settings", href: "/sacco-admin/settings" },
    ],
  },

  {
    label: "Data Onboarding",
    href: "/sacco-admin/onboarding/existing-loans",
    children: [
      { label: "Legacy Loans", href: "/sacco-admin/onboarding/existing-loans" },
      { label: "Legacy Payments", href: "/sacco-admin/onboarding/existing-loan-payments" },
    ],
  },
];

const NavItem = ({ link, setIsMenuOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (link.children) {
    return (
      <div className="flex flex-col">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-[14px] font-medium hover:bg-slate-50 rounded-lg transition-colors text-left group"
        >
          <span className="group-hover:text-[#174271]">{link.label}</span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isOpen && (
          <div className="ml-6 mt-1 mb-3 flex flex-col border-l border-slate-100 pl-4 space-y-1">
            {link.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="px-4 py-2 text-[13px] text-slate-600 hover:text-[#174271] hover:bg-slate-50 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={link.href}
      className="block px-4 py-3 text-[14px] font-medium hover:bg-slate-50 hover:text-[#174271] rounded-lg transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      {link.label}
    </Link>
  );
};

export default function SaccoAdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Navbar */}
      <header className="bg-[#174271] text-white sticky top-0 z-50 shadow">
        <div className="mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/sacco-admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold tracking-tight">
              Sprout Capital Sacco
              <span className="text-[10px] font-normal uppercase tracking-[2px] opacity-75 ml-1.5">ADMIN</span>
            </span>
          </Link>

          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white border-l shadow-2xl flex flex-col transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#174271]">Main Menu</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {MENU_LINKS.map((link) => (
            <NavItem key={link.href} link={link} setIsMenuOpen={setIsMenuOpen} />
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              setIsMenuOpen(false);
              signOut({ callbackUrl: "/login" });
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}