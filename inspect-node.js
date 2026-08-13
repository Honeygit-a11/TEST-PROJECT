import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const tokenMatch = envContent.match(/FIGMA_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

async function inspect() {
  const res = await fetch('https://api.figma.com/v1/files/jmfK9UfJLgm7NYkBNobBmX/nodes?ids=16:2', {
    headers: { 'X-Figma-Token': token }
  });
  const data = await res.json();
  const canvasNode = data.nodes['16:2'].document;
  
  console.log('Page Canvas Name:', canvasNode.name);
  console.log('Frames count:', canvasNode.children?.length);
  
  canvasNode.children?.forEach((child, i) => {
    console.log(`\n--- [Frame ${i + 1}] ID: ${child.id} | Name: "${child.name}" | Type: ${child.type} ---`);
    if (child.children) {
      console.log('  Direct children count:', child.children.length);
      child.children.slice(0, 10).forEach(c => {
        console.log(`   - [${c.type}] "${c.name}" (ID: ${c.id})`);
      });
    }
  });
}

inspect();
