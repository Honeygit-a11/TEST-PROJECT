import { z } from 'zod';

export const createSubscriberSchema = z.object({
  email: z
    .string({ message: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  source: z.string().optional().default('footer'),
});

export type CreateSubscriberInput = z.infer<typeof createSubscriberSchema>;
