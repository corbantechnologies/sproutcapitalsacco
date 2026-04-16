"use client";

import React, { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { useParams } from "next/navigation";
import { useFetchLoanDetail } from "@/hooks/loans/actions";
import { useFetchMember } from "@/hooks/members/actions";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function LoanDetail() {
  const { reference } = useParams();
  const [activeTab, setActiveTab] = useState("overview"); // overview, schedule, transactions
  const [monthFilter, setMonthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    isLoading: isLoadingLoan,
    data: loan,
    refetch: refetchLoan,
  } = useFetchLoanDetail(reference);

  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();

  // --- Computed Data ---

  const schedule = useMemo(() => {
    return loan?.application_details?.projection_snapshot?.schedule || [];
  }, [loan]);

  const allTransactions = useMemo(() => {
    if (!loan) return [];

    const disbursements = (loan.disbursements || []).map((d) => ({
      ...d,
      type: "Disbursement",
      amount: d.amount, // Verify field name, assuming amount
      date: d.created_at,
      status: "Completed", // Disbursements are usually completed if they exist here
      method: d.method || "N/A",
    }));

    const payments = (loan.loan_payments || loan.repayments || []).map((p) => ({
      ...p,
      type: "Repayment",
      amount: p.amount,
      date: p.created_at,
      status: p.transaction_status || "Completed",
      method: p.payment_method || "N/A",
    }));

    // Combine and sort desc
    return [...disbursements, ...payments].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [loan]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      const tDate = new Date(t.date);
      if (monthFilter) {
        const [year, month] = monthFilter.split("-").map(Number);
        const start = startOfMonth(new Date(year, month - 1));
        const end = endOfMonth(new Date(year, month - 1));
        if (!isWithinInterval(tDate, { start, end })) return false;
      }
      if (statusFilter && t.status !== statusFilter) return false;
      return true;
    });
  }, [allTransactions, monthFilter, statusFilter]);

  // Pagination for transactions
  const totalTxItems = filteredTransactions.length;
  const totalTxPages = Math.ceil(totalTxItems / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Helpers ---

  const formatCurrency = (amount) => {
    return `KES ${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "MMM dd, yyyy");
  };

  // --- PDF Generators ---

  const generateApplicationPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(18);
    doc.setTextColor(4, 94, 50); // Primary Color
    doc.text("Loan Application & Schedule", margin, y);
    y += 10;

    // Meta Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${format(new Date(), "PPpp")}`, margin, y);
    doc.text(`Ref: ${loan.reference}`, margin + 100, y);
    y += 15;

    // Member Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(
      `Member: ${member.first_name} ${member.last_name} (${member.member_no})`,
      margin,
      y
    );
    y += 7;
    doc.text(`Phone: ${member.phone}`, margin, y);
    y += 15;

    // Loan Details
    doc.setFontSize(14);
    doc.setTextColor(4, 94, 50);
    doc.text("Loan Details", margin, y);
    y += 8;

    const detailsData = [
      ["Product", loan.product],
      ["Account Number", loan.account_number],
      ["Principal", formatCurrency(loan.principal)],
      [
        "Interest Rate",
        `${loan.product_details?.interest_rate}% (${loan.product_details?.interest_period})`,
      ],
      ["Start Date", formatDate(loan.start_date)],
      ["End Date", formatDate(loan.end_date)],
      ["Total Repayment", formatCurrency(loan.total_loan_amount)],
    ];

    autoTable(doc, {
      startY: y,
      body: detailsData,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 1 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 } },
    });

    y = doc.lastAutoTable.finalY + 15;

    // Schedule
    doc.setFontSize(14);
    doc.setTextColor(4, 94, 50);
    doc.text("Repayment Schedule", margin, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [
        ["Due Date", "Principal", "Interest", "Fees", "Total Due", "Balance After"],
      ],
      body: schedule.map((s) => [
        formatDate(s.due_date),
        formatCurrency(s.principal_due),
        formatCurrency(s.interest_due),
        formatCurrency(s.fee_due),
        formatCurrency(s.total_due),
        formatCurrency(s.balance_after),
      ]),
      theme: "grid",
      headStyles: { fillColor: [4, 94, 50] },
      styles: { fontSize: 9 },
    });

    doc.save(`loan_schedule_${loan.reference}.pdf`);
  };

  const generateTransactionPDF = () => {
    const doc = new jsPDF();
    // ... Similar logic for transaction history ...
    const margin = 20;
    let y = 20;

    doc.setFontSize(18);
    doc.setTextColor(4, 94, 50);
    doc.text("Loan Transaction History", margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`As of: ${format(new Date(), "PPpp")}`, margin, y);
    y += 15;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(
      `Loan Account: ${loan.account_number} (${loan.product})`,
      margin,
      y
    );
    y += 7;
    doc.text(
      `Outstanding Balance: ${formatCurrency(loan.outstanding_balance)}`,
      margin,
      y
    );
    y += 15;

    autoTable(doc, {
      startY: y,
      head: [["Date", "Type", "Amount", "Method", "Status"]],
      body: filteredTransactions.map((t) => [
        formatDate(t.date),
        t.type,
        formatCurrency(t.amount),
        t.method,
        t.status,
      ]),
      theme: "striped",
      headStyles: { fillColor: [4, 94, 50] },
    });

    doc.save(`loan_transactions_${loan.reference}.pdf`);
  };

  if (isLoadingLoan || isLoadingMember) return <MemberLoadingSpinner />;
  if (!loan || !member)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loan details not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto p-4 sm:p-6 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink href="/sacco-admin/personal">
              Personal Dashboard
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/personal/loans">
                Loans
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>{loan.product} Loan</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {loan.product} Loan
              </h1>
              <Badge
                variant={loan.status === "Active" ? "default" : "secondary"}
                className={loan.status === "Active" ? "bg-[#045e32]" : ""}
              >
                {loan.status}
              </Badge>
            </div>
            <p className="text-muted-foreground font-mono">
              {loan.account_number}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={generateApplicationPDF}
              variant="outline"
              className="border-[#045e32] text-[#045e32] hover:bg-[#045e32]/10"
            >
              Download Schedule
            </Button>
            <Button className="bg-[#045e32] hover:bg-[#034625]">
              Make Repayment
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 rounded bg-gray-200 p-1 w-fit">
          {["overview", "schedule", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                                w-full rounded py-2.5 px-6 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                                ${activeTab === tab
                  ? "bg-white text-[#045e32] shadow"
                  : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800"
                }
                            `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#045e32]">
                    Loan Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      Principal Amount
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(loan.principal)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      Total Repayment
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(loan.total_loan_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      Outstanding Balance
                    </span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(loan.outstanding_balance)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      Interest Accrued
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(loan.total_interest_accrued)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#045e32]">
                    Terms & Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Interest Rate</span>
                    <span className="font-semibold">
                      {loan.product_details?.interest_rate}%{" "}
                      {loan.product_details?.interest_period}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-semibold">
                      {formatDate(loan.start_date)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="font-semibold">
                      {formatDate(loan.end_date)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      Calculation Method
                    </span>
                    <span className="font-semibold">
                      {loan.product_details?.calculation_schedule || "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "schedule" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Repayment Schedule</CardTitle>
                  <CardDescription>
                    Projected payment dates and amounts
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateApplicationPDF}
                >
                  Download PDF
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Due Date</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Fees</TableHead>
                      <TableHead>Total Due</TableHead>
                      <TableHead className="text-right">
                        Balance After
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {formatDate(row.due_date)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(row.principal_due)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(row.interest_due)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(row.fee_due)}
                        </TableCell>
                        <TableCell className="font-bold text-[#045e32]">
                          {formatCurrency(row.total_due)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatCurrency(row.balance_after)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {schedule.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center h-24 text-muted-foreground"
                        >
                          No schedule available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "transactions" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    All payments and disbursements
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <select
                    className="h-9 w-[150px] rounded border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                  >
                    <option value="">All Months</option>
                    {/* Simple way to show last 12 months could be added here, leaving manual empty for now if no dynamic generation */}
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateTransactionPDF}
                  >
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((t, i) => (
                      <TableRow key={i}>
                        <TableCell>{formatDate(t.date)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium 
                                                        ${t.type ===
                                "Disbursement"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                              }`}
                          >
                            {t.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(t.amount)}
                        </TableCell>
                        <TableCell>{t.method}</TableCell>
                        <TableCell>{t.status}</TableCell>
                      </TableRow>
                    ))}
                    {paginatedTransactions.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center h-24 text-muted-foreground"
                        >
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Helper Pagination (Simplified) */}
                {totalTxPages > 1 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalTxPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalTxPages, p + 1))
                      }
                      disabled={currentPage === totalTxPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoanDetail;
