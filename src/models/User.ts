import { Schema, model, models } from 'mongoose';

export interface UserDoc {
  email: string;
  passwordHash: string;
  name: string;
  role: 'customer' | 'admin';
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    shippingAddress: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    wishlist: { type: [String], default: [] },
  },
  { timestamps: true, collection: 'users' }
);

export const UserModel = models.User || model('User', userSchema);
