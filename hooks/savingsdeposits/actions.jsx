"use client";

import {
  getSavingsDeposit,
  getSavingsDeposits,
} from "@/services/savingsdeposits";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchSavingsDeposits() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["deposits"],
    queryFn: () => getSavingsDeposits(token),
  });
}

export function useFetchSavingsDepositDetail(reference) {
  const token = useAxiosAuth();
  return useQuery({
    queryKey: ["deposit", reference],
    queryFn: () => getSavingsDeposit(reference, token),
    enabled: !!reference,
  });
}
