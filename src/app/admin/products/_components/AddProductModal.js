import CustomModal from "@/components/CustomModal/CustomModal";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import USelect from "@/components/Form/USelect";
import UTags from "@/components/Form/UTags";
import UTextArea from "@/components/Form/UTextArea";
import UUpload from "@/components/Form/UUpload";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import { useAddProductMutation } from "@/redux/api/productsApi";
import { productValidationSchema } from "@/schema/productValidationSchema";
import { errorToast, successToast } from "@/utils/customToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";

export default function AddProductModal({ open, setOpen , categories}) {
  const [addProduct, { isLoading: isAddingProduct }] = useAddProductMutation();
 
  const handleSubmit = async (data) => { 
    const image = data.image[0].originFileObj;
    delete data["image"];

    const formData = new FormData();

    formData.append("image", image);
    formData.append("data", JSON.stringify(data));

    try {
      await addProduct(formData).unwrap();

      successToast("Product added successfully!");
      setOpen(false);
    } catch (error) {
      errorToast(error?.message || error?.data?.message);
    }
  };

  return (
    <CustomModal open={open} setOpen={setOpen} title={"Add Product"}>
      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(
          productValidationSchema.addProductValidationSchema,
        )}
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
          options={categories.map((category) => ({
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
          loading={isAddingProduct}
        >
          Submit
        </Button>


      
      </FormWrapper>
    </CustomModal>
  );
}
