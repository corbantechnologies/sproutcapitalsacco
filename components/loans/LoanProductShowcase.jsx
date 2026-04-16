"use client";

import React from "react";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HandCoins, Info, Percent, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function LoanProductShowcase({ showTitle = true }) {
  const { data: loanProducts, isLoading } = useFetchLoanProducts();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-slate-100 animate-pulse rounded border border-slate-200" />
        ))}
      </div>
    );
  }

  if (!loanProducts || loanProducts.length === 0) return null;

  const getMethodDescription = (method) => {
    switch (method) {
      case "Flat":
        return "The interest amount remains fixed based on the original loan balance throughout the term.";
      case "Reducing":
        return "Interest is calculated on the declining balance, meaning you pay less interest as you repay the principal.";
      default:
        return "Standard cooperative interest calculation method.";
    }
  };

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center gap-2">
          <HandCoins className="w-5 h-5 text-[#236c2e]" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Available Loan Products</h2>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {loanProducts.map((product) => (
          <Card
            key={product.reference}
            className="border-slate-200 hover:border-[#236c2e]/30 hover:shadow-md transition-all duration-300 flex flex-col"
          >
            <CardHeader className="p-2 pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded bg-emerald-50 text-[#236c2e]">
                  <Wallet className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-bold text-[#236c2e] border-emerald-100 bg-emerald-50/30">
                  {product.interest_method}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold mt-3">{product.name}</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-600">
                {product.interest_method} Repayment Basis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-2 flex-grow flex flex-col justify-between">
              <div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Interest Rate</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-slate-900">{product.interest_rate}%</span>
                      <span className="text-[10px] text-slate-500 font-medium">/ year</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Processing Fee</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-slate-900">{product.processing_fee}%</span>
                      <span className="text-[10px] text-slate-500 font-medium">flat</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-[#236c2e] mt-0.5 shrink-0" />
                    <p className="text-base leading-relaxed text-slate-500 font-medium">
                      {getMethodDescription(product.interest_method)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
