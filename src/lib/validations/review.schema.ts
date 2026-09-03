import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z
    .number({ message: 'Rating is required' })
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  title: z
    .string({ message: 'Title is required' })
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  comment: z
    .string({ message: 'Comment is required' })
    .trim()
    .min(5, 'Review comment must be at least 5 characters')
    .max(1000, 'Review comment cannot exceed 1000 characters'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
