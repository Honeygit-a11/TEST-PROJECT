import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const details = JSON.parse(fs.readFileSync(path.join(__dirname, 'figma-extracted-details.json'), 'utf8'));

console.log('Searching for node 30:206 in json...');

let found = null;

function search(node) {
  if (node.id === '30:206' || node.name?.includes('206')) {
    found = node;
  }
  if (node.itemsSummary) {
    node.itemsSummary.forEach(item => {
      if (item.name?.includes('206')) {
        console.log('Item found:', item);
      }
    });
  }
}

details.forEach(search);

if (found) {
  console.log('Found Node 30:206:', JSON.stringify(found, null, 2));
} else {
  console.log('Searching text across all nodes:');
  details.forEach(d => {
    d.itemsSummary?.forEach(i => {
      if (i.text && (i.text.includes('TACTICAL') || i.text.includes('SHELL') || i.text.includes('NX-001'))) {
        console.log(`[${d.name}] ${i.name} -> "${i.text}"`);
      }
    });
  });
}
