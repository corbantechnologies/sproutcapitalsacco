"use client";

import React, { useState } from "react";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import AccountsListTable from "@/components/transactions/AccountsListTable";
import StatsCard from "@/components/saccoadmin/StatsCard";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFetchAccountsList } from "@/hooks/transactions/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { downloadAccountsListCSV } from "@/services/transactions";
import { Users, Wallet, CreditCard, ChevronDown, FileDown } from "lucide-react";
import toast from "react-hot-toast";

function TransactionsPage() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const token = useAxiosAuth();

  const {
    isLoading: isLoadingAccounts,
    data: accountsList,
  } = useFetchAccountsList();

  if (isLoadingAccounts) return <LoadingSpinner />;

  const accounts = accountsList?.results || accountsList || [];

  // Calculate stats
  const totalAccounts = accounts.length;

  const totalSavings = accounts.reduce((acc, user) => {
    const userSavings = user.savings_accounts?.reduce(
      (sum, [_, __, balance]) => sum + parseFloat(balance || 0),
      0
    ) || 0;
    return acc + userSavings;
  }, 0);

  const totalLoans = accounts.reduce((acc, user) => {
    const userLoans = user.loan_accounts?.reduce(
      (sum, [_, __, balance]) => sum + parseFloat(balance || 0),
      0
    ) || 0;
    return acc + userLoans;
  }, 0);

  const formatCurrencyValue = (val) => {
    return `KES ${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold ">
              Accounts List
            </h1>
            <p className="text-gray-500 mt-1">Manage member account balances</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button className="bg-primary hover:bg-[#022007] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none">
                  <FileDown className="h-4 w-4 mr-2" /> Download <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    className="justify-start font-normal w-full"
                    onClick={async () => {
                      try {
                        await downloadAccountsListCSV(token);
                        setPopoverOpen(false);
                        toast.success("Accounts list download started");
                      } catch (error) {
                        toast.error("Download failed");
                      }
                    }}
                  >
                    <FileDown className="mr-2 h-4 w-4" /> Download Accounts List
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <StatsCard
            title="Total Registered Accounts"
            value={totalAccounts}
            Icon={Users}
            description="Active members with accounts"
          />
          <StatsCard
            title="Total Savings Portfolio"
            value={formatCurrencyValue(totalSavings)}
            Icon={Wallet}
            description="Aggregated savings balance"
          />
          <StatsCard
            title="Total Loans Outstanding"
            value={formatCurrencyValue(totalLoans)}
            Icon={CreditCard}
            description="Aggregated outstanding loans"
          />
        </div>

        {/* Accounts List Table */}
        <AccountsListTable accountsList={accountsList} />
      </div>
    </div>
  );
}

export default TransactionsPage;