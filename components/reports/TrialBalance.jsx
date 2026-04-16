import React from "react";
import { useFetchTrialBalance } from "@/hooks/financials/actions";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TrialBalance() {
    const { data, isLoading, error } = useFetchTrialBalance();

    if (isLoading) return <MemberLoadingSpinner />;
    if (error || !data) return <div className="p-12 text-center text-muted-foreground">Unable to load Trial Balance</div>;

    const { accounts, totals, as_of } = data;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trial Balance</CardTitle>
                <CardDescription>As of {new Date(as_of).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Account</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead className="text-right">Total Debit</TableHead>
                            <TableHead className="text-right">Total Credit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.map((acc) => (
                            <TableRow key={acc.code}>
                                <TableCell>{acc.name}</TableCell>
                                <TableCell className="font-mono">{acc.code}</TableCell>
                                <TableCell className="text-right text-emerald-600 font-medium">
                                    {formatCurrency(acc.total_debit)}
                                </TableCell>
                                <TableCell className="text-right text-rose-600 font-medium">
                                    {formatCurrency(acc.total_credit)}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="font-bold bg-muted/70">
                            <TableCell colSpan={2}>Grand Total</TableCell>
                            <TableCell className="text-right">{formatCurrency(totals.total_debit)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(totals.total_credit)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}