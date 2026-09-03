import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be empty').optional(),
  shippingAddress: z
    .object({
      address: z.string().trim().default(''),
      city: z.string().trim().default(''),
      postalCode: z.string().trim().default(''),
      country: z.string().trim().default(''),
    })
    .optional(),
  wishlist: z.array(z.string().trim()).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
