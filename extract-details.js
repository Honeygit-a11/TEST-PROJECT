import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const tokenMatch = envContent.match(/FIGMA_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

async function fetchFullTree() {
  const res = await fetch('https://api.figma.com/v1/files/jmfK9UfJLgm7NYkBNobBmX/nodes?ids=16:2', {
    headers: { 'X-Figma-Token': token }
  });
  const data = await res.json();
  const canvasNode = data.nodes['16:2'].document;

  const pageDetails = [];

  function collectTextAndImages(node, list) {
    if (node.type === 'TEXT') {
      list.push({ type: 'text', text: node.characters, name: node.name });
    }
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach(fill => {
        if (fill.type === 'IMAGE') {
          list.push({ type: 'image', imageRef: fill.imageRef, name: node.name });
        }
      });
    }
    if (node.children) {
      node.children.forEach(c => collectTextAndImages(c, list));
    }
  }

  canvasNode.children?.forEach(frame => {
    const items = [];
    collectTextAndImages(frame, items);
    pageDetails.push({
      id: frame.id,
      name: frame.name,
      width: frame.absoluteBoundingBox?.width,
      height: frame.absoluteBoundingBox?.height,
      itemsSummary: items
    });
  });

  fs.writeFileSync(path.join(__dirname, 'figma-extracted-details.json'), JSON.stringify(pageDetails, null, 2));
  console.log('Saved figma-extracted-details.json');
}

fetchFullTree();
