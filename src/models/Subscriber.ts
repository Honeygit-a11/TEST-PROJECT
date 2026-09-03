import { Schema, model, models } from 'mongoose';

export interface SubscriberDoc {
  email: string;
  status: 'active' | 'unsubscribed';
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriberSchema = new Schema<SubscriberDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
    source: { type: String, default: 'footer' },
  },
  { timestamps: true, collection: 'subscribers' }
);

export const SubscriberModel = models.Subscriber || model('Subscriber', subscriberSchema);
