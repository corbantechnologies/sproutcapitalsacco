"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/services/members";
import { ArrowLeft, Mail, Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword({ email });
            toast.success("If an account exists, a reset code has been sent.");
            router.push("/reset-password");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
            {/* Left Column - Branding/Promise */}
            <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-[#0B0E14] text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <Building2 className="absolute -right-20 -bottom-20 w-[400px] h-[400px] text-[#D4AF37]" />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="h-8 w-8 relative">
                        <Image
                            src="/wananchiLogoGoldNoBg.png"
                            alt="Sprout Capital Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-bold text-lg  whitespace-nowrap text-white">
                        Sprout Capital
                    </span>
                </div>

                <div className="relative z-10 max-w-sm mt-12">
                    <h1 className="text-lg font-bold leading-tight mb-8 text-white">
                        Restore your <br />
                        <span className="text-[#D4AF37]">access protocol.</span>
                    </h1>
                    <p className="text-lg text-black font-medium italic">
                        — The Wananchi Promise
                    </p>
                </div>

                <div className="relative z-10">
                    <p className="text-xs text-black font-bold ">
                        Powered by Corban Technologies LTD
                    </p>
                </div>
            </div>

            {/* Right Column - Form Area */}
            <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
                <div className="md:hidden flex items-center gap-2 mb-12">
                    <Image
                        src="/wananchiLogoGold.png"
                        width={32}
                        height={32}
                        alt="Logo"
                        className="object-contain"
                    />
                    <span className="font-bold text-lg text-black">Sprout Capital</span>
                </div>

                <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-black ">
                            Forgot Password
                        </h2>
                        <p className="text-[15px] font-medium text-black leading-relaxed">
                            Enter your email to receive a password reset code.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[14px] font-bold text-black ml-1">
                                Email Address
                            </Label>
                            <div className="relative group">
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="your@email.com"
                                    className="h-12 px-4 rounded border-transparent bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-black font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-[16px] font-bold  bg-[#D4AF37] hover:bg-[#b8962d] text-white shadow shadow-[#D4AF37]/20 transition-all active:scale-[0.98] rounded"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Send Reset Code"}
                        </Button>
                    </form>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-[14px] font-bold text-black hover:text-[#D4AF37] transition-colors "
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Login
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center text-[13px] font-medium text-black">
                    New to Sprout Capital Sacco?{" "}
                    <Link href="#" className="text-[#D4AF37] font-bold hover:underline">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
