"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getPaymentAccount, getPaymentAccounts } from "@/services/paymentaccounts";

export function useFetchPaymentAccounts() {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["paymentaccounts"],
        queryFn: () => getPaymentAccounts(token),
    });
}

export function useFetchPaymentAccount(reference) {
    const token = useAxiosAuth();

    return useQuery({
        queryKey: ["paymentaccount", reference],
        queryFn: () => getPaymentAccount(reference, token),
        enabled: !!reference,
    });
}
