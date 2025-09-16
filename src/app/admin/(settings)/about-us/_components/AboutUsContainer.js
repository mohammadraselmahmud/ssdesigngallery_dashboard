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

const aboutUsValidationSchema = object({
  aboutUs: string().optional(),
});

export default function AboutUsContainer() {
  const { data: aboutUsRes, isLoading: isContentLoading } =
    useGetContentsQuery();

  const [updateFn, { isLoading }] = useUpdateContentMutation();

  const aboutUsData = aboutUsRes?.data?.data[0]?.aboutUs || "";

  const onSubmit = async (data) => {
    try {
      await updateFn({
        aboutUs: data.aboutUs,
      }).unwrap();

      successToast("About Us is updated");
    } catch (error) {
      errorToast("Error updating about us.");
    }
  };

  if (isContentLoading) {
    return <PageLoader />;
  }

  const defaultValues = {
    aboutUs: aboutUsData,
  };

  return (
    <section>
      <h3 className="mb-6 text-2xl font-semibold text-white">About Us</h3>

      <FormWrapper
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        resolver={zodResolver(aboutUsValidationSchema)}
      >
        <UTextEditor
          name="aboutUs"
          placeholder="Note: Enter details about the website here. (e.g How and why did you come up with the idea? etc)"
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
