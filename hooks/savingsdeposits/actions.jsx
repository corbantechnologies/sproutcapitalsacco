"use client";

import {
  getSavingsDepositDetail,
  getSavingsDeposits,
  updateSavingsDeposit,
} from "@/services/savingsdeposits";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery, useMutation } from "@tanstack/react-query";

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
    queryFn: () => getSavingsDepositDetail(reference, token),
    enabled: !!reference,
  });
}

export function useUpdateSavingsDeposit() {
  const token = useAxiosAuth();
  return useMutation({
    mutationFn: (data) => updateSavingsDeposit(data, token),
  });
}
