import { Schema, model, models } from 'mongoose';

export interface PromoCodeDoc {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotal: number;
  maxUses?: number;
  usedCount: number;
  active: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const promoCodeSchema = new Schema<PromoCodeDoc>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue: { type: Number, required: true, min: 0 },
    minSubtotal: { type: Number, default: 0, min: 0 },
    maxUses: { type: Number, default: null },
    usedCount: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'promocodes' }
);

export const PromoCodeModel = models.PromoCode || model('PromoCode', promoCodeSchema);
