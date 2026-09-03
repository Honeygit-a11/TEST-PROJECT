import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neo-archive';

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

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function seed() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  await mongoose.connect(MONGODB_URI, { dbName: 'neo-archive' });

  for (const product of products) {
    const payload = {
      ...product,
      stock: product.stock ?? 25,
      inStock: (product.stock ?? 25) > 0,
    };
    await Product.updateOne({ id: product.id }, payload, { upsert: true });
  }

  const count = await Product.countDocuments();
  console.log(`Seeded ${products.length} products. Total in DB: ${count}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
