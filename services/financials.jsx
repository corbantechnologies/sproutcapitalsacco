"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

export const getTrialBalance = async (token) => {
    const response = await apiActions?.get("/api/v1/financials/trial-balance/", token);
    return response?.data;
};

export const getBalanceSheet = async (token) => {
    const response = await apiActions?.get("/api/v1/financials/balance-sheet/", token);
    return response?.data;
};

export const getPnL = async (token) => {
    const response = await apiActions?.get("/api/v1/financials/pnl/", token);
    return response?.data;
};

export const getCashBook = async (token) => {
    const response = await apiActions?.get("/api/v1/financials/cash-balance/", token);
    return response?.data;
};