"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import {
  PiggyBank,
  CreditCard,
  TrendingUp,
  ArrowDownOriginal,
  ArrowUpOriginal,
} from "lucide-react";

import { downloadMemberSummary } from "@/services/membersummary";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Download, Loader2 } from "lucide-react";

export default function MemberFinancialSummary({ summary, memberNo }) {
  const token = useAxiosAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!memberNo) return;
    setIsDownloading(true);
    try {
      const blob = await downloadMemberSummary(memberNo, token);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Financial_Summary_${summary.year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Download started");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download summary");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!summary) return null;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Financial Summary ({summary.year})</CardTitle>
          <CardDescription>
            Yearly breakdown of your financial activities
          </CardDescription>
        </div>
        {memberNo && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download PDF
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="savings" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-4 h-auto">
            <TabsTrigger value="savings" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" /> Savings
            </TabsTrigger>
            <TabsTrigger value="loans" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Loans
            </TabsTrigger>
            {/* <TabsTrigger value="ventures" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Ventures
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="savings">
            <SummaryTabContent
              data={summary.savings}
              type="savings"
              emptyMessage="No savings account activity found for this year."
            />
          </TabsContent>

          <TabsContent value="loans">
            <SummaryTabContent
              data={summary.loans}
              type="loans"
              emptyMessage="No loan activity found for this year."
            />
          </TabsContent>

          <TabsContent value="ventures">
            <SummaryTabContent
              data={summary.ventures}
              type="ventures"
              emptyMessage="No venture activity found for this year."
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function SummaryTabContent({ data, type, emptyMessage }) {
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);

  // If no data, show empty message
  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground border rounded bg-gray-50/50">
        {emptyMessage}
      </div>
    );
  }

  const selectedAccount = data[selectedAccountIndex];

  // Use useEffect to reset index if data changes (though unlikely in this context without filters)
  useEffect(() => {
    if (selectedAccountIndex >= data.length) {
      setSelectedAccountIndex(0);
    }
  }, [data, selectedAccountIndex]);

  const getAccountLabel = (account) => {
    if (type === "savings")
      return `${account.type} - ${account.account_number}`;
    if (type === "loans")
      return `${account.product} - ${account.account_number}`;
    if (type === "ventures")
      return `${account.type} - ${account.account_number}`;
    return account.account_number;
  };

  return (
    <div className="space-y-4">
      {/* Account Selector */}
      {data.length > 1 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Select Account:
          </span>
          <Select
            value={selectedAccountIndex.toString()}
            onValueChange={(val) => setSelectedAccountIndex(parseInt(val))}
          >
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {data.map((acc, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  {getAccountLabel(acc)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Totals Summary for Selected Account */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-secondary/20 rounded border">
        {type === "savings" && (
          <>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Deposits
              </p>
              <p className="font-bold text-lg text-green-700">
                {formatCurrency(selectedAccount.totals?.total_deposits || 0)}
              </p>
            </div>
          </>
        )}
        {type === "loans" && (
          <>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Principal
              </p>
              <p className="font-bold text-lg">
                {formatCurrency(selectedAccount.initial_principal || 0)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Disbursed
              </p>
              <p className="font-bold text-lg text-blue-700">
                {formatCurrency(selectedAccount.totals?.total_disbursed || 0)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Repaid
              </p>
              <p className="font-bold text-lg text-green-700">
                {formatCurrency(selectedAccount.totals?.total_repaid || 0)}
              </p>
            </div>
          </>
        )}
        {type === "ventures" && (
          <>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Deposits
              </p>
              <p className="font-bold text-lg text-green-700">
                {formatCurrency(selectedAccount.totals?.total_deposits || 0)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Payments
              </p>
              <p className="font-bold text-lg text-red-700">
                {formatCurrency(selectedAccount.totals?.total_payments || 0)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Monthly Table */}
      <div className="rounded border overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[120px]">Month</TableHead>
              <TableHead className="text-right">Opening</TableHead>

              {type === "savings" && (
                <TableHead className="text-right text-green-600">
                  Deposits
                </TableHead>
              )}
              {type === "savings" && (
                <TableHead className="text-right text-red-600">
                  Withdrawals
                </TableHead>
              )}

              {type === "loans" && (
                <TableHead className="text-right text-blue-600">
                  Disbursed
                </TableHead>
              )}
              {type === "loans" && (
                <TableHead className="text-right text-green-600">
                  Paid
                </TableHead>
              )}

              {type === "ventures" && (
                <TableHead className="text-right text-green-600">
                  Deposits
                </TableHead>
              )}
              {type === "ventures" && (
                <TableHead className="text-right text-red-600">
                  Payments
                </TableHead>
              )}

              <TableHead className="text-right font-bold bg-gray-100/50">
                Closing
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedAccount.monthly_summary.map((month) => (
              <TableRow
                key={month.month}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="font-medium">{month.month}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(month.opening_balance)}
                </TableCell>

                {type === "savings" && (
                  <>
                    <TableCell className="text-right font-medium">
                      {month.deposits > 0 ? (
                        <span className="text-green-700">
                          +{formatCurrency(month.deposits)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {month.withdrawals > 0 ? (
                        <span className="text-red-700">
                          -{formatCurrency(month.withdrawals)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </>
                )}

                {type === "loans" && (
                  <>
                    <TableCell className="text-right font-medium">
                      {month.disbursed > 0 ? (
                        <span className="text-blue-700">
                          +{formatCurrency(month.disbursed)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {month.paid > 0 ? (
                        <span className="text-green-700">
                          -{formatCurrency(month.paid)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </>
                )}

                {type === "ventures" && (
                  <>
                    <TableCell className="text-right font-medium">
                      {month.deposits > 0 ? (
                        <span className="text-green-700">
                          +{formatCurrency(month.deposits)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {month.payments > 0 ? (
                        <span className="text-red-700">
                          -{formatCurrency(month.payments)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </>
                )}

                <TableCell className="text-right font-bold bg-gray-50/30">
                  {formatCurrency(month.closing_balance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
