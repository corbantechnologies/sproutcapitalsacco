"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [member_no, setMemberNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        member_no,
        password,
      });
      const session = await getSession();
      if (response?.error) {
        toast?.error("Invalid member number or password");
        setLoading(false);
      } else {
        toast?.success("Login successful! Redirecting...");
        if (session?.user?.is_staff === true || session?.user?.is_system_admin === true) {
          router.push("/sacco-admin/dashboard");
        } else if (session?.user?.is_member === true) {
          router.push("/member/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      setLoading(false);
      toast?.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-black">
          Sign in
        </h2>
        <p className="text-[15px] font-medium text-black leading-relaxed">
          Welcome back. Enter your credentials to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="member_no"
            className="text-[14px] font-bold text-black ml-1"
          >
            Member Number
          </Label>
          <Input
            type="text"
            id="member_no"
            placeholder="123456"
            className="h-12 px-4 rounded border-transparent bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-black font-medium"
            value={member_no}
            onChange={(e) => setMemberNo(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <Label
              htmlFor="password"
              className="text-[14px] font-bold text-black"
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-[13px] font-bold text-[#3b82f6] hover:text-[#2563eb] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              className="h-12 px-4 pr-12 rounded border-transparent bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-black font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-black transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-1">
          <Checkbox id="remember" className="rounded border-slate-300 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]" />
          <Label
            htmlFor="remember"
            className="text-[14px] font-medium text-black leading-none cursor-pointer"
          >
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-[16px] font-bold  bg-[#D4AF37] hover:bg-[#b8962d] text-white shadow shadow-[#D4AF37]/20 transition-all active:scale-[0.98] rounded"
          disabled={loading}
        >
          {loading ? "Process..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
