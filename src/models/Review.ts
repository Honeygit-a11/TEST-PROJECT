import { Schema, model, models } from 'mongoose';

export interface ReviewDoc {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<ReviewDoc>(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    verifiedBuyer: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'reviews' }
);

export const ReviewModel = models.Review || model('Review', reviewSchema);
