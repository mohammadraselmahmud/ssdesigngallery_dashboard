import * as z from "zod";
import { imageFileSchema, imageFileSchemaOptional } from "./imageFileSchema";

export const addCategorySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" }),
  image: imageFileSchema
});


export const updateCategorySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" }),
  image: imageFileSchemaOptional
});
