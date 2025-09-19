import * as z from "zod";
import { imageFileSchema, imageFileSchemaOptional } from "./imageFileSchema";

export const addSliderSchema = z.object({ 
  image: imageFileSchema
});


export const updateSliderSchema = z.object({ 
  image: imageFileSchemaOptional
});
