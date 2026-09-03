import { z } from 'zod';
import { ORDER_STATUSES } from '@/models/Order';

export const orderItemInputSchema = z.object({
  productId: z.string().trim().min(1, 'productId is required'),
  size: z.string().trim().min(1, 'size is required'),
  quantity: z.number().int('quantity must be an integer').min(1, 'quantity must be at least 1'),
});

export const customerInputSchema = z.object({
  name: z.string().trim().min(1, 'Customer name is required'),
  email: z.string().trim().email('Invalid customer email address'),
  address: z.string().trim().min(1, 'Street address is required'),
  city: z.string().trim().min(1, 'City is required'),
  postalCode: z.string().trim().min(1, 'Postal code is required'),
  country: z.string().trim().min(1, 'Country is required'),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, 'At least one item is required in the order'),
  customer: customerInputSchema,
  promoCode: z.string().trim().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES, {
    message: `Status must be one of: ${ORDER_STATUSES.join(', ')}`,
  }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
