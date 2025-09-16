"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UTextEditor from "@/components/Form/UTextEditor";
import PageLoader from "@/components/shared/PageLoader/PageLoader";
import {
  useGetContentsQuery,
  useUpdateContentMutation,
} from "@/redux/api/contentApi";
import { errorToast, successToast } from "@/utils/customToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { Edit } from "lucide-react";
import { object, string } from "zod";

const privacyPolicyValidationSchema = object({
  privacyPolicy: string().optional(),
});

export default function PrivacyPolicyContainer() {
  const { data: privacyPolicyRes, isLoading: isContentLoading } =
    useGetContentsQuery();
  const [updateFn, { isLoading }] = useUpdateContentMutation();

  const privacyPolicyData =
    privacyPolicyRes?.data?.data[0]?.privacyPolicy || "";

  const onSubmit = async (data) => {
    try {
      await updateFn({
        privacyPolicy: data.privacyPolicy,
      }).unwrap();

      successToast("Privacy policy is updated");
    } catch (error) {
      errorToast("Error updating privacy policy");
    }
  };

  if (isContentLoading) {
    return <PageLoader />;
  }

  const defaultValues = {
    privacyPolicy: privacyPolicyData,
  };

  return (
    <section>
      <h3 className="mb-4 text-2xl font-semibold text-white">Privacy Policy</h3>

      <FormWrapper
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        resolver={zodResolver(privacyPolicyValidationSchema)}
      >
        <UTextEditor
          name="privacyPolicy"
          placeholder="Note: Enter details about your privacy policy here."
        />

        <Button
          htmlType="submit"
          type="primary"
          size="large"
          className="w-full rounded-xl"
          icon={<Edit size={18} />}
          loading={isLoading}
        >
          Save Changes
        </Button>
      </FormWrapper>
    </section>
  );
}
