import CustomModal from "@/components/CustomModal/CustomModal";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import UTextArea from "@/components/Form/UTextArea";
import UUpload from "@/components/Form/UUpload";
import { updateCategorySchema } from "@/schema/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd"; 

export default function EditCategoryModal({ open, setOpen, selectedCategory, handleEditCategory, isLoading}) {

  const defaultValues = {
    name: selectedCategory?.name,
    prompt: selectedCategory?.prompt,
  };

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
          placeholder="Enter category name"
        />
        <UTextArea
          name="prompt"
          label="Prompt"
          placeholder="Enter prompt"
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
