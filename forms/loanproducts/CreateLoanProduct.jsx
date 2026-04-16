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
import { createLoanProduct } from "@/services/loanproducts";
import { useFetchGLAccounts } from "@/hooks/glaccounts/actions";
import toast from "react-hot-toast";

function CreateLoanProduct({ isOpen, onClose, refetchLoanTypes }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();
  const { data: glAccounts, isLoading: isLoadingGL } = useFetchGLAccounts();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">
            Create New Loan Type
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name: "",
            interest_method: "", //Choices are:  INTEREST_METHOD_CHOICES = [("Flat", "Flat-rate"),("Reducing", "Reducing (Diminishing) Balance"),]
            interest_rate: 0,
            processing_fee: 0,
            gl_principal_asset: "", //GL Account Name
            gl_penalty_revenue: "", //GL Account Name
            gl_interest_revenue: "", //GL Account Name
            gl_processing_fee_revenue: "", //GL Account Name
          }}
          onSubmit={async (values) => {
            try {
              setLoading(true);
              await createLoanProduct(values, token);
              toast?.success("Loan product created successfully!");
              onClose();
              refetchLoanTypes();
            } catch (error) {
              toast?.error("Failed to create loan product!");
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
                <Label htmlFor="interest_method" className="text-black">
                  Interest Method
                </Label>
                <Select
                  value={values.interest_method}
                  onValueChange={(value) => setFieldValue("interest_method", value)}
                  required
                >
                  <SelectTrigger className="border-black w-full">
                    <SelectValue placeholder="Select Interest Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flat">Flat-rate</SelectItem>
                    <SelectItem value="Reducing">
                      Reducing (Diminishing) Balance
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                  disabled={isLoadingGL}
                >
                  <SelectTrigger className="border-black w-full">
                    <SelectValue
                      placeholder={
                        isLoadingGL ? "Loading..." : "Select Principal Account"
                      }
                    />
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
                  disabled={isLoadingGL}
                >
                  <SelectTrigger className="border-black w-full">
                    <SelectValue
                      placeholder={
                        isLoadingGL ? "Loading..." : "Select Interest Account"
                      }
                    />
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
                  disabled={isLoadingGL}
                >
                  <SelectTrigger className="border-black w-full">
                    <SelectValue
                      placeholder={
                        isLoadingGL ? "Loading..." : "Select Penalty Account"
                      }
                    />
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
                  disabled={isLoadingGL}
                >
                  <SelectTrigger className="border-black w-full">
                    <SelectValue
                      placeholder={
                        isLoadingGL ? "Loading..." : "Select Processing Fee Account"
                      }
                    />
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
                  disabled={loading || isLoadingGL}
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLoanProduct;
