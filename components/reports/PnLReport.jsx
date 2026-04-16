import React from "react";
import { useFetchPnL } from "@/hooks/financials/actions";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PnLReport() {
    const { data, isLoading, error } = useFetchPnL();

    if (isLoading) return <MemberLoadingSpinner />;
    if (error || !data) return <div className="p-12 text-center text-muted-foreground">Unable to load Profit & Loss</div>;

    const { revenue, expenses, net_income, period } = data;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profit & Loss Statement</CardTitle>
                <CardDescription>
                    {new Date(period.start).toLocaleDateString()} — {new Date(period.end).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow><TableHead>Item</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Revenue */}
                        <TableRow className="bg-muted/30"><TableCell colSpan={2} className="font-semibold text-green-700">Revenue</TableCell></TableRow>
                        {revenue.accounts.map((acc) => (
                            <TableRow key={acc.id}>
                                <TableCell>{acc.name} ({acc.code})</TableCell>
                                <TableCell className="text-right">{formatCurrency(acc.balance)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="font-bold bg-muted/70">
                            <TableCell>Total Revenue</TableCell>
                            <TableCell className="text-right">{formatCurrency(revenue.total)}</TableCell>
                        </TableRow>

                        {/* Expenses */}
                        <TableRow className="bg-muted/30"><TableCell colSpan={2} className="font-semibold text-red-700 pt-6">Expenses</TableCell></TableRow>
                        {expenses.accounts.map((acc) => (
                            <TableRow key={acc.id}>
                                <TableCell>{acc.name} ({acc.code})</TableCell>
                                <TableCell className="text-right">{formatCurrency(acc.balance)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="font-bold bg-muted/70">
                            <TableCell>Total Expenses</TableCell>
                            <TableCell className="text-right">{formatCurrency(expenses.total)}</TableCell>
                        </TableRow>

                        {/* Net Income */}
                        <TableRow className="bg-primary/5 border-t-2 border-primary">
                            <TableCell className="font-bold text-lg">Net Income / (Loss)</TableCell>
                            <TableCell className={`text-right font-bold text-lg ${net_income >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {formatCurrency(net_income)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}