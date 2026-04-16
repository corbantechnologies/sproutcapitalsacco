"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordReset } from "@/services/members";
import { PasswordSetupSchema } from "@/validation";
import { ArrowLeft, Eye, EyeOff, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        code: "",
        new_password: "",
        confirm_password: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (errors[e.target.id]) {
            setErrors({ ...errors, [e.target.id]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await PasswordSetupSchema.validate(
                {
                    password: formData.new_password,
                    confirmPassword: formData.confirm_password,
                },
                { abortEarly: false }
            );
        } catch (err) {
            const validationErrors = {};
            if (err.inner) {
                err.inner.forEach((error) => {
                    if (error.path === "password") validationErrors.new_password = error.message;
                    if (error.path === "confirmPassword") validationErrors.confirm_password = error.message;
                });
            }
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await passwordReset({
                email: formData.email,
                code: formData.code,
                password: formData.new_password,
                confirm_password: formData.confirm_password,
            });
            toast.success("Password reset successful! You can now login.");
            router.push("/login");
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message ||
                "Failed to reset password. Please check your code."
            );
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
                        Establish new <br />
                        <span className="text-[#D4AF37]">security credentials.</span>
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
                            Reset Password
                        </h2>
                        <p className="text-[15px] font-medium text-black leading-relaxed">
                            Enter the code sent to your email and your new password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-[14px] font-bold text-black ml-1">
                                Email Address
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="your@email.com"
                                className="h-12 px-4 rounded border-transparent bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-black font-medium"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="code" className="text-[14px] font-bold text-black ml-1">
                                Reset Code (OTP)
                            </Label>
                            <Input
                                type="text"
                                id="code"
                                placeholder="6-digit code"
                                className="h-12 px-4 rounded border-transparent bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-black font-medium"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="new_password" className="text-[14px] font-bold text-black ml-1">
                                New Password
                            </Label>
                            <div className="relative group">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="new_password"
                                    placeholder="••••••••"
                                    className={`h-12 px-4 pr-12 rounded border-transparent bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-black font-medium ${errors.new_password ? "border-red-500" : ""}`}
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-black focus:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.new_password && (
                                <p className="text-[11px] font-bold text-red-500 mt-1  px-1">{errors.new_password}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="confirm_password" className="text-[14px] font-bold text-black ml-1">
                                Confirm New Password
                            </Label>
                            <div className="relative group">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm_password"
                                    placeholder="••••••••"
                                    className={`h-12 px-4 pr-12 rounded border-transparent bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-black font-medium ${errors.confirm_password ? "border-red-500" : ""}`}
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-black focus:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirm_password && (
                                <p className="text-[11px] font-bold text-red-500 mt-1  px-1">{errors.confirm_password}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-[16px] font-bold  bg-[#D4AF37] hover:bg-[#b8962d] text-white shadow shadow-[#D4AF37]/20 transition-all active:scale-[0.98] rounded mt-4"
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
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
