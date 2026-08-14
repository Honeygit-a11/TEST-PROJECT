import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generatedImagePath = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\59a00a57-60d9-4efd-a61e-5c8f055198fd\\hero_streetwear_editorial_1786701984944.jpg';
const dest1 = path.join(__dirname, 'public', 'hero-streetwear.jpg');
const dest2 = path.join(__dirname, 'public', 'hero-30-12.png');

if (fs.existsSync(generatedImagePath)) {
  fs.copyFileSync(generatedImagePath, dest1);
  fs.copyFileSync(generatedImagePath, dest2);
  console.log('Successfully copied sharp generated hero image to public/hero-streetwear.jpg and public/hero-30-12.png');
} else {
  console.error('Source image not found:', generatedImagePath);
}
