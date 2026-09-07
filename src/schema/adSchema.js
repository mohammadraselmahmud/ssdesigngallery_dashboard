import { z } from "zod";

const fileListSchema = z
  .array(
    z.object({
      uid: z.string().optional(),
      name: z.string().optional(),
      status: z.string().optional(),
      url: z.string().optional(),
      originFileObj: z.any().optional(),
    }),
  )
  .optional();

const dateSchema = z
  .string()
  .optional()
  .nullable()
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
    message: "Enter a valid expiration date",
  });

const adFields = {
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
  description: z.string().optional(),
  link: z
    .string()
    .trim()
    .url({ message: "Enter a valid URL" })
    .or(z.literal(""))
    .optional(),
  isActive: z.boolean().optional(),
  expiredAt: dateSchema,
  image: fileListSchema,
  video: fileListSchema,
};

export const createAdSchema = z.object(adFields);
export const updateAdSchema = z.object({
  ...adFields,
  title: adFields.title.optional(),
});
