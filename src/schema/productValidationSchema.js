import { z } from "zod";
import { imageFileSchema, imageFileSchemaOptional } from "./imageFileSchema";

const addProductValidationSchema = z.object({
  productName: z.string().min(1, { message: "Name is required" }).optional(),
  productPrice: z.coerce.number().min(1, { message: "Price is required" }).optional(),
  image: imageFileSchema,
  categoryId: z.string({message:"Category is required"}),
  productDescription: z.array(z.string())
    .min(1, { message: "At least one tag is required" }),
});

const editProductValidationSchema = z.object({
  productName: z.string().min(1, { message: "Name is required" }).optional(),
  productPrice: z.coerce.number().min(1, { message: "Price is required" }).optional(),
  image: imageFileSchemaOptional,
  categoryId: z.string({message:"Category is required"}).optional(),
  productDescription: z
    .string()
    .array(z.string())
    .min(1, { message: "At least one tag is required" }).optional(),
}).deepPartial();

export const productValidationSchema = {
  addProductValidationSchema,
  editProductValidationSchema,
};
