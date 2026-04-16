"use client";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, Form, Formik } from "formik";
import { updateLoanProduct } from "@/services/loanproducts";
import { useFetchGLAccounts } from "@/hooks/glaccounts/actions";
import toast from "react-hot-toast";

function UpdateLoanProduct({ isOpen, onClose, refetchLoanTypes, loanProduct }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();
  const { data: glAccounts, isLoading: isLoadingGL } = useFetchGLAccounts();

  if (!loanProduct) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Loan Product: {loanProduct?.name}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name: loanProduct?.name || "",
            interest_rate: loanProduct?.interest_rate || 0,
            processing_fee: loanProduct?.processing_fee || 0,
            gl_principal_asset: loanProduct?.gl_principal_asset || "",
            gl_penalty_revenue: loanProduct?.gl_penalty_revenue || "",
            gl_interest_revenue: loanProduct?.gl_interest_revenue || "",
            gl_processing_fee_revenue: loanProduct?.gl_processing_fee_revenue || "",
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            try {
              setLoading(true);
              await updateLoanProduct(loanProduct?.reference, values, token);
              toast?.success("Loan product updated successfully!");
              onClose();
              refetchLoanTypes();
            } catch (error) {
              toast?.error("Failed to update loan product!");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black">
                  Name
                </Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="border-black "
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest_rate" className="text-black">
                  Interest Rate (%)
                </Label>
                <Field
                  as={Input}
                  type="number"
                  id="interest_rate"
                  name="interest_rate"
                  className="border-black "
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processing_fee" className="text-black">
                  Processing Fee (%)
                </Label>
                <Field
                  as={Input}
                  type="number"
                  id="processing_fee"
                  name="processing_fee"
                  className="border-black "
                  required
                />
              </div>

              {/* GL Principal Account (Asset) */}
              <div className="space-y-2">
                <Label htmlFor="gl_principal_asset" className="text-black">
                  Principal GL Account (Asset)
                </Label>
                <Select
                  value={values.gl_principal_asset}
                  onValueChange={(value) => setFieldValue("gl_principal_asset", value)}
                  // disabled={true}
                >
                  <SelectTrigger className="border-black w-full bg-gray-50">
                    <SelectValue placeholder="Principal Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {glAccounts?.map((acc) => (
                      <SelectItem key={acc.id || acc.reference} value={acc.name}>
                        {acc.name} ({acc.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* GL Interest Account (Revenue) */}
              <div className="space-y-2">
                <Label htmlFor="gl_interest_revenue" className="text-black">
                  Interest GL Account (Revenue)
                </Label>
                <Select
                  value={values.gl_interest_revenue}
                  onValueChange={(value) => setFieldValue("gl_interest_revenue", value)}
                  // disabled={true}
                >
                  <SelectTrigger className="border-black w-full bg-gray-50">
                    <SelectValue placeholder="Interest Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {glAccounts?.map((acc) => (
                      <SelectItem key={acc.id || acc.reference} value={acc.name}>
                        {acc.name} ({acc.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* GL Penalty Account (Revenue) */}
              <div className="space-y-2">
                <Label htmlFor="gl_penalty_revenue" className="text-black">
                  Penalty GL Account (Revenue)
                </Label>
                <Select
                  value={values.gl_penalty_revenue}
                  onValueChange={(value) => setFieldValue("gl_penalty_revenue", value)}
                  // disabled={true}
                >
                  <SelectTrigger className="border-black w-full bg-gray-50">
                    <SelectValue placeholder="Penalty Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {glAccounts?.map((acc) => (
                      <SelectItem key={acc.id || acc.reference} value={acc.name}>
                        {acc.name} ({acc.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* GL Processing Fee Account (Revenue) */}
              <div className="space-y-2">
                <Label htmlFor="gl_processing_fee_revenue" className="text-black">
                  Processing Fee GL Account (Revenue)
                </Label>
                <Select
                  value={values.gl_processing_fee_revenue}
                  onValueChange={(value) => setFieldValue("gl_processing_fee_revenue", value)}
                  // disabled={true}
                >
                  <SelectTrigger className="border-black w-full bg-gray-50">
                    <SelectValue placeholder="Processing Fee Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {glAccounts?.map((acc) => (
                      <SelectItem key={acc.id || acc.reference} value={acc.name}>
                        {acc.name} ({acc.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-black text-black hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#ea1315] hover:bg-[#c71012] text-white"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateLoanProduct;
