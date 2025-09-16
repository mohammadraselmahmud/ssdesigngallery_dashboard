import * as z from "zod";
import {
  imageFileSchema,
  imageFileSchemaOptional,
  videoFileSchemaOptional,
} from "./imageFileSchema";

export const createClassSchema = z.object({
  banner: imageFileSchema,
  video: videoFileSchemaOptional,
  title: z
    .string({ required_error: "Title is required." })
    .min(1, "Title is required."),
  category: z
    .string({ required_error: "Category is required." })
    .min(1, "Category is required."),
  instructor: z
    .string({ required_error: "Instructor is required." })
    .min(1, "Instructor is required."),
  totalSeats: z.coerce
    .number({ required_error: "Total seat number is required." })
    .min(1, "Total seat number is required."),
  // classTime: z.coerce.string(),
  // classDate: z
  //   .string({ required_error: "Class date is required." })
  //   .min(1, "Class date is required."),

  description: z
    .string({ required_error: "Class description is required." })
    .min(1, "Class description is required."),
});

export const editClassSchema = z.object({
  banner: imageFileSchemaOptional,
  video: videoFileSchemaOptional,
  title: z
    .string({ required_error: "Title is required." })
    .min(1, "Title is required.")
    .optional(),
  category: z
    .string({ required_error: "Category is required." })
    .min(1, "Category is required.")
    .optional(),
  instructor: z
    .string({ required_error: "Instructor is required." })
    .min(1, "Instructor is required.")
    .optional(),
  totalSeats: z.coerce
    .number({ required_error: "Total seat number is required." })
    .min(1, "Total seat number is required.")
    .optional(),
  description: z
    .string({ required_error: "Class description is required." })
    .min(1, "Class description is required.")
    .optional(),
});
