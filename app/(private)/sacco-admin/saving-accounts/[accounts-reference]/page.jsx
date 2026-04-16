"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchSavingDetail } from "@/hooks/savings/actions";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ArrowLeft, 
    PiggyBank, 
    Calendar, 
    User, 
    CreditCard, 
    Activity,
    ArrowDownLeft,
    FileText,
    Receipt,
    Wallet
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function SavingAccountReferencePage() {
    const params = useParams();
    const router = useRouter();
    const reference = params?.["accounts-reference"];
    
    const { data: account, isLoading } = useFetchSavingDetail(reference);

    if (isLoading) return <LoadingSpinner />;
    if (!account) return <div className="p-8 text-center text-slate-500">Account not found.</div>;

    const deposits = account?.deposits || [];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded hover:bg-white border"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Account Reference
                            </h1>
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {account.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">
                            Viewing transaction history and master record for <span className="text-[#174271] font-bold">{account.account_number}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="text-xs font-bold h-10 border-slate-200"
                        onClick={() => window.print()}
                    >
                        <FileText className="w-4 h-4 mr-2 text-slate-400" /> Print Statement
                    </Button>
                </div>
            </div>

            {/* Account Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <Wallet className="w-6 h-6 text-[#174271]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Balance</p>
                                <p className="text-xl font-bold text-slate-900 font-mono tracking-tighter">
                                    KES {parseFloat(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <User className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member Owner</p>
                                <p className="text-sm font-bold text-slate-900 uppercase tracking-tight truncate max-w-[150px]">
                                    {account.member_name}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <PiggyBank className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Type</p>
                                <p className="text-sm font-bold text-slate-900 line-clamp-1">
                                    {account.account_type}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 rounded-xl">
                                <Calendar className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created On</p>
                                <p className="text-sm font-bold text-slate-900 tracking-tight">
                                    {new Date(account.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Section */}
            <Card className="border-none shadow-sm">
                <CardHeader className="bg-white border-b px-6 py-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#174271]" /> Transaction History
                        </CardTitle>
                        <CardDescription className="text-xs font-medium">Record of all deposits processed for this account.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-6 py-3">Reference</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3">Date</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3">Type</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-3">Payment Method</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right pr-6 py-3">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deposits.length > 0 ? (
                                [...deposits].reverse().map((dep, index) => (
                                    <TableRow key={dep.reference || index} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-[#174271] font-mono">{dep.identity || dep.reference}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">System ID</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">
                                                    {new Date(dep.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(dep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-1.5">
                                                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                                                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{dep.deposit_type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-xs font-medium text-slate-600">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                                {dep.payment_method}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-6 py-4">
                                            <span className="text-sm font-bold text-emerald-600 font-mono tracking-tighter">
                                                + {parseFloat(dep.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-48 text-slate-400 text-sm font-medium italic">
                                        No deposits or transactions recorded for this account.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Additional Info / Statement Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="px-6 py-4 border-b">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-slate-400" /> Administrative Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400 uppercase">Last Updated</span>
                                <span className="font-medium text-slate-600">{new Date(account.updated_at).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400 uppercase">System Reference</span>
                                <span className="font-mono font-bold text-[#174271]">{account.reference}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400 uppercase">Identity Hash</span>
                                <span className="text-slate-500">{account.identity}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-[#174271] text-white">
                    <CardHeader className="px-6 py-4 border-white/10 border-b">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-white/60" /> Account Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-xs text-white/70 font-medium mb-4">
                            Manage account limits, interest calculation methods, and status overrides.
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" className="text-[10px] font-bold h-8 uppercase bg-white/5 border-white/20 text-white hover:bg-white/10">
                                Edit Settings
                            </Button>
                            <Button variant="outline" className="text-[10px] font-bold h-8 uppercase bg-white/5 border-white/20 text-white hover:bg-white/10">
                                Deactivate Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}