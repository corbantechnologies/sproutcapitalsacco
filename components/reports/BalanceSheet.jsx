import React from "react";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetchBalanceSheet } from "@/hooks/financials/actions";

export default function BalanceSheet() {
    const { data, isLoading, error } = useFetchBalanceSheet();

    if (isLoading) return <MemberLoadingSpinner />;
    if (error || !data) return <div className="p-12 text-center text-muted-foreground">Unable to load Balance Sheet</div>;

    const { assets, liabilities, equity, totals, as_of } = data;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>As of {new Date(as_of).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Assets */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Assets</h3>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Account</TableHead><TableHead className="text-right">Balance</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.accounts.map((acc) => (
                                <TableRow key={acc.id}>
                                    <TableCell>{acc.name} <span className="text-xs text-muted-foreground">({acc.code})</span></TableCell>
                                    <TableCell className="text-right font-mono">{formatCurrency(Math.abs(acc.balance))}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="font-bold bg-muted/70">
                                <TableCell>Total Assets</TableCell>
                                <TableCell className="text-right">{formatCurrency(assets.total)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Liabilities */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Liabilities</h3>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Account</TableHead><TableHead className="text-right">Balance</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {liabilities.accounts.map((acc) => (
                                <TableRow key={acc.id}>
                                    <TableCell>{acc.name} <span className="text-xs text-muted-foreground">({acc.code})</span></TableCell>
                                    <TableCell className="text-right font-mono">{formatCurrency(Math.abs(acc.balance))}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="font-bold bg-muted/70">
                                <TableCell>Total Liabilities</TableCell>
                                <TableCell className="text-right">{formatCurrency(liabilities.total)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Equity */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Equity</h3>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Account</TableHead><TableHead className="text-right">Balance</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {equity.accounts.map((acc) => (
                                <TableRow key={acc.id}>
                                    <TableCell>{acc.name} <span className="text-xs text-muted-foreground">({acc.code})</span></TableCell>
                                    <TableCell className="text-right font-mono">{formatCurrency(Math.abs(acc.balance))}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="font-bold bg-muted/70">
                                <TableCell>Current Period Net Income</TableCell>
                                <TableCell className="text-right">{formatCurrency(equity.current_period_net_income)}</TableCell>
                            </TableRow>
                            <TableRow className="font-bold bg-muted/70">
                                <TableCell>Total Equity</TableCell>
                                <TableCell className="text-right">{formatCurrency(equity.total)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div className="pt-6 border-t flex justify-between text-lg font-bold">
                    <span>Total Liabilities + Equity</span>
                    <span>{formatCurrency(totals.total_liabilities_and_equity)}</span>
                </div>
            </CardContent>
        </Card>
    );
}