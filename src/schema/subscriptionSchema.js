"use client";

import * as z from "zod";

export const createSubscriptionSchema = z.object({
  price: z.coerce
    .number({ required_error: "Price is required" })
    .min(1, { message: "Price is required" }),
  totalClasses: z.coerce
    .number({ required_error: "Total classes is required" })
    .min(1, { message: "Total classes is required" }),
  className: z.string().optional(),
});
