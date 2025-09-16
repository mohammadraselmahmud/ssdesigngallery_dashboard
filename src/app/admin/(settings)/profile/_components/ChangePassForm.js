"use client";

import CustomFormError from "@/components/CustomFormError/CustomFormError";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { useChangeAdminPrivacyPasswordMutation } from "@/redux/api/authApi";
import { logout } from "@/redux/features/authSlice";
import { changePasswordSchema } from "@/schema/profileSchema";
import { ConfirmModal } from "@/utils/modalHook";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react"; 
import { useDispatch } from "react-redux";

export default function ChangePassForm() { 
  const router = useRouter();
  const dispatch = useDispatch();
  const [formError, setFormError] = useState("");

  // Change password api handler
  const [changePassword, { isLoading }] = useChangeAdminPrivacyPasswordMutation();

  const onSubmit = async (data) => { 
    try {
      await changePassword(data).unwrap();

      // Prompt user to logout
      ConfirmModal(
        "Password changed successfully",
        "Do you want to logout and login with new password?",
        "Logout",
        "Not right now",
      ).then((res) => {
        if (res?.isConfirmed) {
          dispatch(logout());
          router.refresh();
          router.push("/login");
        } else {
          // do nothing
        }
      });
    } catch (error) {
      setFormError(error?.data?.message || error?.error || error?.message);
    }
  };

  return (
    <section className="mt-5 px-10">
      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(changePasswordSchema)}
      >
        <UInput
          name="oldPassword"
          type="password"
          label="Old Password"
          placeholder="***********"
        />
        <UInput
          name="newPassword"
          type="password"
          label="New Password"
          placeholder="***********"
        />
        <UInput
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="***********"
        />

        <Button
          htmlType="submit"
          className="w-full"
          size="large"
          type="primary"
          loading={isLoading}
        >
          Save
        </Button>

        {formError && <CustomFormError formError={formError} />}
      </FormWrapper>
    </section>
  );
}
