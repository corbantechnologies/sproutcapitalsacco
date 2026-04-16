"use client";
import React, { useState } from "react";
import { useFetchSaccoSummary } from "@/hooks/saccosummary/actions";
import { downloadSaccoSummary } from "@/services/saccosummary";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileDown,
  PiggyBank,
  CreditCard,
  Users,
  Wallet,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import SaccoFinancialReports from "@/components/reports/SaccoFinancialReports";

const SummaryCard = ({ title, amount, count, icon: Icon, colorClass }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
      {count !== undefined && (
        <p className="text-xs text-muted-foreground">{count} transactions</p>
      )}
    </CardContent>
  </Card>
);

export default function SaccoAdminReports() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [isDownloading, setIsDownloading] = useState(false);

  const token = useAxiosAuth();
  const {
    data: summary,
    isLoading,
    error,
  } = useFetchSaccoSummary(selectedYear);

  if (isLoading) return <MemberLoadingSpinner />;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">Failed to load reports</div>
    );

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await downloadSaccoSummary(token, selectedYear);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Sacco_Summary_${selectedYear}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Download started");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) =>
    (currentYear - i).toString()
  );

  return (
    <div className="flex flex-col space-y-6 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Reports
          </h1>
          <p className="text-muted-foreground">
            Overview of SACCO performance for {selectedYear}
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleDownload} disabled={isDownloading}>
            <FileDown className="mr-2 h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download Report"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Savings"
          amount={summary?.totals?.savings_deposits}
          count={summary?.totals?.counts?.savings_deposits}
          icon={PiggyBank}
          colorClass="text-green-600"
        />
        <SummaryCard
          title="Loans Disbursed"
          amount={summary?.totals?.loan_disbursements}
          count={summary?.totals?.counts?.loan_disbursements}
          icon={CreditCard}
          colorClass="text-blue-600"
        />
        <SummaryCard
          title="Loan Repayments"
          amount={summary?.totals?.loan_repayments}
          count={summary?.totals?.counts?.loan_repayments}
          icon={TrendingUp}
          colorClass="text-indigo-600"
        />
        {/* <SummaryCard
          title="Venture Activity"
          amount={summary?.totals?.venture_deposits} // Displaying deposits as main
          // Optionally combine or show net, but keeping simple for now
          count={summary?.totals?.counts?.venture_deposits}
          icon={Wallet}
          colorClass="text-purple-600"
        /> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Additional Stat for Members because it doesn't fit the currency card pattern exactly but can share style if we tweak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Members</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totals?.total_new_members}
            </div>
            <p className="text-xs text-muted-foreground">
              Joined in {selectedYear}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <CardDescription>
            Detailed view of transactions by month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">New Members</TableHead>
                <TableHead className="text-right">Savings</TableHead>
                <TableHead className="text-right">Loans Disbursed</TableHead>
                <TableHead className="text-right">Repayments</TableHead>
                {/* <TableHead className="text-right">Venture Deposits</TableHead>
                <TableHead className="text-right">Venture Payments</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary?.monthly_summary?.map((month) => (
                <TableRow key={month.month_num}>
                  <TableCell className="font-medium">{month.month}</TableCell>
                  <TableCell className="text-right">
                    {month.new_members}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(month.savings.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(month.loans.disbursed.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(month.loans.repaid.total)}
                  </TableCell>
                  {/* <TableCell className="text-right">
                    {formatCurrency(month.ventures.deposits.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(month.ventures.payments.total)}
                  </TableCell> */}
                </TableRow>
              ))}
              {(!summary?.monthly_summary ||
                summary.monthly_summary.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No data available for this year
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SaccoFinancialReports />
    </div>
  );
}
