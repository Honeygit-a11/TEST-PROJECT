import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0) {
          process.env[key.trim()] = values.join('=').trim();
        }
      }
    });
  }
}

loadEnv();

function extractFileKey(input) {
  if (!input) return null;
  // If full URL passed: https://www.figma.com/file/abc123XYZ/Title or /design/abc123XYZ/Title
  const urlMatch = input.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }
  // Otherwise assume raw file key string
  return input.trim();
}

const args = process.argv.slice(2);
const rawInput = args[0] || process.env.FIGMA_FILE_KEY;
const fileKey = extractFileKey(rawInput);
const figmaToken = process.env.FIGMA_TOKEN;

if (!figmaToken) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: FIGMA_TOKEN is not set in .env file!');
  process.exit(1);
}

if (!fileKey) {
  console.log('\x1b[33m%s\x1b[0m', '\nUsage:');
  console.log('  npm run sync <FIGMA_FILE_KEY_OR_URL>');
  console.log('  OR set FIGMA_FILE_KEY in .env\n');
  console.log('Example:');
  console.log('  npm run sync https://www.figma.com/design/aB1cD2eF3g/My-Design-System\n');
  process.exit(1);
}

console.log(`\x1b[36mConnecting to Figma API...\x1b[0m`);
console.log(`File Key: ${fileKey}`);

function rgbaToHex(r, g, b, a = 1) {
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a < 1 ? `${hex}${toHex(a)}` : hex;
}

function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchFigmaData() {
  const headers = { 'X-Figma-Token': figmaToken };
  
  const tokens = {
    colors: {},
    typography: {},
    variables: {}
  };

  // 1. Try fetching Figma Local Variables
  try {
    const varRes = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, { headers });
    if (varRes.ok) {
      const varData = await varRes.json();
      if (varData.meta && varData.meta.variables) {
        console.log(`Found ${Object.keys(varData.meta.variables).length} Figma variables!`);
        for (const varId in varData.meta.variables) {
          const variable = varData.meta.variables[varId];
          const varName = sanitizeName(variable.name);
          
          if (variable.resolvedType === 'COLOR') {
            const values = varData.meta.variableCollections[variable.variableCollectionId];
            const defaultModeId = values?.defaultModeId;
            const val = variable.valuesByMode[defaultModeId];
            if (val && typeof val === 'object' && 'r' in val) {
              tokens.colors[varName] = rgbaToHex(val.r, val.g, val.b, val.a ?? 1);
            }
          } else {
            const defaultModeId = varData.meta.variableCollections[variable.variableCollectionId]?.defaultModeId;
            tokens.variables[varName] = variable.valuesByMode[defaultModeId];
          }
        }
      }
    }
  } catch (err) {
    console.warn('Note: Variables endpoint API call skipped or unsupported for this account type.');
  }

  // 2. Fetch File Document Tree and Styles
  const fileRes = await fetch(`https://api.figma.com/v1/files/${fileKey}`, { headers });
  if (!fileRes.ok) {
    const errText = await fileRes.text();
    console.error('\x1b[31m%s\x1b[0m', `Figma API Error (${fileRes.status}): ${errText}`);
    process.exit(1);
  }

  const fileData = await fileRes.json();
  console.log(`Successfully retrieved Figma file: "${fileData.name}"`);

  // Extract Published Styles if any
  if (fileData.styles) {
    for (const styleId in fileData.styles) {
      const style = fileData.styles[styleId];
      const sName = sanitizeName(style.name);
      if (style.styleType === 'FILL') {
        // Look up node if available
      } else if (style.styleType === 'TEXT') {
        tokens.typography[sName] = style.name;
      }
    }
  }

  // Traverse tree for colors and font styles from nodes
  function traverse(node) {
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach(fill => {
        if (fill.type === 'SOLID' && fill.color) {
          const colorName = sanitizeName(node.name || 'color');
          if (colorName && !tokens.colors[colorName]) {
            tokens.colors[colorName] = rgbaToHex(fill.color.r, fill.color.g, fill.color.b, fill.color.a ?? 1);
          }
        }
      });
    }

    if (node.type === 'TEXT' && node.style) {
      const fontName = sanitizeName(node.name || 'font');
      tokens.typography[fontName] = {
        fontFamily: node.style.fontFamily,
        fontSize: `${node.style.fontSize}px`,
        fontWeight: node.style.fontWeight,
        lineHeight: node.style.lineHeightPx ? `${Math.round(node.style.lineHeightPx)}px` : 'normal'
      };
    }

    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  if (fileData.document) {
    traverse(fileData.document);
  }

  // Save design-tokens.json
  const jsonPath = path.join(__dirname, 'design-tokens.json');
  fs.writeFileSync(jsonPath, JSON.stringify(tokens, null, 2));
  console.log(`\x1b[32m%s\x1b[0m`, `Saved tokens to design-tokens.json`);

  // Save figma-tokens.css
  let cssContent = `/* Automatically generated from Figma file: "${fileData.name}" */\n:root {\n`;
  for (const [key, val] of Object.entries(tokens.colors)) {
    cssContent += `  --color-${key}: ${val};\n`;
  }
  cssContent += `}\n`;

  const cssPath = path.join(__dirname, 'figma-tokens.css');
  fs.writeFileSync(cssPath, cssContent);
  console.log(`\x1b[32m%s\x1b[0m`, `Saved CSS variables to figma-tokens.css`);

  console.log('\n\x1b[36m%s\x1b[0m', 'Sync completed successfully!');
  console.log(`- Extracted ${Object.keys(tokens.colors).length} color tokens`);
  console.log(`- Extracted ${Object.keys(tokens.typography).length} typography styles`);
}

fetchFigmaData().catch(err => {
  console.error('Unexpected error:', err);
});
