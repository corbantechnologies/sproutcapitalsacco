"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";

function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white font-sans overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col items-center text-center space-y-8 p-8">
          <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-2">
            <CheckCircle2
              className="w-14 h-14 text-[#D4AF37]"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-lg font-bold text-black  leading-none">
              Submission <br />
              Acknowledged
            </h1>
            <p className="text-black text-lg font-medium leading-relaxed max-w-[85%] mx-auto">
              Your application has been received and is currently being
              vetted by our governance team.
            </p>
          </div>

          <div className="bg-slate-50 rounded p-6 w-full border border-slate-100">
            <p className="text-black text-[14px] font-bold ">
              An email notification will be dispatched upon account verification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
            <Button
              asChild
              variant="outline"
              className="w-full h-12 text-[14px] font-bold  border-slate-200 hover:bg-slate-50 hover:text-[#D4AF37] transition-all rounded"
            >
              <Link href="/" aria-label="Return to home page">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              asChild
              className="w-full h-12 text-[14px] font-bold  bg-[#D4AF37] hover:bg-[#b8962d] shadow shadow-[#D4AF37]/20 transition-all rounded text-white"
            >
              <Link href="/login" aria-label="Go to login">
                Portal Access
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="pt-12 border-t border-slate-50 w-full">
            <div className="flex justify-center items-center gap-3">
              <Image
                src="/wananchiLogoGold.png"
                width={32}
                height={32}
                alt="Sprout Capital Logo"
                className="object-contain grayscale opacity-50"
              />
              <span className="font-bold text-sm text-black ">
                Sprout Capital
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
