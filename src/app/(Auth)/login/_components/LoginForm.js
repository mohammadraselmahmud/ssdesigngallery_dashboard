"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/authSchema";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSignInMutation } from "@/redux/api/authApi";
import { SuccessModal } from "@/utils/modalHook";
import { setUser } from "@/redux/features/authSlice";
import { jwtDecode } from "jwt-decode";
import CustomFormError from "@/components/CustomFormError/CustomFormError";
import {  useState } from "react"; 

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formError, setFormError] = useState(null);

  // Login api handler
  const [signIn, { isLoading }] = useSignInMutation();

  const onLoginSubmit = async (data) => {

    try {
      const res = await signIn(data).unwrap(); 
      if (res?.success) {
        SuccessModal("Login Successful!");

        // Set user info into store
        dispatch(
          setUser({
            user: jwtDecode(res?.data?.accessToken),
            token: res?.data?.accessToken,
          }),
        );

        router.push("/admin/account-details");
        router.refresh();
        setFormError(null);
      }
    } catch (error) { 
      setFormError(error?.data?.message || error?.error);
    }
  };

  return (
    <div className="w-full px-6 py-8 rounded-none shadow-none shadow-primary/10 ">
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Login</h4>
        <p className="text-dark-gray">
          Enter your email and password to access admin panel
        </p>
      </section>

      <FormWrapper onSubmit={onLoginSubmit} resolver={zodResolver(loginSchema)}>
        <UInput
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          size="large"
          className="!h-10"
        />

        <UInput
          name="password"
          label="Password"
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
          Sign In
        </Button>

        {/* <Link
          href="/forgot-password"
          className="block mt-2 font-medium text-center text-primary-blue hover:text-primary-blue/85"
        >
          I forgot my password
        </Link> */}

        {/* Show form error message */}
        {formError && (
          <CustomFormError formError={formError} extraClass="mt-4" />
        )}
      </FormWrapper>
    </div>
  );
}
