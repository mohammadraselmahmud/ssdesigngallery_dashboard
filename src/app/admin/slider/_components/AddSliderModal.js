import CustomModal from "@/components/CustomModal/CustomModal";
import FormWrapper from "@/components/Form/FormWrapper"; 
import UUpload from "@/components/Form/UUpload"; 
import { useCreateSliderMutation } from "@/redux/api/sliderApi"; 
import { addSliderSchema } from "@/schema/sliderSchema";
import { errorToast } from "@/utils/customToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd"; 
import React from "react";

export default function AddSliderModal({ open, setOpen }) {
  const [createSlider, { isLoading }] = useCreateSliderMutation();
  const handleSubmit = async (data) => {
 
    const formData = new FormData();

    if (data.image) {
      const image = data.image[0].originFileObj; 

      formData.append("image", image);
    } 

    try {
      await createSlider(formData).unwrap(); 
      setOpen(false);
    } catch (error) {
      errorToast(error?.message || error?.data?.message);
    }
  };

  return (
    <CustomModal open={open} setOpen={setOpen} title="Create a Slider">
      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(addSliderSchema)}
      >
        <UUpload
          name="image"
          label="Slider Image"
          uploadTitle="Slider image"
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
