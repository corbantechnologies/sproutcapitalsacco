"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchSavings } from "@/hooks/savings/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    ChevronLeft,
    ChevronRight,
    Eye,
    TrendingUp,
    Search
} from "lucide-react";

import CreateDepositAdmin from "@/forms/savingsdeposits/CreateDepositAdmin";

const TableSkeleton = ({ rows = 5, cols = 6 }) => {
    return (
        <div className="border border-slate-100 rounded overflow-hidden bg-white">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        {Array.from({ length: cols }).map((_, i) => (
                            <TableHead key={i}>
                                <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: cols }).map((_, colIndex) => (
                                <TableCell key={colIndex}>
                                    <div
                                        className="h-4 bg-slate-200 rounded animate-pulse"
                                        style={{ width: `${Math.floor(((rowIndex + colIndex) % 5) * 10) + 40}%` }}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default function SavingAccountsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const { 
        data: savingsData, 
        isLoading, 
        refetch 
    } = useFetchSavings({ 
        page,
        search: searchTerm || undefined,
        is_active: statusFilter === "all" ? undefined : (statusFilter === "active" ? "true" : "false")
    });
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const savings = savingsData?.results || [];
    const totalCount = savingsData?.count || 0;
    const pageSize = 10; // Assuming 10 per page
    const totalPages = Math.ceil(totalCount / pageSize);

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        setPage(1);
    };

    const handleStatusChange = (val) => {
        setStatusFilter(val);
        setPage(1);
    };

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
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                            <PiggyBank className="w-6 h-6 text-[#174271]" /> Savings Accounts
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">
                            Manage member savings accounts, view balances, and review transaction history.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#174271] hover:bg-[#12345a] text-white text-xs font-semibold px-6 h-10 shadow-lg shadow-blue-100"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Single Deposit
                    </Button>
                </div>
            </div>

            {/* Filters and List */}
            <Card className="shadow-sm border-none overflow-hidden">
                <CardHeader className="bg-white border-b px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-semibold">Member Savings Accounts</CardTitle>
                            <CardDescription className="text-xs font-medium">A comprehensive list of all savings accounts in the SACCO.</CardDescription>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded w-fit">
                            Total: {totalCount} Accounts
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search" className="sr-only">Search Accounts</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    id="search"
                                    placeholder="Search by member name or account number..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 border-black rounded text-base"
                                />
                            </div>
                        </div>
                        <div className="w-full sm:w-48">
                            <Label htmlFor="status-filter" className="sr-only">Filter by Status</Label>
                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="w-full border border-black rounded px-3 py-2 text-base focus:ring-2 transition-colors"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Table View */}
                    {isLoading ? (
                        <TableSkeleton rows={8} cols={6} />
                    ) : (
                        <>
                            <div className="overflow-x-auto border border-slate-100 rounded">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 pl-6 px-4 py-3">Member Details</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Account Number</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Account Type</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3 text-right">Current Balance</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3">Status</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-right pr-6 px-4 py-3">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {savings?.length > 0 ? (
                                            savings.map((acc) => (
                                                <TableRow key={acc.reference} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-slate-900 uppercase">{acc.member_name}</span>
                                                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-tighter">Member Name</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-sm font-mono text-[#174271] font-semibold bg-blue-50 px-2 py-1 rounded">
                                                            {acc.account_number}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
                                                            {acc.account_type}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right py-4 font-semibold text-slate-900">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-sm font-mono tracking-tighter">
                                                                KES {parseFloat(acc.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded ${acc.is_active ? "bg-emerald-500" : "bg-slate-300"}`} />
                                                            <span className={`text-[11px] font-semibold uppercase tracking-wider ${acc.is_active ? "text-emerald-600" : "text-slate-500"}`}>
                                                                {acc.is_active ? "Active" : "Inactive"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 rounded transition-all"
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
                                                                className="h-8 w-8 text-slate-400 hover:text-[#174271] hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded transition-all"
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
                                <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t rounded-b">
                                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                                        Showing Page {page} of {totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page === 1}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            className="h-8 text-[11px] font-semibold uppercase tracking-wider"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            className="h-8 text-[11px] font-semibold uppercase tracking-wider"
                                        >
                                            Next <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Single Deposit Modal */}
            <CreateDepositAdmin
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setSelectedAccount(null);
                }}
                refetchMember={refetch}
                accounts={savings} 
            />
        </div>
    );
}
