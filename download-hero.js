import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const tokenMatch = envContent.match(/FIGMA_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

async function fetchHeroNode() {
  console.log('Fetching node 30:12 from Figma API...');
  
  // 1. Fetch node info
  const nodeRes = await fetch('https://api.figma.com/v1/files/jmfK9UfJLgm7NYkBNobBmX/nodes?ids=30:12', {
    headers: { 'X-Figma-Token': token }
  });
  const nodeData = await nodeRes.json();
  console.log('Node details:', JSON.stringify(nodeData, null, 2));

  // 2. Export node as rendered PNG image
  const imgRes = await fetch('https://api.figma.com/v1/images/jmfK9UfJLgm7NYkBNobBmX?ids=30:12&format=png&scale=2', {
    headers: { 'X-Figma-Token': token }
  });
  const imgData = await imgRes.json();
  console.log('Exported image response:', imgData);

  const imgUrl = imgData.images ? imgData.images['30:12'] : null;
  if (imgUrl) {
    console.log('Downloading image from:', imgUrl);
    const downloadRes = await fetch(imgUrl);
    const arrayBuffer = await downloadRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const heroPath = path.join(publicDir, 'hero-30-12.png');
    fs.writeFileSync(heroPath, buffer);
    console.log('Successfully saved hero image to:', heroPath);
  } else {
    console.log('Could not get image URL from export endpoint.');
  }
}

fetchHeroNode().catch(console.error);
