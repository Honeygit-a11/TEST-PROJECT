import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const tokenMatch = envContent.match(/FIGMA_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

async function inspectShopDetail() {
  const res = await fetch('https://api.figma.com/v1/files/jmfK9UfJLgm7NYkBNobBmX/nodes?ids=30:196', {
    headers: { 'X-Figma-Token': token }
  });
  const data = await res.json();
  
  if (!data.nodes) {
    console.log('Error from Figma:', data);
    return;
  }

  const nodeObj = data.nodes['30:196']?.document || data.nodes['30-196']?.document;

  function traverse(node, depth = 0) {
    let extra = '';
    if (node.characters) extra = ` -> "${node.characters}"`;
    const bbox = node.absoluteBoundingBox ? ` (${Math.round(node.absoluteBoundingBox.width)}x${Math.round(node.absoluteBoundingBox.height)})` : '';
    console.log(' '.repeat(depth * 2) + `${node.name} [${node.type}]${bbox}${extra}`);
    if (node.children) node.children.forEach(c => traverse(c, depth + 1));
  }

  if (nodeObj) {
    console.log('--- FRAME 30:196 ---');
    traverse(nodeObj);
  }
}

inspectShopDetail();
