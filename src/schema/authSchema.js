import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password is required" }),
});

export const forgotPassSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" }),
});

export const otpSchema = z.object({
  otp: z
    .string({ required_error: "OTP is required" })
    .min(1, { message: "OTP is required" }),
});

export const resetPassSchema = z
  .object({
    newPassword: z
      .string({ required_error: "New password is required" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character",
      )
      .min(1, { message: "New password is required" })
      .max(20, "Password must be at most 20 characters long"),

    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(1, { message: "Confirm Password is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });
