import { z } from 'zod';

export const createPromoCodeSchema = z.object({
  code: z
    .string({ message: 'Promo code is required' })
    .trim()
    .min(2, 'Code must be at least 2 characters')
    .max(30, 'Code cannot exceed 30 characters')
    .toUpperCase(),
  discountType: z.enum(['percentage', 'fixed'], {
    message: 'Discount type must be either "percentage" or "fixed"',
  }),
  discountValue: z
    .number({ message: 'Discount value is required' })
    .min(0.01, 'Discount value must be greater than 0'),
  minSubtotal: z.number().min(0, 'Minimum subtotal cannot be negative').default(0),
  maxUses: z.number().int().min(1, 'Max uses must be at least 1').nullable().optional(),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
  active: z.boolean().default(true),
});

export const updatePromoCodeSchema = z.object({
  code: z
    .string({ message: 'Promo code is required' })
    .trim()
    .min(2, 'Code must be at least 2 characters')
    .max(30, 'Code cannot exceed 30 characters')
    .toUpperCase()
    .optional(),
  discountType: z
    .enum(['percentage', 'fixed'], {
      message: 'Discount type must be either "percentage" or "fixed"',
    })
    .optional(),
  discountValue: z
    .number({ message: 'Discount value is required' })
    .min(0.01, 'Discount value must be greater than 0')
    .optional(),
  minSubtotal: z.number().min(0, 'Minimum subtotal cannot be negative').optional(),
  maxUses: z.number().int().min(1, 'Max uses must be at least 1').nullable().optional(),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
  active: z.boolean().optional(),
});

export const validatePromoSchema = z.object({
  code: z.string({ message: 'Code is required' }).trim().min(1, 'Code cannot be empty'),
  subtotal: z.number({ message: 'Subtotal is required' }).min(0, 'Subtotal cannot be negative'),
});

export type CreatePromoCodeInput = z.infer<typeof createPromoCodeSchema>;
export type UpdatePromoCodeInput = z.infer<typeof updatePromoCodeSchema>;
export type ValidatePromoInput = z.infer<typeof validatePromoSchema>;
