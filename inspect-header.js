import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const tokenMatch = envContent.match(/FIGMA_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

async function inspectHeaderAndMain() {
  const res = await fetch('https://api.figma.com/v1/files/jmfK9UfJLgm7NYkBNobBmX/nodes?ids=30:171,30:3', {
    headers: { 'X-Figma-Token': token }
  });
  const data = await res.json();
  
  console.log('--- HEADER NODE (30:171) ---');
  function printTree(node, depth = 0) {
    console.log(' '.repeat(depth * 2) + `- [${node.type}] "${node.name}" (Width: ${node.absoluteBoundingBox?.width}, Height: ${node.absoluteBoundingBox?.height})`);
    if (node.characters) {
      console.log(' '.repeat(depth * 2 + 2) + `Text: "${node.characters}"`);
    }
    if (node.children) {
      node.children.forEach(c => printTree(c, depth + 1));
    }
  }
  
  if (data.nodes['30:171']) printTree(data.nodes['30:171'].document);
  console.log('\n--- MAIN NODE (30:3) ---');
  if (data.nodes['30:3']) printTree(data.nodes['30:3'].document);
}

inspectHeaderAndMain();
