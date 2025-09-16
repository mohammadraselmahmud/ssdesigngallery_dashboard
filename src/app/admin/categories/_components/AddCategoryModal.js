import CustomModal from "@/components/CustomModal/CustomModal";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput"; 
import UUpload from "@/components/Form/UUpload";
import { useCreateCategoryMutation } from "@/redux/api/categoryApi";
import { addCategorySchema } from "@/schema/categorySchema";
import { errorToast, successToast } from "@/utils/customToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Upload } from "antd"; 
import React from "react";

export default function AddCategoryModal({ open, setOpen }) {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const handleSubmit = async (data) => {
 
    const formData = new FormData();

    if (data.image) {
      const image = data.image[0].originFileObj; 

      formData.append("image", image);
    }
    formData.append("data", JSON.stringify(data));

    try {
      await createCategory(formData).unwrap(); 
    } catch (error) {
      errorToast(error?.message || error?.data?.message);
    }
  };

  return (
    <CustomModal open={open} setOpen={setOpen} title="Create a category">
      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(addCategorySchema)}
      >
        <UUpload
          name="image"
          label="Category Image"
          uploadTitle="Category image"
        />
        <UInput
          name="name"
          label="Name"
          type="text"
          placeholder="Enter your name"
        />

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="w-full"
          loading={isLoading}
        >
          Submit
        </Button>
      </FormWrapper>
    </CustomModal>
  );
}
