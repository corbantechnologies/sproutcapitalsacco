"use client";

import React, { useState } from "react";
import { useFetchMember, useFetchMembers } from "@/hooks/members/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
import { useFetchVentureTypes } from "@/hooks/venturetypes/actions";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Wallet,
  CreditCard,
  TrendingUp,
  Plus,
  Loader2,
  ChevronDown,
  User,
  UsersRound,
  FileUp,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SaccoMembersTable from "@/components/members/SaccoMembersTable";
import CreateMember from "@/forms/members/CreateMember";
import BulkMemberCreate from "@/forms/members/BulkMemberCreate";
import BulkMemberUploadCreate from "@/forms/members/BulkMemberUploadCreate";
import CreateSavingTypeModal from "@/forms/savingtypes/CreateSavingType";
import CreateLoanProduct from "@/forms/loanproducts/CreateLoanProduct";
import CreateVentureType from "@/forms/venturetypes/CreateVentureType";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { downloadBulkMembersTemplate } from "@/services/members";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

export default function SaccoAdminDashboard() {
  const token = useAxiosAuth()
  const { data: myself, isLoading: isLoadingMyself } = useFetchMember();
  const {
    data: members,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = useFetchMembers();
  const {
    data: savingTypes,
    isLoading: isLoadingSavingTypes,
    refetch: refetchSavingTypes,
  } = useFetchSavingsTypes();
  const {
    data: loanProducts,
    isLoading: isLoadingLoanProducts,
    refetch: refetchLoanProducts,
  } = useFetchLoanProducts();
  const {
    data: ventureTypes,
    isLoading: isLoadingVentureTypes,
    refetch: refetchVentureTypes,
  } = useFetchVentureTypes();

  const [createMemberOpen, setCreateMemberOpen] = useState(false);
  const [bulkMemberCreateOpen, setBulkMemberCreateOpen] = useState(false);
  const [bulkMemberUploadOpen, setBulkMemberUploadOpen] = useState(false);
  const [memberPopoverOpen, setMemberPopoverOpen] = useState(false);
  const [createSavingTypeOpen, setCreateSavingTypeOpen] = useState(false);
  const [createLoanProductOpen, setCreateLoanProductOpen] = useState(false);
  const [createVentureTypeOpen, setCreateVentureTypeOpen] = useState(false);

  if (
    isLoadingMyself ||
    isLoadingMembers ||
    isLoadingSavingTypes ||
    isLoadingLoanProducts ||
    isLoadingVentureTypes
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            Manage members, products, and configurations.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded border shadow-sm">
          <p className="text-sm font-medium text-gray-900">
            {myself?.salutation} {myself?.last_name} (Admin)
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#174271]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Members
            </CardTitle>
            <Users className="h-4 w-4 text-[#174271]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {members?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saving Types
            </CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingTypes?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Loan Products
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loanProducts?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Venture Types
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ventureTypes?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px] h-auto bg-white border">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="savings">Saving Types</TabsTrigger>
          <TabsTrigger value="loans">Loan Products</TabsTrigger>
          <TabsTrigger value="ventures">Venture Types</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="pt-6">
          <div className="flex justify-end mb-4">
            <Popover open={memberPopoverOpen} onOpenChange={setMemberPopoverOpen}>
              <PopoverTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" /> Add Member <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => {
                      setCreateMemberOpen(true);
                      setMemberPopoverOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" /> Single Member
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => {
                      setBulkMemberCreateOpen(true);
                      setMemberPopoverOpen(false);
                    }}
                  >
                    <UsersRound className="mr-2 h-4 w-4" /> Bulk Member Form
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => {
                      setBulkMemberUploadOpen(true);
                      setMemberPopoverOpen(false);
                    }}
                  >
                    <FileUp className="mr-2 h-4 w-4" /> Bulk CSV Upload
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={async () => {
                      try {
                        const response = await downloadBulkMembersTemplate(token);

                        // Extract filename from Content-Disposition if available, or default to template.csv
                        const contentDisposition = response.headers['content-disposition'];
                        let filename = "bulk_members_template.csv";
                        if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
                          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                          const matches = filenameRegex.exec(contentDisposition);
                          if (matches != null && matches[1]) {
                            filename = matches[1].replace(/['"]/g, '');
                          }
                        }

                        // Create a Blob from the CSV data
                        const blob = new Blob([response.data], { type: 'text/csv' });
                        // Create an object URL from the Blob
                        const url = window.URL.createObjectURL(blob);
                        // Create a temporary link element
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', filename);
                        // Append to the body, click, and remove
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // Clean up the URL object
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Download failed", error);
                      }
                    }}
                  >
                    <FileUp className="mr-2 h-4 w-4" /> Download CSV Template
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <SaccoMembersTable members={members} />
        </TabsContent>

        {/* Saving Types Tab */}
        <TabsContent value="savings" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Saving Types</CardTitle>
              <Button
                size="sm"
                onClick={() => setCreateSavingTypeOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Type
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {savingTypes?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Can Guarantee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savingTypes.map((type) => (
                      <TableRow key={type.id || type.reference}>
                        <TableCell className="font-medium">
                          {type.name}
                        </TableCell>
                        <TableCell>{type.interest_rate}%</TableCell>
                        <TableCell>{type.description || "-"}</TableCell>
                        <TableCell>
                          {type.can_guarantee ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No saving types found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loan Products Tab */}
        <TabsContent value="loans" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Loan Products</CardTitle>
              <Button
                size="sm"
                onClick={() => setCreateLoanProductOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Product
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {loanProducts?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Interest Method</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanProducts.map((product) => (
                      <TableRow key={product.id || product.reference}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.interest_method}</TableCell>
                        <TableCell>{product.interest_rate}%</TableCell>
                        <TableCell>{product.description || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No loan products found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Venture Types Tab */}
        <TabsContent value="ventures" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Venture Types</CardTitle>
              <Button
                size="sm"
                onClick={() => setCreateVentureTypeOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Type
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {ventureTypes?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ventureTypes.map((type) => (
                      <TableRow key={type.id || type.reference}>
                        <TableCell className="font-medium">
                          {type.name}
                        </TableCell>
                        <TableCell>{type.interest_rate}%</TableCell>
                        <TableCell>{type.description || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No venture types found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateMember
        openModal={createMemberOpen}
        closeModal={() => {
          setCreateMemberOpen(false);
          refetchMembers();
        }}
      />
      <BulkMemberCreate
        openModal={bulkMemberCreateOpen}
        closeModal={() => {
          setBulkMemberCreateOpen(false);
          refetchMembers();
        }}
      />
      <BulkMemberUploadCreate
        openModal={bulkMemberUploadOpen}
        closeModal={() => {
          setBulkMemberUploadOpen(false);
          refetchMembers();
        }}
      />
      <CreateSavingTypeModal
        isOpen={createSavingTypeOpen}
        onClose={() => setCreateSavingTypeOpen(false)}
        refetchSavingTypes={refetchSavingTypes}
      />
      <CreateLoanProduct
        isOpen={createLoanProductOpen}
        onClose={() => setCreateLoanProductOpen(false)}
        refetchLoanTypes={refetchLoanProducts}
      />
      <CreateVentureType
        isOpen={createVentureTypeOpen}
        onClose={() => setCreateVentureTypeOpen(false)}
        refetchVentureTypes={refetchVentureTypes}
      />
    </div>
  );
}
