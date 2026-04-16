"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFetchFeeAccounts } from "@/hooks/feeaccounts/actions";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    CreditCard,
    Eye,
    Receipt,
    FileUp,
    Plus,
    Users,
    BadgePercent,
    ArrowLeft,
    ListFilter
} from "lucide-react";
import Link from "next/link";

import BulkFeePaymentCreate from "@/forms/feepayments/BulkFeePaymentCreate";
import BulkFeePaymentUploadCreate from "@/forms/feepayments/BulkFeePaymentUploadCreate";

export default function FeePaymentsManagementPage() {
    const router = useRouter();
    const { data: feeAccounts, isLoading, refetch } = useFetchFeeAccounts();

    const [searchTerm, setSearchTerm] = useState("");

    const filteredAccounts = useMemo(() => {
        if (!feeAccounts) return [];
        return feeAccounts.filter(acc => {
            const matchesSearch =
                acc.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (`${acc.member?.first_name} ${acc.member?.last_name}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.fee_type?.name?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch;
        });
    }, [feeAccounts, searchTerm]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded hover:bg-white border shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <Receipt className="w-6 h-6 text-[#174271]" /> Fee Collections
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Track and collect administrative and service fees.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border shadow-sm bg-[#174271] text-white rounded-lg">
                    <CardHeader className="p-6">
                        <CardDescription className="text-white/60 uppercase tracking-widest text-[9px]">Total Receivables</CardDescription>
                        <CardTitle className="text-3xl font-bold">
                            {feeAccounts?.reduce((sum, acc) => sum + Number(acc.outstanding_balance || 0), 0).toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border shadow-sm bg-white rounded-lg">
                    <CardHeader className="p-6">
                        <CardDescription className="text-slate-400 uppercase tracking-widest text-[9px]">Accounts Outstanding</CardDescription>
                        <CardTitle className="text-2xl font-bold text-slate-800">
                            {feeAccounts?.filter(a => Number(a.outstanding_balance) > 0).length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border shadow-sm bg-white rounded-lg">
                    <CardHeader className="p-6">
                        <CardDescription className="text-slate-400 uppercase tracking-widest text-[9px]">Fully Paid</CardDescription>
                        <CardTitle className="text-2xl font-bold text-emerald-600">
                            {feeAccounts?.filter(a => Number(a.outstanding_balance) === 0).length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border shadow-sm bg-white rounded-lg">
                    <CardHeader className="p-6">
                        <CardDescription className="text-slate-400 uppercase tracking-widest text-[9px]">Avg Fee Bal</CardDescription>
                        <CardTitle className="text-2xl font-bold text-slate-800">
                            {feeAccounts?.length ? Math.round(feeAccounts.reduce((sum, acc) => sum + Number(acc.outstanding_balance || 0), 0) / feeAccounts.length).toLocaleString() : 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-white border p-1 h-12 shadow-sm mb-6 rounded">
                    <TabsTrigger value="list" className="px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] text-xs uppercase tracking-wider transition-all">
                        <ListFilter className="w-4 h-4 mr-2" /> List View
                    </TabsTrigger>
                    <TabsTrigger value="bulk-create" className="px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] text-xs uppercase tracking-wider transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Manual Batch
                    </TabsTrigger>
                    <TabsTrigger value="bulk-upload" className="px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] text-xs uppercase tracking-wider transition-all">
                        <FileUp className="w-4 h-4 mr-2" /> CSV Import
                    </TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    {/* Filter Bar */}
                    <div className="bg-white rounded p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative group w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#174271] transition-colors" />
                            <Input
                                placeholder="Search by member, account # or fee type..."
                                className="pl-12 h-12 rounded border-slate-100 focus:border-[#174271] bg-slate-50/50 shadow-none border-0 ring-offset-transparent focus-visible:ring-1 focus-visible:ring-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fee Accounts Table */}
                    <Card className="border-none shadow-sm overflow-hidden rounded bg-transparent">
                        <CardHeader className="bg-white border-b px-6 py-4 rounded-t">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg text-slate-900">Fee Receivable Portfolio</CardTitle>
                                    <CardDescription className="text-xs mt-1">A detailed view of all member fee accounts.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 bg-white rounded-b">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 border-b">
                                            <TableHead className="pl-6 py-4 text-xs uppercase tracking-wider text-slate-500">Payer Details</TableHead>
                                            <TableHead className="py-4 text-xs uppercase tracking-wider text-slate-500">Fee Type</TableHead>
                                            <TableHead className="py-4 text-xs uppercase tracking-wider text-slate-500 text-center">Outstanding Balance</TableHead>
                                            <TableHead className="py-4 text-xs uppercase tracking-wider text-slate-500 text-center">Status</TableHead>
                                            <TableHead className="pr-6 py-4 text-right text-xs uppercase tracking-wider text-slate-500">Profile</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAccounts.length > 0 ? (
                                            filteredAccounts.map((acc) => (
                                                <TableRow key={acc.reference} className="hover:bg-slate-50 transition-colors group">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-slate-900">{acc.member?.first_name} {acc.member?.last_name}</span>
                                                            <span className="text-xs text-slate-500 font-mono">{acc.account_number}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-slate-700">{acc.fee_type}</span>
                                                    </TableCell>
                                                    <TableCell className="text-center text-slate-800 font-mono text-sm">
                                                        {Number(acc.outstanding_balance).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${Number(acc.outstanding_balance) === 0
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-rose-50 text-rose-700"
                                                            }`}>
                                                            {Number(acc.outstanding_balance) === 0 ? "FULLY PAID" : "OWING"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <Link href={`/sacco-admin/members/${acc.member?.id}`}>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[#174271] hover:bg-slate-100 border-transparent border">
                                                                <Users className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-24 text-slate-300 font-bold uppercase tracking-[0.2em] text-sm">
                                                    No fee accounts found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bulk Form Tab */}
                <TabsContent value="bulk-create" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none bg-transparent">
                        <CardContent className="p-0">
                            <BulkFeePaymentCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk-upload" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none bg-white rounded p-8 mt-4">
                        <CardContent className="p-0">
                            <BulkFeePaymentUploadCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
