"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { activateAccount } from "@/services/members";
import { PasswordSetupSchema } from "@/validation";
import { Field, Form, Formik } from "formik";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

function AccountActivation() {
  const { uid, token } = useParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

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
            Initialize your <br />
            <span className="text-[#D4AF37]">activation protocol.</span>
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
          <span className="font-bold text-lg text-black">Sprout Capital</span>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-black ">
              Activate Account
            </h2>
            <p className="text-[15px] font-medium text-black leading-relaxed">
              Set your password to activate your Sprout Capital account.
            </p>
          </div>

          <Formik
            initialValues={{
              uidb64: uid,
              token: token,
              password: "",
              confirmPassword: "",
            }}
            validationSchema={PasswordSetupSchema}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await activateAccount(values);
                toast?.success("Account Activated Successfully!");
                router.push("/login");
              } catch (error) {
                toast?.error("Failed to activate account!");
              } finally {
                setLoading(false);
              }
            }}
          >
            {({ values, errors, touched }) => (
              <Form className="space-y-6">
                <div className="space-y-1">
                  <Label
                    htmlFor="password"
                    className="text-[14px] font-bold text-black ml-1"
                  >
                    Password
                  </Label>
                  <div className="relative group">
                    <Field
                      as={Input}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="h-12 px-4 pr-12 rounded border-transparent bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-black font-medium"
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
                  {touched.password && errors.password && (
                    <p className="text-[11px] font-bold text-red-500 mt-1  px-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-[14px] font-bold text-black ml-1"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <Field
                      as={Input}
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="••••••••"
                      className="h-12 px-4 pr-12 rounded border-transparent bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all text-black font-medium"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-black focus:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-[11px] font-bold text-red-500 mt-1  px-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-[16px] font-bold  bg-[#D4AF37] hover:bg-[#b8962d] text-white shadow shadow-[#D4AF37]/20 transition-all active:scale-[0.98] rounded mt-4"
                  disabled={loading}
                >
                  {loading ? "Activating..." : "Activate Account"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-12 text-center text-[13px] font-medium text-black">
          Need assistance?{" "}
          <Link href="#" className="text-[#D4AF37] font-bold hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccountActivation;
