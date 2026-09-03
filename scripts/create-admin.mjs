import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neo-archive';

// Credentials: env vars take precedence, then CLI args, then dev defaults.
// Usage: node --env-file=.env scripts/create-admin.mjs [email] [password] [name]
const email = (process.env.ADMIN_EMAIL || process.argv[2] || 'admin@neo-archive.local').toLowerCase();
const password = process.env.ADMIN_PASSWORD || process.argv[3] || 'archive-admin';
const name = process.env.ADMIN_NAME || process.argv[4] || 'Archive Admin';
const usingDefaultPassword = !process.env.ADMIN_PASSWORD && !process.argv[3];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  },
  { timestamps: true, collection: 'users' }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function run() {
  await mongoose.connect(MONGODB_URI, { dbName: 'neo-archive' });

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email }).lean();

  // Upsert: creates the admin, or promotes/updates an existing user to admin.
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { passwordHash, name, role: 'admin' } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  console.log(`${existing ? 'Updated' : 'Created'} admin: ${user.email} (role=${user.role})`);
  if (usingDefaultPassword) {
    console.log(`WARNING: used the default dev password "${password}". Override with ADMIN_PASSWORD or a CLI arg for anything real.`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('create-admin failed:', err);
  process.exit(1);
});
