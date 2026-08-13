import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const details = JSON.parse(fs.readFileSync(path.join(__dirname, 'figma-extracted-details.json'), 'utf8'));

const shopFrame = details.find(d => d.id === '30:196' || d.name === 'NEO-ARCHIVE Shop');

if (shopFrame) {
  console.log('--- SHOP FRAME DETAILS ---');
  console.log('Name:', shopFrame.name);
  console.log('Width x Height:', shopFrame.width, 'x', shopFrame.height);
  console.log('Items Count:', shopFrame.itemsSummary?.length);
  console.log('\nText & Image Items in Shop Frame:');
  shopFrame.itemsSummary?.forEach((item, i) => {
    if (item.type === 'text') {
      console.log(` ${i + 1}. [TEXT] "${item.text}" (Name: ${item.name})`);
    } else {
      console.log(` ${i + 1}. [IMAGE] imageRef: ${item.imageRef}`);
    }
  });
} else {
  console.log('Shop frame not found in json, printing available frames:');
  details.forEach(d => console.log(d.id, d.name));
}
