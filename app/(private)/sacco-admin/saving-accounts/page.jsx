"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchSavings } from "@/hooks/savings/actions";
import { useFetchMember } from "@/hooks/members/actions";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    PiggyBank,
    Plus,
    FileUp,
    ListFilter,
    ChevronLeft,
    ChevronRight,
    Eye,
    TrendingUp
} from "lucide-react";

import CreateDepositAdmin from "@/forms/savingsdeposits/CreateDepositAdmin";
import BulkSavingDepositCreate from "@/forms/savingsdeposits/BulkSavingDepositCreate";
import BulkSavingDepositUploadCreate from "@/forms/savingsdeposits/BulkSavingDepositUploadCreate";

export default function SavingDepositsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { 
        data: savingsData, 
        isLoading, 
        refetch 
    } = useFetchSavings({ page });
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const savings = savingsData?.results || [];
    const totalCount = savingsData?.count || 0;
    const pageSize = 10; // Assuming 10 per page
    const totalPages = Math.ceil(totalCount / pageSize);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded hover:bg-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            <PiggyBank className="w-6 h-6 text-[#174271]" /> Savings & Deposits
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">
                            Manage member savings accounts and process deposit transactions.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#174271] hover:bg-[#12345a] text-white text-xs font-bold px-6 h-10 shadow-lg shadow-blue-100"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Single Deposit
                    </Button>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-white border p-1 h-12 shadow-sm mb-6">
                    <TabsTrigger value="list" className="px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] font-bold text-xs uppercase tracking-wider">
                        <ListFilter className="w-4 h-4 mr-2" /> All Accounts
                    </TabsTrigger>
                    <TabsTrigger value="bulk-create" className="px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] font-bold text-xs uppercase tracking-wider">
                        <Plus className="w-4 h-4 mr-2" /> Multi-Form Deposit
                    </TabsTrigger>
                    <TabsTrigger value="bulk-upload" className="px-6 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] font-bold text-xs uppercase tracking-wider">
                        <FileUp className="w-4 h-4 mr-2" /> Bulk CSV Upload
                    </TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none overflow-hidden">
                        <CardHeader className="bg-white border-b px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg font-bold">Member Savings Accounts</CardTitle>
                                    <CardDescription className="text-xs font-medium">A comprehensive list of all active saving accounts in the SACCO.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                    Total: {totalCount} Accounts
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-6 px-4 py-3">Member Details</TableHead>
                                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 px-4 py-3">Account Number</TableHead>
                                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 px-4 py-3">Account Type</TableHead>
                                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 px-4 py-3 text-right">Current Balance</TableHead>
                                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 px-4 py-3">Status</TableHead>
                                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right pr-6 px-4 py-3">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {savings?.length > 0 ? (
                                            savings.map((acc) => (
                                                <TableRow key={acc.reference} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-900 uppercase">{acc.member_name}</span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Member Name</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-sm font-mono text-[#174271] font-bold bg-blue-50 px-2 py-1 rounded">
                                                            {acc.account_number}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
                                                            {acc.account_type}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right py-4 font-bold text-slate-900">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-sm font-mono tracking-tighter">
                                                                KES {parseFloat(acc.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${acc.is_active ? "bg-emerald-500" : "bg-slate-300"}`} />
                                                            <span className={`text-[11px] font-bold uppercase tracking-wider ${acc.is_active ? "text-emerald-600" : "text-slate-500"}`}>
                                                                {acc.is_active ? "Active" : "Inactive"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 rounded-md transition-all"
                                                                onClick={() => {
                                                                    setSelectedAccount(acc);
                                                                    setIsCreateModalOpen(true);
                                                                }}
                                                                title="Direct Deposit"
                                                            >
                                                                <TrendingUp className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-[#174271] hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-md transition-all"
                                                                onClick={() => router.push(`/sacco-admin/saving-accounts/${acc.reference}`)}
                                                                title="View Transactions"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center h-64 text-slate-400 text-sm font-medium">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <PiggyBank className="w-12 h-12 text-slate-100" />
                                                        No savings accounts found.
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t">
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        Showing Page {page} of {totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page === 1}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            className="h-8 text-[11px] font-bold uppercase tracking-wider"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            className="h-8 text-[11px] font-bold uppercase tracking-wider"
                                        >
                                            Next <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bulk Form Tab */}
                <TabsContent value="bulk-create" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none bg-white p-6 rounded-xl">
                        <CardContent className="p-0">
                            <BulkSavingDepositCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk-upload" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none bg-white rounded-xl p-8">
                        <CardContent className="p-0">
                            <BulkSavingDepositUploadCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Single Deposit Modal */}
            <CreateDepositAdmin
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setSelectedAccount(null);
                }}
                refetchMember={refetch}
                // If an account is selected, pass it as the single option or part of options
                // The form expects an array of accounts
                accounts={savings} 
                // We might want to pre-select if selectedAccount is set, 
                // but the formik initial values would need to handle that inside CreateDepositAdmin.
            />
        </div>
    );
}
