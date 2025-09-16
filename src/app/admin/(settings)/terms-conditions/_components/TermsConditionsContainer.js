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

const termsAndConditionsValidationSchema = object({
  termsAndConditions: string().optional(),
});

export default function TermsConditionsContainer() {
  const { data: data, isLoading: isContentLoading } = useGetContentsQuery();

  const [updateFn, { isLoading }] = useUpdateContentMutation();

  const termsAndConditionsData = data?.data?.data[0]?.termsAndConditions || "";

  const onSubmit = async (data) => {
    try {
      await updateFn({
        termsAndConditions: data.termsAndConditions,
      }).unwrap();

      successToast("Terms and conditions is updated");
    } catch (error) {
      errorToast("Error updating terms and conditions.");
    }
  };

  if (isContentLoading) {
    return <PageLoader />;
  }

  const defaultValues = {
    termsAndConditions: termsAndConditionsData,
  };

  return (
    <section>
      <h3 className="mb-6 text-2xl font-semibold text-white">
        Terms and Conditions
      </h3>

      <FormWrapper
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        resolver={zodResolver(termsAndConditionsValidationSchema)}
      >
        <UTextEditor
          name="termsAndConditions"
          placeholder="Note: Enter details about your terms and conditions here."
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
