"use client";

import Image from "next/image";
import LoginForm from "./LoginForm";
import Link from "next/link";
import { Building2 } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* Left Column - Branding/Promise (Hidden on mobile or stacked) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-[#0B0E14] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Building2 className="absolute -right-20 -bottom-20 w-[400px] h-[400px] text-[#D4AF37]" />
        </div>

        {/* Top Logo/Name */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-8 w-8 relative">
            <Image
              src="/wananchiLogoGoldNoBg.png"
              alt="Sprout Capital Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg  whitespace-nowrap">
            Sprout Capital
          </span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-sm mt-12">
          <h1 className="text-lg font-bold leading-tight mb-8">
            Secure entry to <br />
            <span className="text-[#D4AF37]">enterprise infrastructure.</span>
          </h1>
          <p className="text-lg text-black font-medium italic">
            — The Wananchi Promise
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs text-black font-bold ">
            Powered by Corban Technologies LTD
          </p>
        </div>
      </div>

      {/* Right Column - Form Area */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        {/* Mobile Logo Only */}
        <div className="md:hidden flex items-center gap-2 mb-12">
          <Image
            src="/wananchiLogoGold.png"
            width={32}
            height={32}
            alt="Logo"
            className="object-contain"
          />
          <span className="font-bold text-lg text-black">Sprout Capital Sacco</span>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <LoginForm />
        </div>

        {/* Right Column Footer (Help/Support) */}
        <div className="mt-12 text-center text-[13px] font-medium text-black">
          New to Sprout Capital Sacco?{" "}
          <Link href="#" className="text-[#D4AF37] font-bold hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
