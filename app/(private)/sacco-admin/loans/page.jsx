"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFetchLoans } from "@/hooks/loans/actions";
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
    HandCoins,
    Eye,
    ArrowUpRight,
    FileUp,
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowLeft,
    ListFilter
} from "lucide-react";
import Link from "next/link";

import BulkLoanDisbursementCreate from "@/forms/loandisbursements/BulkLoanDisbursementCreate";
import BulkLoanDisbursementUploadCreate from "@/forms/loandisbursements/BulkLoanDisbursementUploadCreate";

export default function LoansManagementPage() {
    const router = useRouter();
    const { data: loans, isLoading, refetch } = useFetchLoans();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredLoans = useMemo(() => {
        if (!loans) return [];
        return loans.filter(loan => {
            const matchesSearch =
                loan.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (`${loan.member?.first_name} ${loan.member?.last_name}`).toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || loan.application?.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [loans, searchTerm, statusFilter]);

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
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            <HandCoins className="w-6 h-6 text-[#174271]" /> Loans Portfolio
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">
                            Manage all SACCO loan accounts and disbursements.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border shadow-sm bg-[#174271] text-white rounded-xl">
                    <CardHeader className="p-6">
                        <CardDescription className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Active Accounts</CardDescription>
                        <CardTitle className="text-3xl font-bold tracking-tight">{loans?.length || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border shadow-sm bg-white rounded-xl">
                    <CardHeader className="p-6">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pending Approval</CardDescription>
                        <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">
                            {loans?.filter(l => l.application?.status === 'Pending')?.length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border shadow-sm bg-white rounded-xl">
                    <CardHeader className="p-6">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Approved (Awaiting Funding)</CardDescription>
                        <CardTitle className="text-3xl font-bold tracking-tight text-emerald-600">
                            {loans?.filter(l => l.application?.status === 'Approved')?.length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-white border p-1 h-12 shadow-sm mb-6">
                    <TabsTrigger value="list" className="px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] font-bold text-xs uppercase tracking-wider transition-all">
                        <ListFilter className="w-4 h-4 mr-2" /> List View
                    </TabsTrigger>
                    <TabsTrigger value="bulk-create" className="px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] font-bold text-xs uppercase tracking-wider transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Manual Batch
                    </TabsTrigger>
                    <TabsTrigger value="bulk-upload" className="px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] font-bold text-xs uppercase tracking-wider transition-all">
                        <FileUp className="w-4 h-4 mr-2" /> CSV Upload
                    </TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    {/* Filter Bar */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative group w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#174271] transition-colors" />
                            <Input
                                placeholder="Search by member name or account number..."
                                className="pl-12 h-12 rounded-lg border-slate-100 focus:border-[#174271] bg-slate-50/50 shadow-none border-0 ring-offset-transparent focus-visible:ring-1 focus-visible:ring-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <div className="inline-flex bg-slate-100/50 rounded-lg p-1 gap-1 border border-slate-200/50">
                                {['all', 'Approved', 'Disbursed', 'Pending'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-4 h-9 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === status
                                            ? "bg-white text-[#174271] shadow-sm ring-1 ring-slate-200"
                                            : "text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Loans Table */}
                    <Card className="border shadow-sm rounded-xl overflow-hidden bg-white">
                        <CardHeader className="bg-white border-b px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Active Portfolio</CardTitle>
                                    <CardDescription className="text-xs font-medium text-slate-500 mt-1">A detailed view of all member loan accounts.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 border-b">
                                            <TableHead className="pl-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Account Owner</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Loan Product</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Principal</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Balance</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</TableHead>
                                            <TableHead className="pr-8 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLoans.length > 0 ? (
                                            filteredLoans.map((loan) => (
                                                <TableRow key={loan.reference} className="hover:bg-slate-50/50 transition-all border-b last:border-0 group h-20">
                                                    <TableCell className="pl-8">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-800 text-sm tracking-tight">{loan.member?.first_name} {loan.member?.last_name}</span>
                                                            <span className="text-[11px] font-semibold text-slate-400 font-mono tracking-tight">{loan.account_number}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs font-bold text-[#174271] uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                                                            {loan.product?.name || "Product"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-slate-700 font-mono text-sm leading-none">
                                                        {Number(loan.principal).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-[#ea1315] font-mono text-sm leading-none">
                                                        {Number(loan.balance).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center justify-center gap-1.5 w-fit mx-auto ring-1 ${loan.application?.status === 'Disbursed'
                                                            ? "bg-green-50 text-green-700 ring-green-200"
                                                            : loan.application?.status === 'Approved'
                                                                ? "bg-blue-50 text-blue-700 ring-blue-200 animate-pulse"
                                                                : "bg-slate-50 text-slate-500 ring-slate-200"
                                                            }`}>
                                                            {loan.application?.status === 'Disbursed' ? <CheckCircle2 className="w-3 h-3" /> : loan.application?.status === 'Approved' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                            {loan.application?.status?.toUpperCase() || "PENDING"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pr-8 text-right">
                                                        <Link href={`/sacco-admin/members/${loan.member?.id}/${loan.reference}`}>
                                                            <Button size="icon" variant="ghost" className="rounded-lg hover:bg-white border-transparent hover:border-slate-200 border shadow-none h-9 w-9 transition-all text-slate-400 hover:text-[#174271]">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-24 text-slate-300 font-bold uppercase tracking-[0.2em] text-sm">
                                                    No loan accounts found
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
                    <Card className="shadow-sm border-none bg-transparent pt-4">
                        <CardContent className="p-0">
                            <BulkLoanDisbursementCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk-upload" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none bg-white rounded-xl p-8 mt-4">
                        <CardContent className="p-0">
                            <BulkLoanDisbursementUploadCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
