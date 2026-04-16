"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchMember } from "@/hooks/members/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
import { useFetchGLAccounts } from "@/hooks/glaccounts/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import { useFetchFeeTypes } from "@/hooks/feetypes/actions";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    CheckCircle2,
    Circle,
    ArrowRight,
    Building2,
    Wallet,
    PiggyBank,
    HandCoins,
    AlertCircle,
    BadgePercent,
    Settings2,
    ListFilter,
    Plus
} from "lucide-react";

import CreateGLAccountModal from "@/forms/glaccounts/CreateGLAccount";
import CreatePaymentAccountModal from "@/forms/paymentaccounts/CreatePaymentAccount";
import CreateFeeTypeModal from "@/forms/feetypes/CreateFeeType";
import CreateSavingTypeModal from "@/forms/savingtypes/CreateSavingType";
import CreateLoanProductModal from "@/forms/loanproducts/CreateLoanProduct";

export default function SetupPage() {
    const router = useRouter();
    const { data: myself, isLoading: isLoadingMyself } = useFetchMember();
    const { data: glaccounts, isLoading: isLoadingGLAccounts, refetch: refetchGL } = useFetchGLAccounts();
    const { data: paymentaccounts, isLoading: isLoadingPaymentAccounts, refetch: refetchPayment } = useFetchPaymentAccounts();
    const { data: feetypes, isLoading: isLoadingFeeTypes, refetch: refetchFees } = useFetchFeeTypes();
    const { data: savingTypes, isLoading: isLoadingSavingTypes, refetch: refetchSavings } = useFetchSavingsTypes();
    const { data: loanProducts, isLoading: isLoadingLoanProducts, refetch: refetchLoans } = useFetchLoanProducts();

    // Modal States
    const [isCreateGLModalOpen, setIsCreateGLModalOpen] = useState(false);
    const [isCreatePaymentModalOpen, setIsCreatePaymentModalOpen] = useState(false);
    const [isCreateFeeModalOpen, setIsCreateFeeModalOpen] = useState(false);
    const [isCreateSavingModalOpen, setIsCreateSavingModalOpen] = useState(false);
    const [isCreateLoanModalOpen, setIsCreateLoanModalOpen] = useState(false);

    if (
        isLoadingMyself ||
        isLoadingGLAccounts ||
        isLoadingPaymentAccounts ||
        isLoadingFeeTypes ||
        isLoadingSavingTypes ||
        isLoadingLoanProducts
    ) {
        return <LoadingSpinner />;
    }

    const glSetupDone = glaccounts?.length > 0;
    const paymentSetupDone = paymentaccounts?.length > 0;
    const mandatorySetupDone = glSetupDone && paymentSetupDone;

    const setupSteps = [
        {
            title: "GL Accounts",
            description: "Chart of Accounts",
            icon: Building2,
            done: glSetupDone,
            href: "/sacco-admin/setup/gl-accounts",
            mandatory: true,
        },
        {
            title: "Payment Accounts",
            description: "Bank & Cash",
            icon: Wallet,
            done: paymentSetupDone,
            href: "/sacco-admin/setup/payment-accounts",
            mandatory: true,
            disabled: !glSetupDone,
        },
        {
            title: "Fee Types",
            description: "Service Fees",
            icon: BadgePercent,
            done: feetypes?.length > 0,
            href: "/sacco-admin/setup/feetypes",
            disabled: !mandatorySetupDone,
        },
        {
            title: "Savings Products",
            description: "Deposit Schemes",
            icon: PiggyBank,
            done: savingTypes?.length > 0,
            href: "/sacco-admin/setup/saving-types",
            disabled: !mandatorySetupDone,
        },
        {
            title: "Loan Products",
            description: "Loan Facilities",
            icon: HandCoins,
            done: loanProducts?.length > 0,
            href: "/sacco-admin/setup/loan-products",
            disabled: !mandatorySetupDone,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        SACCO Configuration Hub
                    </h1>
                    <p className="text-black text-sm">
                        Centralize management of your financial foundation and products.
                    </p>
                </div>
                
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="bg-[#174271] hover:bg-slate-800 text-white gap-2 font-bold shadow-sm rounded">
                             <Plus className="w-4 h-4" /> Quick Create
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-1 rounded shadow-xl border-slate-200" align="end">
                         <div className="grid gap-0.5">
                             <Button variant="ghost" className="justify-start text-xs h-9 font-semibold text-slate-700 hover:text-[#174271] hover:bg-slate-50" onClick={() => setIsCreateGLModalOpen(true)}>
                                 <Building2 className="w-4 h-4 mr-2 opacity-70" /> GL Account
                             </Button>
                             <Button variant="ghost" className="justify-start text-xs h-9 font-semibold text-slate-700 hover:text-[#174271] hover:bg-slate-50" onClick={() => setIsCreatePaymentModalOpen(true)}>
                                 <Wallet className="w-4 h-4 mr-2 opacity-70" /> Payment Account
                             </Button>
                             <Button variant="ghost" className="justify-start text-xs h-9 font-semibold text-slate-700 hover:text-[#174271] hover:bg-slate-50" onClick={() => setIsCreateFeeModalOpen(true)} disabled={!mandatorySetupDone}>
                                 <BadgePercent className="w-4 h-4 mr-2 opacity-70" /> Fee Type
                             </Button>
                             <Button variant="ghost" className="justify-start text-xs h-9 font-semibold text-slate-700 hover:text-[#174271] hover:bg-slate-50" onClick={() => setIsCreateSavingModalOpen(true)} disabled={!mandatorySetupDone}>
                                 <PiggyBank className="w-4 h-4 mr-2 opacity-70" /> Saving Type
                             </Button>
                             <Button variant="ghost" className="justify-start text-xs h-9 font-semibold text-slate-700 hover:text-[#174271] hover:bg-slate-50" onClick={() => setIsCreateLoanModalOpen(true)} disabled={!mandatorySetupDone}>
                                 <HandCoins className="w-4 h-4 mr-2 opacity-70" /> Loan Product
                             </Button>
                         </div>
                    </PopoverContent>
                </Popover>
            </div>

            {!mandatorySetupDone && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-bold text-amber-900 uppercase tracking-tight">Initial Setup Required</h3>
                        <p className="text-xs text-amber-700 font-medium">
                            Configure General Ledger and Payment Accounts first to unlock service fees and financial products.
                        </p>
                    </div>
                </div>
            )}

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {setupSteps.map((step, idx) => (
                    <Card
                        key={idx}
                        className={`${step.disabled ? "opacity-40 cursor-not-allowed" : "hover:border-[#174271] cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"} shadow-sm bg-white overflow-hidden group`}
                        onClick={() => !step.disabled && router.push(step.href)}
                    >
                        <CardHeader className="p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <div className={`p-2 rounded ${step.done ? "bg-green-50 text-green-600" : "bg-slate-50 text-black"}`}>
                                    <step.icon className="w-5 h-5" />
                                </div>
                                {step.done ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Circle className="w-4 h-4 text-slate-200" />
                                )}
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold text-black">{step.title}</CardTitle>
                                <CardDescription className="text-[10px]  text-black truncate">{step.description}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Unified Inventory Dashboard (RESTORED TABS & TABLES) */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-black" />
                    <h2 className="text-sm font-bold text-black ">Configuration Inventory</h2>
                </div>

                <Tabs defaultValue="gl" className="w-full">
                    <TabsList className="bg-white border p-1 h-12 shadow-sm rounded mb-6 flex overflow-x-auto no-scrollbar">
                        <TabsTrigger value="gl" className="flex-1 px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] text-sm ">
                            GL Summary
                        </TabsTrigger>
                        <TabsTrigger value="payment" className="flex-1 px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] text-sm ">
                            Payment Methods
                        </TabsTrigger>
                        <TabsTrigger value="fees" className="flex-1 px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] text-sm ">
                            Fee Types
                        </TabsTrigger>
                        <TabsTrigger value="savings" className="flex-1 px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] text-sm ">
                            Saving Types
                        </TabsTrigger>
                        <TabsTrigger value="loans" className="flex-1 px-4 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] text-sm ">
                            Loan Products
                        </TabsTrigger>
                    </TabsList>

                    {/* GL Accounts Summary */}
                    <TabsContent value="gl" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Card className="shadow-sm border-none overflow-hidden rounded">
                            <CardHeader className="bg-white border-b px-6 pt-5 pb-3 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-bold text-black uppercase tracking-tight">Active Chart of Accounts</CardTitle>
                                    <CardDescription className="text-xs">Summary of your general ledger categories.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" className="text-[10px] h-8 font-bold " onClick={() => router.push("/sacco-admin/setup/gl-accounts")}>
                                    FULL SETUP <ArrowRight className="ml-2 w-3 h-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="text-[10px] font-bold  pl-6">Name</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Code</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Category</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Balance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {glaccounts?.slice(0, 5).map((acc) => (
                                            <TableRow key={acc.reference} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                                                <TableCell className="text-xs font-bold pl-6 py-4">{acc.name}</TableCell>
                                                <TableCell className="text-xs font-mono">{acc.code}</TableCell>
                                                <TableCell className="text-[10px] font-bold uppercase text-black">{acc.category}</TableCell>
                                                <TableCell className="text-xs font-bold text-slate-900 font-mono tracking-tighter">KES {Number(acc.balance).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payment Accounts Tab */}
                    <TabsContent value="payment" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Card className="shadow-sm border-none overflow-hidden rounded">
                            <CardHeader className="bg-white border-b px-6 pt-5 pb-3 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-bold text-black uppercase tracking-tight">Payment Wallets</CardTitle>
                                    <CardDescription className="text-xs">Cash and Bank accounts linked to the GL.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" className="text-[10px] h-8 font-bold " onClick={() => router.push("/sacco-admin/setup/payment-accounts")}>
                                    FULL SETUP <ArrowRight className="ml-2 w-3 h-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="text-[10px] font-bold  pl-6">Wallet Name</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Link Ledger</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paymentaccounts?.map((acc) => (
                                            <TableRow key={acc.reference} className="hover:bg-slate-50 border-b border-slate-50">
                                                <TableCell className="text-xs font-bold pl-6 py-4">{acc.name}</TableCell>
                                                <TableCell className="text-xs font-medium text-black italic">{acc.gl_account}</TableCell>
                                                <TableCell className="text-[10px] font-bold tracking-tighter">
                                                    <span className={acc.is_active ? "text-green-600" : "text-black"}>
                                                        {acc.is_active ? "ACTIVE" : "INACTIVE"}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Fee Types Tab */}
                    <TabsContent value="fees" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Card className="shadow-sm border-none overflow-hidden rounded">
                            <CardHeader className="bg-white border-b px-6 pt-5 pb-3 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-bold text-black uppercase tracking-tight">Active Charges & Fees</CardTitle>
                                    <CardDescription className="text-xs">Registration, Service, and Insurance fees.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" className="text-[10px] h-8 font-bold " onClick={() => router.push("/sacco-admin/setup/feetypes")}>
                                    FULL SETUP <ArrowRight className="ml-2 w-3 h-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="text-[10px] font-bold  pl-6">Fee Name</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Amount</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Global</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {feetypes?.map((fee) => (
                                            <TableRow key={fee.reference} className="hover:bg-slate-50 border-b border-slate-50">
                                                <TableCell className="text-xs font-bold pl-6 py-4">{fee.name}</TableCell>
                                                <TableCell className="text-xs font-bold text-slate-900">KES {Number(fee.amount).toLocaleString()}</TableCell>
                                                <TableCell className="text-[10px] font-bold uppercase text-black">
                                                    {fee.is_everyone ? "Yes" : "No"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Savings Products Tab */}
                    <TabsContent value="savings" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Card className="shadow-sm border-none overflow-hidden rounded">
                            <CardHeader className="bg-white border-b px-6 pt-5 pb-3 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-bold text-black uppercase tracking-tight">Deposit Schemes</CardTitle>
                                    <CardDescription className="text-xs">Configure interest-bearing savings types.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" className="text-[10px] h-8 font-bold " onClick={() => router.push("/sacco-admin/setup/saving-types")}>
                                    FULL SETUP <ArrowRight className="ml-2 w-3 h-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="text-[10px] font-bold  pl-6">Scheme Name</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Interest (APY)</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Guarantee</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {savingTypes?.map((type) => (
                                            <TableRow key={type.reference} className="hover:bg-slate-50 border-b border-slate-50">
                                                <TableCell className="text-xs font-bold pl-6 py-4">{type.name}</TableCell>
                                                <TableCell className="text-xs font-bold text-green-700">{type.interest_rate}%</TableCell>
                                                <TableCell className="text-[10px] font-bold uppercase text-black">
                                                    {type.can_guarantee ? "Allowed" : "Restricted"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Loan Products Tab */}
                    <TabsContent value="loans" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Card className="shadow-sm border-none overflow-hidden rounded">
                            <CardHeader className="bg-white border-b px-6 pt-5 pb-3 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-bold text-black uppercase tracking-tight">Loan Facilities</CardTitle>
                                    <CardDescription className="text-xs">Manage lending terms and rates.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" className="text-[10px] h-8 font-bold " onClick={() => router.push("/sacco-admin/setup/loan-products")}>
                                    FULL SETUP <ArrowRight className="ml-2 w-3 h-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="text-[10px] font-bold  pl-6">Facility Name</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Int Rate</TableHead>
                                            <TableHead className="text-[10px] font-bold ">Proc Fee</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loanProducts?.map((p) => (
                                            <TableRow key={p.reference} className="hover:bg-slate-50 border-b border-slate-50">
                                                <TableCell className="text-sm font-bold pl-6 py-4">{p.name}</TableCell>
                                                <TableCell className="text-xs font-bold text-red-600">{p.interest_rate}%</TableCell>
                                                <TableCell className="text-xs font-bold text-black">{p.processing_fee}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Support Grid */}
            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white border-dashed border-2 p-6 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="bg-slate-50 p-3 rounded">
                        <Settings2 className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-black uppercase tracking-tight">Audit Trail</h4>
                        <p className="text-[11px] text-black px-4">All configuration changes are monitored and logged for financial compliance.</p>
                    </div>
                </Card>
                <Card className="bg-white border-dashed border-2 p-6 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="bg-slate-50 p-3 rounded">
                        <AlertCircle className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-black uppercase tracking-tight">System Health</h4>
                        <p className="text-[11px] text-black px-4">Ensure your GL is balanced before modifying product account linkage.</p>
                    </div>
                </Card>
            </div>

            {/* Creation Modals */}
            <CreateGLAccountModal
                isOpen={isCreateGLModalOpen}
                onClose={() => setIsCreateGLModalOpen(false)}
                refetchGLAccounts={refetchGL}
            />
            <CreatePaymentAccountModal
                isOpen={isCreatePaymentModalOpen}
                onClose={() => setIsCreatePaymentModalOpen(false)}
                refetchPaymentAccounts={refetchPayment}
            />
            <CreateFeeTypeModal
                isOpen={isCreateFeeModalOpen}
                onClose={() => setIsCreateFeeModalOpen(false)}
                refetchFeeTypes={refetchFees}
            />
            <CreateSavingTypeModal
                isOpen={isCreateSavingModalOpen}
                onClose={() => setIsCreateSavingModalOpen(false)}
                refetchSavingTypes={refetchSavings}
            />
            <CreateLoanProductModal
                isOpen={isCreateLoanModalOpen}
                onClose={() => setIsCreateLoanModalOpen(false)}
                refetchLoanTypes={refetchLoans}
            />
        </div>
    );
}
