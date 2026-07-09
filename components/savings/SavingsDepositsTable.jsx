"use client";

import React, { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useUpdateSavingsDeposit, useBulkUpdateSavingsDepositsJSON } from "@/hooks/savingsdeposits/actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Edit, CheckSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

function SavingsDepositsTable({ deposits }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [newDate, setNewDate] = useState("");
  
  const queryClient = useQueryClient();
  const updateDepositMutation = useUpdateSavingsDeposit();
  const bulkUpdateMutation = useBulkUpdateSavingsDepositsJSON();
  const pathname = usePathname();
  const isAdmin = pathname?.includes("/sacco-admin") || pathname?.includes("/superuser");
  
  const [selectedDeposits, setSelectedDeposits] = useState([]);
  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = useState(false);
  const [bulkNewDate, setBulkNewDate] = useState("");

  const handleSelectAll = (checked, currentDeposits) => {
    if (checked) {
      setSelectedDeposits(currentDeposits.map(d => d.reference));
    } else {
      setSelectedDeposits([]);
    }
  };

  const handleSelectDeposit = (checked, reference) => {
    if (checked) {
      setSelectedDeposits(prev => [...prev, reference]);
    } else {
      setSelectedDeposits(prev => prev.filter(ref => ref !== reference));
    }
  };

  const handleBulkUpdate = () => {
    if (selectedDeposits.length === 0 || !bulkNewDate) return;
    
    const updates = selectedDeposits.map(ref => ({
      reference: ref,
      transaction_date: bulkNewDate
    }));

    bulkUpdateMutation.mutate(updates, {
      onSuccess: () => {
        toast.success(`Updated ${selectedDeposits.length} deposits successfully!`);
        setIsBulkEditDialogOpen(false);
        setSelectedDeposits([]);
        queryClient.invalidateQueries({ queryKey: ["deposits"] });
      },
      onError: (err) => {
        toast.error(err?.response?.data?.error || "Failed to update dates");
      }
    });
  };
  
  const handleEditClick = (deposit) => {
    setSelectedDeposit(deposit);
    // Use transaction_date if available, fallback to created_at
    const dateStr = deposit.transaction_date || deposit.created_at;
    setNewDate(dateStr ? dateStr.split("T")[0] : "");
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateDate = () => {
    if (!selectedDeposit || !newDate) return;
    updateDepositMutation.mutate({
      reference: selectedDeposit.reference,
      values: { transaction_date: newDate }
    }, {
      onSuccess: () => {
        toast.success("Date updated successfully!");
        setIsEditDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["deposits"] });
      },
      onError: (err) => {
        toast.error(err?.response?.data?.detail || "Failed to update date");
      }
    });
  };
  const [specificDate, setSpecificDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [month, setMonth] = useState("");
  const [depositType, setDepositType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const itemsPerPage = 5;

  // Filter deposits
  const filteredDeposits = useMemo(() => {
    const depositsArray = Array.isArray(deposits) ? deposits : deposits?.results || [];
    return depositsArray.filter((deposit) => {
      const depositDate = new Date(deposit.created_at);

      // Specific Date Filter
      if (specificDate) {
        const selectedDate = new Date(specificDate);
        if (!isSameDay(depositDate, selectedDate)) return false;
      }

      // Date Range Filter
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!isWithinInterval(depositDate, { start, end })) return false;
      }

      // Month Filter
      if (month) {
        const [year, monthIndex] = month.split("-").map(Number);
        const startOfSelectedMonth = startOfMonth(
          new Date(year, monthIndex - 1)
        );
        const endOfSelectedMonth = endOfMonth(new Date(year, monthIndex - 1));
        if (
          !isWithinInterval(depositDate, {
            start: startOfSelectedMonth,
            end: endOfSelectedMonth,
          })
        ) {
          return false;
        }
      }

      // Deposit Type Filter
      if (depositType && deposit.deposit_type !== depositType) return false;

      // Payment Method Filter
      if (paymentMethod && deposit.payment_method !== paymentMethod)
        return false;

      return true;
    });
  }, [
    deposits,
    specificDate,
    startDate,
    endDate,
    month,
    depositType,
    paymentMethod,
  ]);

  // Pagination logic
  const totalItems = filteredDeposits?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedDeposits = filteredDeposits?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetFilters = () => {
    setSpecificDate("");
    setStartDate("");
    setEndDate("");
    setMonth("");
    setDepositType("");
    setPaymentMethod("");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Filter Deposits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="specificDate"
                className="text-sm font-medium text-gray-700"
              >
                Specific Date
              </Label>
              <input
                type="date"
                id="specificDate"
                value={specificDate}
                onChange={(e) => {
                  setSpecificDate(e.target.value);
                  setStartDate("");
                  setEndDate("");
                  setMonth("");
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-700"
              >
                Start Date
              </Label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setSpecificDate("");
                  setMonth("");
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-700"
              >
                End Date
              </Label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setSpecificDate("");
                  setMonth("");
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="month"
                className="text-sm font-medium text-gray-700"
              >
                Month
              </Label>
              <input
                type="month"
                id="month"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setSpecificDate("");
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="depositType"
                className="text-sm font-medium text-gray-700"
              >
                Deposit Type
              </Label>
              <select
                id="depositType"
                value={depositType}
                onChange={(e) => {
                  setDepositType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="">All Types</option>
                <option value="Opening Balance">Opening Balance</option>
                <option value="Payroll Deduction">Payroll Deduction</option>
                <option value="Group Deposit">Group Deposit</option>
                <option value="Dividend Deposit">Dividend Deposit</option>
                <option value="Member Deposit">Member Deposit</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="paymentMethod"
                className="text-sm font-medium text-gray-700"
              >
                Payment Method
              </Label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Mpesa">Mpesa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Mobile Banking">Mobile Banking</option>
                <option value="Standing Order">Standing Order</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={resetFilters}
                className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Reset Filters
              </Button>
              {isAdmin && selectedDeposits.length > 0 && (
                <Button
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  onClick={() => setIsBulkEditDialogOpen(true)}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Bulk Edit ({selectedDeposits.length})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {(!filteredDeposits || filteredDeposits.length === 0) && (
        <div className="p-6 text-center text-muted-foreground">
          No deposits found.
        </div>
      )}

      {/* Table */}
      {filteredDeposits && filteredDeposits.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#174271] hover:bg-[#174271]">
              <TableRow>
                {isAdmin && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        paginatedDeposits?.length > 0 &&
                        paginatedDeposits.every((d) => selectedDeposits.includes(d.reference))
                      }
                      onCheckedChange={(checked) => handleSelectAll(checked, paginatedDeposits)}
                      className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-[#174271]"
                    />
                  </TableHead>
                )}
                <TableHead className="text-white font-semibold">Date</TableHead>
                <TableHead className="text-white font-semibold">
                  Amount
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Deposited By
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Payment Method
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Status
                </TableHead>
                {isAdmin && (
                  <TableHead className="text-white font-semibold text-right">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDeposits?.map((deposit) => (
                <TableRow key={deposit.reference} className="border-b hover:bg-gray-50 transition-colors">
                  {isAdmin && (
                    <TableCell>
                      <Checkbox
                        checked={selectedDeposits.includes(deposit.reference)}
                        onCheckedChange={(checked) => handleSelectDeposit(checked, deposit.reference)}
                      />
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-gray-700">
                    {formatDate(deposit.transaction_date || deposit.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    KES {parseFloat(deposit.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {deposit.deposited_by}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {deposit.payment_method}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${deposit.transaction_status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {deposit.transaction_status}
                    </span>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditClick(deposit)}
                        className="text-primary hover:text-primary/80 hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Date
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            entries
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-primary hover:bg-[#022007] text-white text-sm disabled:opacity-50"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={currentPage === page ? "default" : "outline"}
                className={`${currentPage === page
                  ? "bg-primary text-white"
                  : "border-primary text-primary hover:bg-primary hover:text-white"
                  } text-sm`}
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-primary hover:bg-[#022007] text-white text-sm disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Date Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Deposit Date</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="newDate" className="mb-2 block">Transaction Date</Label>
            <input
              type="date"
              id="newDate"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Note: Updating this date will automatically update the General Ledger posting date.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={updateDepositMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDate} disabled={updateDepositMutation.isPending || !newDate} className="bg-primary text-white">
              {updateDepositMutation.isPending ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Date Modal */}
      <Dialog open={isBulkEditDialogOpen} onOpenChange={setIsBulkEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Edit Dates</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="bulkNewDate" className="mb-2 block">New Transaction Date for {selectedDeposits.length} deposits</Label>
            <input
              type="date"
              id="bulkNewDate"
              value={bulkNewDate}
              onChange={(e) => setBulkNewDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Note: Updating these dates will automatically update the General Ledger posting date for all selected deposits.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkEditDialogOpen(false)} disabled={bulkUpdateMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate} disabled={bulkUpdateMutation.isPending || !bulkNewDate} className="bg-primary text-white">
              {bulkUpdateMutation.isPending ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SavingsDepositsTable;
