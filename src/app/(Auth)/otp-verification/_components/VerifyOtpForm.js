"use client";

import CustomFormError from "@/components/CustomFormError/CustomFormError";
import FormWrapper from "@/components/Form/FormWrapper";
import UOtpInput from "@/components/Form/UOtpInput";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/api/authApi";
import { errorToast, successToast } from "@/utils/customToast";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import {
  getFromSessionStorage,
  removeFromSessionStorage,
  setToSessionStorage,
} from "@/utils/sessionStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";

const otpValidationSchema = z.object({
  otp: z.string().min(6, "Invalid OTP").max(6, "Invalid OTP"),
});

export default function VerifyOtpForm() {
  const [formError, setFormError] = useState(null);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(180); // Timer in seconds
  const router = useRouter();

  const [verifyOtp, { isLoading: isVerifyOtpLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResendOtpLoading }] = useResendOtpMutation();

  // Handle Resend OTP functionality
  const handleResendOtp = async () => {
    try {
      const res = await resendOtp({
        email: jwtDecode(getFromSessionStorage("forgotPassToken"))?.email,
      }).unwrap();

      if (res?.success) {
        successToast("OTP re-sent successful");
        setToSessionStorage("forgotPassToken", res?.data?.token);

        // Disable resend button and start the timer
        setIsResendDisabled(true);

        // Set the timer for 3 minutes (180 seconds)
        setTimer(180);

        // Countdown every second
        const countdownInterval = setInterval(() => {
          setTimer((prev) => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              setIsResendDisabled(false); // Re-enable the button after the timer ends
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      errorToast(error?.data?.message || error?.message);
    }
  };

  // Format the timer to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleVerifyOtp = async (data) => {
    try {
      const res = await verifyOtp({ otp: data.otp }).unwrap();

      if (res?.success) {
        SuccessModal("OTP Verification Successful");

        // remove forgotPassToken
        removeFromSessionStorage("forgotPassToken");

        // set change-pass token
        setToSessionStorage("changePassToken", res?.data?.token);

        // navigate to login page
        router.push("/set-new-password");
      }
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  return (
    <div className="px-6 py-8">
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Verify OTP</h4>
        <p className="text-dark-gray">
          Enter the otp that we&apos;ve sent to your email
        </p>
      </section>

      <FormWrapper
        onSubmit={handleVerifyOtp}
        resolver={zodResolver(otpValidationSchema)}
      >
        <UOtpInput name="otp" />

        <Button
          htmlType="submit"
          type="primary"
          size="large"
          className="!h-10 w-full"
        >
          Submit
        </Button>

        <p className="mx-auto mt-2 w-max font-medium text-[#8a8888]">
          Didn&apos;t get the code?{" "}
          <Button
            htmlType="button"
            type="link"
            className="text-primary-blue px-0"
            onClick={handleResendOtp}
            disabled={isResendDisabled || isResendOtpLoading}
          >
            {isResendDisabled ? `Resend in ${formatTime(timer)}` : "Resend"}
          </Button>
        </p>

        {formError && <CustomFormError formError={formError} />}
      </FormWrapper>
    </div>
  );
}
