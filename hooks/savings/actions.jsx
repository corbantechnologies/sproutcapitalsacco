"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getSaving, getSavings } from "@/services/savings";

export function useFetchSavings(params) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["savings", params],
    queryFn: () => getSavings(params, token),
  });
}

export function useFetchSavingDetail(reference) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["saving", reference],
    queryFn: () => getSaving(reference, token),
    enabled: !!reference,
  });
}
