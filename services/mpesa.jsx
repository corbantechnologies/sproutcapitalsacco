"use client";

import { apiActions } from "@/tools/axios";

export const generateDepositSTKPush = async (payload) => {
  const response = await apiActions.post("/api/v1/mpesa/pay/", payload);
  return response.data;
};
