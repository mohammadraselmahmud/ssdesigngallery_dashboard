"use client";

import CustomModal from "@/components/CustomModal/CustomModal";
import FormWrapper from "@/components/Form/FormWrapper";
import UUpload from "@/components/Form/UUpload";
import { useUpdateProfileMutation } from "@/redux/api/authApi";
import { imageFileSchemaOptional } from "@/schema/imageFileSchema";
import { errorToast } from "@/utils/customToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { z } from "zod";

const validationSchema = z.object({
  image: imageFileSchemaOptional,
});

export default function ChangeProfilePicModal({ open, setOpen, profile }) {
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleSubmit = async (data) => {
    if (data?.image?.length > 0) {
      if (!data?.image[0]?.originFileObj) {
        return errorToast("Please select a new image!!");
      }
    }

    const formData = new FormData();
    formData.append("image", data?.image[0]?.originFileObj);

    try {
      await updateProfile(formData).unwrap();
    } catch (error) {
      errorToast(error?.message || error?.data?.message);
    } finally {
      setOpen(false);
    }
  };

  if (!profile?._id) {
    return;
  }

  const defaultValues = {
    image: profile?.image
      ? [
          {
            uid: "-1",
            name: "profile_image",
            url: profile?.image,
            status: "completed",
          },
        ]
      : [],
  };

  return (
    <CustomModal open={open} setOpen={setOpen} title="Change Profile Picture">
      <FormWrapper
        defaultValues={defaultValues}
        resolver={zodResolver(validationSchema)}
        onSubmit={handleSubmit}
      >
        <UUpload
          name={"image"}
          label={"Profile Picture"}
          maxCount={1}
          uploadTitle={"profile picture"}
        />

        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          loading={isUpdating}
        >
          Submit
        </Button>
      </FormWrapper>
    </CustomModal>
  );
}
