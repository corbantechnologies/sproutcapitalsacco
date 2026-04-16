"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Wallet,
  Menu as MenuIcon,
  X as XIcon,
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
      {/* Subtle Background Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23000' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10">
              <Image
                src="/sproutLarge.png"
                alt="Sprout Capital SACCO"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#236c2e]">
              Sprout Capital SACCO
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="#features"
              className="text-[14px] font-semibold text-slate-600 hover:text-[#236c2e] transition-colors"
            >
              Services
            </Link>
            <Link
              href="#about"
              className="text-[14px] font-semibold text-slate-600 hover:text-[#236c2e] transition-colors"
            >
              Our Mission
            </Link>
            <Button
              asChild
              className="bg-[#236c2e] hover:bg-[#1a5222] text-white px-8 rounded-md font-bold text-[14px] shadow-sm transition-all shadow-[#236c2e]/10"
            >
              <Link href="/login">Member Portal</Link>
            </Button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon className="h-6 w-6 text-[#236c2e]" />
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-out border-l border-slate-100 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex justify-between items-center border-b border-slate-50">
            <span className="font-bold text-lg text-[#236c2e]">Navigation</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="#features"
              className="px-4 py-3 rounded-md hover:bg-slate-50 text-[15px] font-semibold text-slate-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#about"
              className="px-4 py-3 rounded-md hover:bg-slate-50 text-[15px] font-semibold text-slate-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Mission
            </Link>
            <div className="pt-6 mt-4 border-t border-slate-50">
              <Button
                asChild
                className="w-full bg-[#236c2e] text-white rounded-md h-12 font-bold shadow-md"
              >
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Access Portal
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 border-b border-slate-50">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-[#236c2e] text-[12px] font-bold uppercase tracking-widest mb-10 border border-emerald-100/50">
              <Building2 className="w-3.5 h-3.5" />
              <span>Premium Cooperative Finance</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]">
              Financial Excellence for <br className="hidden lg:block" />
              <span className="text-[#236c2e]">Modern Professionals</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              We provide CEOs, Directors, and Managers with a secure,
              transparent platform for growth-focused savings and strategic
              credit facilities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Button
                asChild
                className="h-14 px-10 rounded-md text-[16px] font-bold bg-[#236c2e] hover:bg-[#1a5222] text-white shadow-lg shadow-[#236c2e]/20 transition-all"
              >
                <Link href="/login">
                  Enter Secure Portal
                  <ArrowRight className="ml-2 w-5 h-5 opacity-70" />
                </Link>
              </Button>
              <Link
                href="#features"
                className="text-[14px] font-bold text-slate-600 hover:text-[#236c2e] transition-colors h-14 flex items-center px-6"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="features" className="py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Strategic Financial Services
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Specifically designed components to facilitate high-level
                financial management and collective prosperity for our elite
                membership.
              </p>
            </div>
            <div className="h-[2px] w-24 bg-[#236c2e] mb-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Wallet,
                title: "Asset Accumulation",
                desc: "High-yield savings structures tailored for long-term wealth preservation and growth.",
                points: [
                  "Competitive IRR",
                  "Tiered structures",
                  "Flexible withdrawals",
                ],
              },
              {
                icon: ShieldCheck,
                title: "Strategic Credit",
                desc: "Low-interest loan facilities matched to professional growth and capital investment needs.",
                points: [
                  "Corporate rates",
                  "Rapid processing",
                  "Transparent terms",
                ],
              },
              {
                icon: Users,
                title: "Elite Network",
                desc: "A community of peers committed to mutual financial integrity and professional excellence.",
                points: [
                  "CEO networking",
                  "Director-only tiers",
                  "Shared prosperity",
                ],
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="group border border-slate-100 bg-white hover:border-[#236c2e]/20 hover:shadow-xl transition-all duration-300 rounded-md p-2"
              >
                <CardHeader className="p-6">
                  <div className="w-12 h-12 rounded-md bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-[#236c2e] group-hover:text-white transition-colors duration-300 text-[#236c2e]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                    {feature.title}
                  </CardTitle>
                  <p className="text-slate-500 text-[15px] leading-relaxed mb-6 font-medium">
                    {feature.desc}
                  </p>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                  <ul className="space-y-3 border-t border-slate-50 pt-6">
                    {feature.points.map((pt, pidx) => (
                      <li
                        key={pidx}
                        className="flex items-center gap-2 text-[13px] font-bold text-slate-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#236c2e] opacity-70" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-slate-50/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[12px] font-bold text-[#236c2e] uppercase tracking-widest mb-6 border-l-2 border-[#236c2e] pl-4">
                Our Commitment
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
                Upholding the Gold <br />
                Standard in SACCOs
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed font-medium mb-10">
                Sprout Capital SACCO stands as a beacon of financial empowerment for
                individuals who demand more from their cooperative society. We
                operate with institutional-grade transparency and a relentless
                focus on member-first prosperity.
              </p>
              <div className="flex items-center gap-4 py-2 px-5 bg-white border border-slate-100 rounded-md shadow-sm w-fit">
                <span className="text-[#236c2e] font-bold text-lg italic">
                  Sprout
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-bold text-[14px] uppercase tracking-wider">
                  Integrity • Growth • Security
                </span>
              </div>
            </div>
            <div className="relative aspect-square bg-[#236c2e]/5 rounded-md flex items-center justify-center border border-[#236c2e]/10 overflow-hidden">
              {/* Corporate abstract visual */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#236c2e] to-transparent"></div>
                <div className="absolute inset-x-0 bottom-1/4 h-px bg-gradient-to-r from-transparent via-[#236c2e] to-transparent"></div>
                <div className="absolute left-1/4 inset-y-0 w-px bg-gradient-to-b from-transparent via-[#236c2e] to-transparent"></div>
                <div className="absolute right-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-[#236c2e] to-transparent"></div>
              </div>
              <div className="text-center p-10 relative z-10">
                <span className="text-6xl font-bold text-[#236c2e] block mb-2">
                  99.8%
                </span>
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[12px]">
                  Member Satisfaction
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Call to Action */}
      <section className="py-28 bg-[#174271] text-white relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <Building2 className="absolute -right-20 -bottom-20 w-[400px] h-[400px]" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">
            Institutional Growth Awaits
          </h2>
          <p className="text-lg md:text-xl text-blue-100/70 mb-12 max-w-2xl mx-auto font-medium">
            Join a community of like-minded leaders securing their financial
            future through precision-engineered savings and credit programs.
          </p>
          <Button
            asChild
            className="h-14 px-12 rounded-md text-[16px] bg-white text-[#174271] hover:bg-slate-50 shadow-xl transition-all font-bold uppercase tracking-widest"
          >
            <Link href="/login">Execute Membership Login</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="container mx-auto px-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <div className="h-8 w-8 relative">
                  <Image
                    src="/sproutLarge.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tightest">
                  Sprout Capital SACCO
                </h3>
              </div>
              <p className="text-[14px] text-slate-400 font-medium leading-relaxed">
                Elevating cooperative standards through technology-driven
                transparency and member-centric financial excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
              <div className="flex flex-col gap-4">
                <span className="text-[12px] font-black uppercase tracking-[3px] text-slate-900">
                  Legal
                </span>
                <Link
                  href="#"
                  className="text-[14px] text-slate-500 hover:text-[#236c2e] font-bold"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-[14px] text-slate-500 hover:text-[#236c2e] font-bold"
                >
                  Terms of Conduct
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[12px] font-black uppercase tracking-[3px] text-slate-900">
                  Portal
                </span>
                <Link
                  href="/login"
                  className="text-[14px] text-slate-500 hover:text-[#236c2e] font-bold"
                >
                  Member Access
                </Link>
                <Link
                  href="/login"
                  className="text-[14px] text-slate-500 hover:text-[#236c2e] font-bold"
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] font-bold text-slate-400">
              © {new Date().getFullYear()} Sprout Capital SACCO. Standard Financial
              Principles Apply.
            </p>
            <p className="text-[12px] font-bold text-slate-300 tracking-wider">
              DEVELOPED BY{" "}
              <span className="text-slate-400">CORBAN TECHNOLOGIES LTD</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
