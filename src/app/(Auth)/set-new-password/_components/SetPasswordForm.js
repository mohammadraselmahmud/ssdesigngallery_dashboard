"use client";

import CustomFormError from "@/components/CustomFormError/CustomFormError";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { resetPassSchema } from "@/schema/authSchema";
import { SuccessModal } from "@/utils/modalHook";
import { removeFromSessionStorage } from "@/utils/sessionStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SetPasswordForm() {
  const [updatePassword, { isLoading }] = useResetPasswordMutation();
  const [formError, setFormError] = useState(null);
  const router = useRouter();

  const onUpdatePassSubmit = async (data) => {
    try {
      const res = await updatePassword(data).unwrap();

      if (res?.success) {
        SuccessModal(
          "Password Updated Successfully",
          "Please login with new password",
        );

        // Remove forget password token
        removeFromSessionStorage("changePassToken");

        // Send to login page
        router.push("/login");
        setFormError(null);
      }
    } catch (error) {
      setFormError(error?.data?.message || error?.error || error?.message);
    }
  };

  return (
    <div className="px-6 py-8">
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Set New Password</h4>
        <p className="text-dark-gray">Enter your new password login</p>
      </section>

      <FormWrapper
        onSubmit={onUpdatePassSubmit}
        resolver={zodResolver(resetPassSchema)}
      >
        <UInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!mb-0 !h-10"
        />

        <UInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!mb-0 !h-10"
        />

        <Button
          htmlType="submit"
          type="primary"
          size="large"
          className="!h-10 w-full !font-semibold"
          loading={isLoading}
        >
          Submit
        </Button>

        {formError && <CustomFormError message={formError} />}
      </FormWrapper>
    </div>
  );
}
