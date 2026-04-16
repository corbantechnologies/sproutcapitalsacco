"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { bulkCreateFeePayments } from "@/services/feepayments";
import { useFetchFeeAccounts } from "@/hooks/feeaccounts/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";

function BulkFeePaymentCreate({ onBatchSuccess }) {
    const [loading, setLoading] = useState(false);
    const token = useAxiosAuth();

    const { data: feeAccounts, isLoading: isLoadingFees } = useFetchFeeAccounts();
    const { data: paymentAccounts, isLoading: isLoadingPayments } = useFetchPaymentAccounts();

    // Filter for accounts with outstanding balance
    const outstandingFees = useMemo(() => {
        return feeAccounts?.filter(acc => Number(acc.outstanding_balance) > 0) || [];
    }, [feeAccounts]);

    const emptyPayment = {
        fee_account: "", 
        amount: "",
        payment_method: "", 
        transaction_status: "Completed",
    };

    const [payments, setPayments] = useState([{ ...emptyPayment }]);

    const handleInputChange = (index, field, value) => {
        const newPayments = [...payments];
        newPayments[index][field] = value;

        // Auto-fill outstanding balance if needed
        if (field === "fee_account") {
            const selected = outstandingFees.find(acc => acc.account_number === value);
            if (selected) {
                newPayments[index].amount = selected.outstanding_balance;
            }
        }

        setPayments(newPayments);
    };

    const addPayment = () => {
        if (payments.length < 15) {
            setPayments([...payments, { ...emptyPayment }]);
        }
    };

    const removePayment = (indexToRemove) => {
        setPayments(payments.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const invalidRow = payments.find(p => !p.fee_account || !p.amount || !p.payment_method);
            if (invalidRow) {
                toast.error("Please fill all fields in each row.");
                setLoading(false);
                return;
            }

            await bulkCreateFeePayments({ fee_payments: payments }, token);
            toast.success("Fee payments processed successfully!");
            setPayments([{ ...emptyPayment }]);
            if (onBatchSuccess) onBatchSuccess();
        } catch (error) {
            console.error("Bulk fee payment error:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to process fee payments.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-2">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Manual Collection Batch</h2>
                    <p className="text-sm text-slate-500">Record multiple member fee payments across different categories.</p>
                </div>
                <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setPayments([{ ...emptyPayment }])} 
                    className="text-xs h-8"
                >
                    Clear All
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {payments.map((pay, index) => (
                        <div key={index} className="p-4 border border-slate-100 rounded bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase tracking-wider">
                                    Collection Entry #{index + 1}
                                </span>
                                {payments.length > 1 && (
                                    <Button 
                                        type="button" 
                                        onClick={() => removePayment(index)} 
                                        variant="ghost" 
                                        className="text-red-400 hover:text-red-600 p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                <div className="lg:col-span-5 space-y-1.5">
                                    <Label className="text-[11px] font-bold uppercase text-slate-500">Member Fee Account</Label>
                                    <select
                                        value={pay.fee_account}
                                        onChange={(e) => handleInputChange(index, "fee_account", e.target.value)}
                                        className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm transition-colors bg-white h-9 focus:outline-none focus:ring-1 focus:ring-[#174271] truncate"
                                        disabled={isLoadingFees}
                                    >
                                        <option value="">Select account...</option>
                                        {outstandingFees?.map(acc => (
                                            <option key={acc.reference} value={acc.account_number}>
                                                {acc.member} - {acc.fee_type} ({acc.account_number}) • Bal: {Number(acc.outstanding_balance).toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="lg:col-span-3 space-y-1.5">
                                    <Label className="text-[11px] font-bold uppercase text-slate-500">Payment Amount</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px] uppercase">KES</span>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={pay.amount}
                                            onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                                            className="h-9 pl-10 text-sm border-slate-200 focus:border-[#174271]"
                                        />
                                    </div>
                                </div>
                                <div className="lg:col-span-4 space-y-1.5">
                                    <Label className="text-[11px] font-bold uppercase text-slate-500">Payment Method</Label>
                                    <select
                                        value={pay.payment_method}
                                        onChange={(e) => handleInputChange(index, "payment_method", e.target.value)}
                                        className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm transition-colors bg-white h-9 focus:outline-none focus:ring-1 focus:ring-[#174271]"
                                        disabled={isLoadingPayments}
                                    >
                                        <option value="">Select method...</option>
                                        {paymentAccounts?.map(acc => (
                                            <option key={acc.reference} value={acc.name}>{acc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    {payments.length < 15 && (
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={addPayment} 
                            className="w-full border-dashed border-2 border-slate-200 text-slate-400 hover:text-[#174271] hover:border-[#174271] hover:bg-slate-50 flex items-center justify-center gap-2 py-4 text-xs font-bold"
                        >
                            <Plus className="w-4 h-4" /> Add Another Entry
                        </Button>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <Button 
                        type="submit" 
                        className="bg-[#174271] hover:bg-[#12345a] text-white px-8 h-10 flex items-center gap-2 font-bold"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : <><Save className="w-4 h-4" /> Save Batch</>}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default BulkFeePaymentCreate;
