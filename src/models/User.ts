import { Schema, model, models } from 'mongoose';

export interface UserDoc {
  email: string;
  passwordHash: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  },
  { timestamps: true, collection: 'users' }
);

export const UserModel = models.User || model('User', userSchema);
