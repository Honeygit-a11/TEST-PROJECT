import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const tokenMatch = envContent.match(/FIGMA_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

async function printHeaderElements() {
  const res = await fetch('https://api.figma.com/v1/files/jmfK9UfJLgm7NYkBNobBmX/nodes?ids=30:171', {
    headers: { 'X-Figma-Token': token }
  });
  const data = await res.json();
  const headerNode = data.nodes['30:171'].document;

  function traverse(node, level = 0) {
    let extra = '';
    if (node.characters) extra = ` -> "${node.characters}"`;
    console.log(' '.repeat(level * 2) + `${node.name} [${node.type}]${extra}`);
    if (node.children) node.children.forEach(c => traverse(c, level + 1));
  }

  traverse(headerNode);
}

printHeaderElements();
