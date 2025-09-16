import { z } from "zod";

export const imageFileSchema = z
  .array(
    z.object({
      uid: z.string(),
      name: z.string(),
      status: z.string(),
      url: z.string().optional(),
      originFileObj: z.instanceof(File),
    }),
    { required_error: "At least one image is required" },
  )
  .min(1, { message: "At least one image is required" });

export const imageFileSchemaOptional = z
  .array(
    z.object({
      uid: z.string(),
      name: z.string(),
      status: z.string(),
      url: z.string().optional(),
      originFileObj: z.instanceof(File).optional(),
    }),
  )
  .optional();

export const videoFileSchema = z
  .array(
    z.object({
      uid: z.string().optional(),
      name: z.string(),
      status: z.string(),
      url: z.string().optional(),
      originFileObj: z.instanceof(File),
    }),
    { required_error: "At least one video is required" },
  )
  .min(1, { message: "At least one video is required" });

export const videoFileSchemaOptional = z
  .array(
    z.object({
      uid: z.string(),
      name: z.string(),
      status: z.string(),
      url: z.string().optional(),
      originFileObj: z.instanceof(File).optional(),
    }),
  )
  .optional();
