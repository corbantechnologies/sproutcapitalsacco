"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getTrialBalance, getBalanceSheet, getPnL, getCashBook } from "@/services/financials";

export function useFetchTrialBalance() {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["trial-balance"],
        queryFn: () => getTrialBalance(token),
    });
}

export function useFetchBalanceSheet() {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["balance-sheet"],
        queryFn: () => getBalanceSheet(token),
    });
}

export function useFetchPnL() {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["pnl"],
        queryFn: () => getPnL(token),
    });
}

export function useFetchCashBook() {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["cash-book"],
        queryFn: () => getCashBook(token),
    });
}