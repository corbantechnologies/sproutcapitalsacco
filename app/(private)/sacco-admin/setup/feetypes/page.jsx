"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchFeeTypes } from "@/hooks/feetypes/actions";
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
    BadgePercent,
    Pencil,
    Plus,
    FileUp,
    ListFilter,
    CheckCircle2
} from "lucide-react";

import CreateFeeTypeModal from "@/forms/feetypes/CreateFeeType";
import UpdateFeeTypeModal from "@/forms/feetypes/UpdateFeeType";
import BulkFeeTypeCreate from "@/forms/feetypes/BulkFeeTypeCreate";
import BulkFeeTypeUploadCreate from "@/forms/feetypes/BulkFeeTypeUploadCreate";

export default function FeeTypesSetupPage() {
    const router = useRouter();
    const { data: myself } = useFetchMember();
    const {
        data: feetypes,
        isLoading,
        refetch
    } = useFetchFeeTypes();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);

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
                        <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <BadgePercent className="w-6 h-6 text-[#174271]" /> Fee Management Setup
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Define registration, insurance, and other SACCO service fees.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#174271] hover:bg-[#12345a] text-white text-xs  shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" /> New Fee Type
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-white border p-1 h-12 shadow-sm mb-6 rounded">
                    <TabsTrigger value="list" className="px-8 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271]  text-xs uppercase tracking-widest transition-all">
                        <ListFilter className="w-4 h-4 mr-2" /> Current Fees
                    </TabsTrigger>
                    <TabsTrigger value="bulk-create" className="px-8 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271]  text-xs uppercase tracking-widest transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Batch Entry
                    </TabsTrigger>
                    <TabsTrigger value="bulk-upload" className="px-8 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271]  text-xs uppercase tracking-widest transition-all">
                        <FileUp className="w-4 h-4 mr-2" /> Import CSV
                    </TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none overflow-hidden rounded">
                        <CardHeader className="bg-white border-b px-6 py-4">
                            <CardTitle className="text-lg  text-slate-800">Fee Inventory</CardTitle>
                            <CardDescription className="text-xs">Total defined fees: {feetypes?.length || 0}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="text-xs  uppercase tracking-widest text-slate-500 pl-6 px-4 py-4">Fee Description</TableHead>
                                            <TableHead className="text-xs  uppercase tracking-widest text-slate-500 px-4 py-4 text-center">Amount (KES)</TableHead>
                                            <TableHead className="text-xs  uppercase tracking-widest text-slate-500 px-4 py-4">Global?</TableHead>
                                            <TableHead className="text-xs  uppercase tracking-widest text-slate-500 px-4 py-4">Accounting (GL)</TableHead>
                                            <TableHead className="text-xs  uppercase tracking-widest text-slate-500 px-4 py-4 text-center">Status</TableHead>
                                            <TableHead className="text-xs  uppercase tracking-widest text-slate-500 text-right pr-6 px-4 py-4">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {feetypes?.length > 0 ? (
                                            feetypes.map((fee) => (
                                                <TableRow key={fee.reference} className="hover:bg-slate-50 transition-colors group border-b border-slate-50">
                                                    <TableCell className="text-sm  pl-6 py-5 text-slate-900">{fee.name}</TableCell>
                                                    <TableCell className="text-sm  text-slate-800 font-mono text-center">
                                                        {Number(fee.amount).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {fee.is_everyone ? (
                                                            <div className="flex items-center gap-1.5 text-[#174271]  text-[10px] uppercase">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> YES
                                                            </div>
                                                        ) : (
                                                            <div className="text-slate-300 font-medium text-[10px] uppercase">NO</div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-[11px] font-medium text-slate-500 italic max-w-[150px] truncate">{fee.gl_account}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`px-2.5 py-1 rounded text-[10px]  er shadow-sm ${fee.is_active ? "bg-green-100 text-green-700 border border-green-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                                                            }`}>
                                                            {fee.is_active ? "ACTIVE" : "INACTIVE"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-5">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-300 hover:text-[#174271] hover:bg-white rounded transition-all border border-transparent hover:border-slate-200 shadow-none"
                                                            onClick={() => {
                                                                setSelectedFee(fee);
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
                                                <TableCell colSpan={6} className="text-center h-48 text-slate-400 text-sm font-medium italic py-12">
                                                    No fee types defined yet.
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
                <TabsContent value="bulk-create" className="animate-in fade-in zoom-in-95 duration-200 border-none">
                    <BulkFeeTypeCreate onBatchSuccess={refetch} />
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk-upload" className="animate-in fade-in zoom-in-95 duration-200">
                    <Card className="shadow-sm border-none bg-white rounded p-8">
                        <CardContent className="p-0">
                            <BulkFeeTypeUploadCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <CreateFeeTypeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                refetchFeeTypes={refetch}
            />
            <UpdateFeeTypeModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                refetchFeeTypes={refetch}
                feeType={selectedFee}
            />
        </div>
    );
}
