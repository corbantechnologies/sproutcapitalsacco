import React from "react";
import { useFetchCashBook } from "@/hooks/financials/actions";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CashBook() {
    const { data, isLoading, error } = useFetchCashBook();

    if (isLoading) return <MemberLoadingSpinner />;
    if (error || !data) return <div className="p-12 text-center text-muted-foreground">Unable to load Cash Book</div>;

    const { accounts, total_cash, as_of, note } = data; // Note: structure may vary slightly

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cash Book</CardTitle>
                <CardDescription>As of {new Date(as_of).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-right mb-4">
                    <p className="text-sm text-muted-foreground">Total Cash & Bank</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(total_cash)}</p>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Account</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.map((acc) => (
                            <TableRow key={acc.id}>
                                <TableCell>{acc.name}</TableCell>
                                <TableCell className="font-mono">{acc.code}</TableCell>
                                <TableCell>{acc.category}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(Math.abs(acc.balance))}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {note && <p className="text-xs text-muted-foreground mt-4 italic">{note}</p>}
            </CardContent>
        </Card>
    );
}