import CustomModal from "@/components/CustomModal/CustomModal";
import FormWrapper from "@/components/Form/FormWrapper"; 
import UUpload from "@/components/Form/UUpload"; 
import { updateSliderSchema } from "@/schema/sliderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd"; 

export default function EditSliderModal({ open, setOpen, selectedData, handleEdit, isLoading}) {



  return (
    <CustomModal open={open} setOpen={setOpen} title="Edit Slider">
      <FormWrapper
        onSubmit={handleEdit}
        resolver={zodResolver(updateSliderSchema)} 
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
