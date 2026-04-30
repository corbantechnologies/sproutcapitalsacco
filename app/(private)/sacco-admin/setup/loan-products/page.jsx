"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
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
    HandCoins,
    Pencil,
    Plus,
    FileUp,
    ListFilter,
    Settings
} from "lucide-react";

import CreateLoanProductModal from "@/forms/loanproducts/CreateLoanProduct";
import UpdateLoanProductModal from "@/forms/loanproducts/UpdateLoanProduct";
import BulkLoanProductCreate from "@/forms/loanproducts/BulkLoanProductCreate";
import BulkLoanProductUploadCreate from "@/forms/loanproducts/BulkLoanProductUploadCreate";

export default function LoanProductsSetupPage() {
    const router = useRouter();
    const { data: myself } = useFetchMember();
    const {
        data: loanProducts,
        isLoading,
        refetch
    } = useFetchLoanProducts();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/sacco-admin/setup")}
                        className="rounded hover:bg-white text-slate-400 hover:text-[#174271] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <HandCoins className="w-6 h-6 text-[#174271]" /> Loan Product Configuration
                        </h1>
                        <p className="text-slate-500 text-sm italic">
                            Establish loan types, interest computation methods, and risk fees.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#174271] hover:bg-[#12345a] text-white text-xs font-semibold shadow-sm rounded h-10 px-5"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> New Loan Scheme
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="list">
                <TabsList className="bg-white border p-1 shadow-sm mb-6 w-full h-auto rounded-xl grid grid-cols-3 gap-1 overflow-hidden">
                    <TabsTrigger
                        value="list"
                        className="flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium transition-all rounded-lg data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] data-[state=active]:shadow-sm"
                    >
                        <ListFilter className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Schemes</span>
                        <span className="sm:hidden">Schemes</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="bulk-create"
                        className="flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium transition-all rounded-lg data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] data-[state=active]:shadow-sm"
                    >
                        <Plus className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Bulk Entry</span>
                        <span className="sm:hidden">Bulk</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="bulk-upload"
                        className="flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium transition-all rounded-lg data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] data-[state=active]:shadow-sm"
                    >
                        <FileUp className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden md:inline">Bulk Upload</span>
                        <span className="md:hidden">Upload</span>
                    </TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none overflow-hidden rounded">
                        <CardHeader className="bg-white border-b px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-slate-800">Available Loan Facilities</CardTitle>
                            <CardDescription className="text-xs">System Registered Schemes: {loanProducts?.length || 0}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product Description</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Interest / Fee</TableHead>
                                            <TableHead>Ledger Tracking</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loanProducts?.length > 0 ? (
                                            loanProducts.map((p) => (
                                                <TableRow key={p.reference} className="hover:bg-slate-50 transition-colors group border-b border-slate-50">
                                                    <TableCell>{p.name}</TableCell>
                                                    <TableCell>
                                                        {p.interest_method}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className="text-sm font-semibold text-green-700 font-mono">{p.interest_rate}%</span>
                                                            <span className="text-slate-200">|</span>
                                                            <span className="text-sm font-semibold text-amber-600 font-mono">{p.processing_fee}%</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {p.gl_principal_asset}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-400 hover:text-[#174271] hover:bg-white border-transparent hover:border-slate-200 border rounded transition-all"
                                                            onClick={() => {
                                                                setSelectedProduct(p);
                                                                setIsUpdateModalOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center h-48 text-slate-400 text-sm italic py-12">
                                                    No loan products found.
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
                <TabsContent value="bulk-create" className="animate-in fade-in zoom-in-95 duration-200">
                    <BulkLoanProductCreate onBatchSuccess={refetch} />
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk-upload" className="animate-in fade-in zoom-in-95 duration-200">
                    <Card className="shadow-sm border-none bg-white rounded p-8">
                        <CardContent className="p-0">
                            <BulkLoanProductUploadCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <CreateLoanProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                refetchLoanTypes={refetch}
            />
            <UpdateLoanProductModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                refetchLoanTypes={refetch}
                loanProduct={selectedProduct}
            />
        </div>
    );
}
