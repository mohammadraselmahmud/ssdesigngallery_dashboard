import CustomModal from "@/components/CustomModal/CustomModal";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import UUpload from "@/components/Form/UUpload";
import { updateCategorySchema } from "@/schema/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd"; 

export default function EditCategoryModal({ open, setOpen, selectedCategory, handleEditCategory, isLoading}) {

  const defaultValues ={
    name:selectedCategory?.name
  }

  return (
    <CustomModal open={open} setOpen={setOpen} title="Edit Category">
      <FormWrapper
        onSubmit={handleEditCategory}
        resolver={zodResolver(updateCategorySchema)}
        defaultValues={defaultValues}
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
