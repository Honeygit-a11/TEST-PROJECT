import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neo-archive';

// Define Schemas
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true, collection: 'users' }
);

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    index: String,
    sku: String,
    name: String,
    color: String,
    category: String,
    price: Number,
    image: String,
    images: [String],
    description: String,
    tag: String,
    badgeJapanese: String,
    season: String,
    details: {
      gsm: String,
      fabric: String,
      fit: String,
      origin: String,
      edition: String,
    },
    sizes: [String],
    stock: { type: Number, default: 25 },
    inStock: Boolean,
    featured: Boolean,
  },
  { timestamps: true, collection: 'products' }
);

const promoCodeSchema = new mongoose.Schema(
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

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const PromoCode = mongoose.models.PromoCode || mongoose.model('PromoCode', promoCodeSchema);

async function resetAndSeed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: 'neo-archive' });
  console.log('Connected to MongoDB.');

  const db = mongoose.connection.db;

  // 1. Purge dummy test collections
  console.log('Purging dummy collections (orders, reviews, subscribers)...');
  await db.collection('orders').deleteMany({});
  await db.collection('reviews').deleteMany({});
  await db.collection('subscribers').deleteMany({});
  await db.collection('users').deleteMany({});
  await db.collection('promocodes').deleteMany({});
  console.log('Dummy test data removed.');

  // 2. Seed Official Catalogue Products
  console.log('Seeding official catalog products from products.json...');
  const dataPath = path.join(process.cwd(), 'src', 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  await Product.deleteMany({});
  for (const p of products) {
    await Product.create({
      ...p,
      stock: 30, // pristine starting stock
      inStock: true,
    });
  }
  console.log(`Seeded ${products.length} official catalog artifacts.`);

  // 3. Seed Admin and Customer Users
  console.log('Seeding Admin and Customer accounts...');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await User.create({
    email: 'admin@neoarchive.com',
    passwordHash: adminPasswordHash,
    name: 'Archive Director',
    role: 'admin',
    shippingAddress: {
      address: '101 Brutalist Way, Penthouse Archive',
      city: 'Berlin',
      postalCode: '10115',
      country: 'Germany',
    },
  });

  const customerPasswordHash = await bcrypt.hash('customer123', 10);
  const customerUser = await User.create({
    email: 'customer@neoarchive.com',
    passwordHash: customerPasswordHash,
    name: 'Julian Vane',
    role: 'customer',
    shippingAddress: {
      address: '404 Concrete Boulevard, Apt 4B',
      city: 'London',
      postalCode: 'SE1 9SG',
      country: 'United Kingdom',
    },
  });

  console.log(`Admin created: ${adminUser.email} (Password: admin123)`);
  console.log(`Customer created: ${customerUser.email} (Password: customer123)`);

  // 4. Seed Official Promo Campaigns
  console.log('Seeding official launch promo codes...');
  await PromoCode.create([
    {
      code: 'ARCHIVE10',
      discountType: 'percentage',
      discountValue: 10,
      minSubtotal: 0,
      active: true,
      maxUses: 1000,
      usedCount: 0,
    },
    {
      code: 'NEO20',
      discountType: 'percentage',
      discountValue: 20,
      minSubtotal: 0,
      active: true,
      maxUses: 500,
      usedCount: 0,
    },
  ]);
  console.log('Seeded promo codes: ARCHIVE10 (10%), NEO20 (20%).');

  console.log('\n========================================');
  console.log('DATABASE RESET & SEED COMPLETED SUCCESSFULLY!');
  console.log('========================================');
  console.log('ADMIN CREDENTIALS:');
  console.log('  Email:    admin@neoarchive.com');
  console.log('  Password: admin123');
  console.log('  Role:     admin');
  console.log('----------------------------------------');
  console.log('CUSTOMER CREDENTIALS:');
  console.log('  Email:    customer@neoarchive.com');
  console.log('  Password: customer123');
  console.log('  Role:     customer');
  console.log('========================================\n');

  await mongoose.disconnect();
}

resetAndSeed().catch((err) => {
  console.error('Reset and seed error:', err);
  process.exit(1);
});
