"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import PageLoader from "@/components/shared/PageLoader/PageLoader";
import { useUpdateProfileMutation } from "@/redux/api/authApi";
import { editProfileSchema } from "@/schema/profileSchema";
import { errorToast, successToast } from "@/utils/customToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";

export default function EditProfileForm({ myProfile }) {
  const [editProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const handleSubmit = async (data) => {
    try {
      await editProfile(data).unwrap();
      successToast("Profile updated successfully!");
    } catch (error) {
      errorToast(error?.message || error?.data?.message);
    }
  };

  if (!myProfile) return <PageLoader />;

  const defaultValues = {
    name: myProfile?.name,
    email: myProfile?.email,
    phoneNumber: myProfile?.phoneNumber,
  };

  return (
    <section className="mt-5 px-10">
      {/* <h4></h4> */}
      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(editProfileSchema)}
        defaultValues={defaultValues}
      >
        <UInput
          name="name"
          label="Name"
          type="text"
          placeholder="Enter your name"
        />
        <UInput name="email" label="Email" type="email" disabled />

        <UInput
          type="text"
          name="phoneNumber"
          label="Phone Number"
          placeholder="Enter your phone number"
        />

        <Button
          htmlType="submit"
          className="w-full"
          size="large"
          type="primary"
          loading={isUpdating}
        >
          Save
        </Button>
      </FormWrapper>
    </section>
  );
}
