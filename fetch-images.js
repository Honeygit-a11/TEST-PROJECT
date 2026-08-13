import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const tokenMatch = envContent.match(/FIGMA_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

async function fetchImages() {
  const res = await fetch('https://api.figma.com/v1/files/jmfK9UfJLgm7NYkBNobBmX/images', {
    headers: { 'X-Figma-Token': token }
  });
  const data = await res.json();
  console.log('Image URLs fetched count:', Object.keys(data.meta?.images || {}).length);
  fs.writeFileSync(path.join(__dirname, 'figma-images-map.json'), JSON.stringify(data.meta?.images || {}, null, 2));
}

fetchImages();
