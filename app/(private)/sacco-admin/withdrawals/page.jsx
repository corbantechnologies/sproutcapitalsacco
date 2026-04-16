"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchSavingsWithdrawals } from "@/hooks/savingswithdrawals/actions";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WithdrawalsTable from "@/components/withdrawals/WithdrawalsTable";

function Withdrawals() {
  const {
    isLoading: isLoadingWithdrawals,
    data: withdrawals,
    refetch: refetchWithdrawals,
  } = useFetchSavingsWithdrawals();

  if (isLoadingWithdrawals) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto p-4 sm:p-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Withdrawals</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mb-3">
          <h1 className="text-2xl  font-bold">
            Withdrawal Requests
          </h1>
          <p className="text-gray-500 mt-1">
            Manage member withdrawal requests
          </p>
        </section>

        <Card className="shadow-md">
          <CardContent>
            <WithdrawalsTable
              withdrawals={withdrawals || []}
              refetchWithdrawals={refetchWithdrawals}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Withdrawals;
