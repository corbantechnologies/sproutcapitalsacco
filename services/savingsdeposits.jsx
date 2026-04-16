"use client";
import { apiActions, apiMultipartActions } from "@/tools/axios";

export const createSavingsDeposit = async (values, token) => {
  await apiActions?.post(
    "/api/v1/savingsdeposits/admin/create/",
    values,
    token
  );
};

export const getSavingsDeposits = async (token) => {
  const response = await apiActions?.get("/api/v1/savingsdeposits/", token);
  return response?.data;
};

export const getSavingsDeposit = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/savingsdeposits/${reference}/`,
    token
  );
  return response?.data;
};


// Used for Mpesa
export const createSavingsDepositMpesa = async (values, token) => {
  const response = await apiActions?.post(
    "/api/v1/savingsdeposits/",
    values,
    token
  );
  return response?.data;
};

// Bulk Functions
export const bulkCreateSavingsDeposits = async (values, token) => {
  await apiActions?.post("/api/v1/savingsdeposits/bulk/create/", values, token);
};

export const bulkUploadSavingsDeposits = async (values, token) => {
  await apiMultipartActions?.post("/api/v1/savingsdeposits/bulk/upload/", values, token);
};

export const downloadSavingsDepositsTemplate = async (token) => {
  const config = { ...token, responseType: "blob" };
  const response = await apiActions?.get("/api/v1/savingsdeposits/bulk/template/", config);

  // Create blob link to download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "savings_deposits_bulk_template.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();

  return response?.data;
};