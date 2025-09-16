"use client";

import CustomModal from "@/components/CustomModal/CustomModal";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import USelect from "@/components/Form/USelect";
import UTags from "@/components/Form/UTags"; 
import UUpload from "@/components/Form/UUpload"; 
import { productValidationSchema } from "@/schema/productValidationSchema"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
export default function EditProductModal({
  open,
  setOpen,
  categories, 
  isLoading,handleSubmit,
  selectedProduct = {},
}) { 
  if (!selectedProduct?._id) return;

  const defaultValues = {
    productName: selectedProduct?.productName,
    categoryId:selectedProduct?.categoryId,
    productPrice: selectedProduct?.productPrice,
    productDescription: selectedProduct?.productDescription,  
  };

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      title={selectedProduct?._id ? "Edit Product" : "Add Product"}
    >
      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(
          productValidationSchema.editProductValidationSchema,
        )}
        defaultValues={defaultValues}
      >
           <UUpload
          name="image"
          label="Product Image"
          uploadTitle="Product Image"
          maxCount={1}
        />

        <UInput
          name="productName"
          label="Name"
          placeholder="Enter your name"
          required={true}
        />
           <USelect
          name="categoryId"
          options={categories?.map((category) => ({
            value: category._id,
            label: category?.name,
          }))}
          label={"Select Category"}
          placeholder={"Select Category"}
        />

        <UInput
          type="number"
          name="productPrice"
          label="Price"
          placeholder="Enter your price"
          required={true}
        /> 
          <UTags
          label="Enter Tags" 
          name="productDescription"
           placeholder="Enter Tags"   
             required={true}
             />

        <Button
          htmlType="submit"
          type="primary"
          className="w-full"
          size="large"
          loading={isLoading}
        >
          Submit
        </Button>
      </FormWrapper>
    </CustomModal>
  );
}
