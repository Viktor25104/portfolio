import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

type JsonValue = null | string | number | boolean | JsonValue[] | { [key: string]: JsonValue };

const projectRoot = process.cwd();
const dataDir = resolve(projectRoot, 'src/assets/data');
const contractsDir = resolve(projectRoot, 'src/api/contracts');
const manifestPath = resolve(dataDir, 'manifest.json');

const toPascalCase = (input: string): string =>
  input
    .replace(/(^\w|[-_]\w)/g, (match) => match.replace(/[-_]/g, '').toUpperCase())
    .replace(/[^A-Za-z0-9]/g, '');

const isLanguageMap = (value: Record<string, JsonValue>): boolean => {
  const entries = Object.entries(value);
  if (!entries.length) {
    return false;
  }

  return entries.every(([key, item]) => /^[a-z]{2}(-[A-Z]{2})?$/.test(key) && typeof item === 'string');
};

const inferType = (value: JsonValue, depth = 0): string => {
  if (value === null) return 'null';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'unknown[]';
    }

    const itemTypes = Array.from(new Set(value.map((item) => inferType(item, depth + 1))));
    const union = itemTypes.length === 1 ? itemTypes[0] : itemTypes.join(' | ');
    return `(${union})[]`;
  }

  if (isLanguageMap(value)) {
    return 'Record<string, string>';
  }

  const indent = '  '.repeat(depth + 1);
  const fields = Object.entries(value)
    .map(([key, item]) => {
      const safeKey = /^[A-Za-z_][A-Za-z0-9_]*$/.test(key) ? key : `'${key}'`;
      return `${indent}${safeKey}: ${inferType(item, depth + 1)};`;
    })
    .join('\n');

  return `{\n${fields}\n${'  '.repeat(depth)}}`;
};

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { files: string[] };
const files = manifest.files || [];

mkdirSync(contractsDir, { recursive: true });

files.forEach((file) => {
  const filePath = resolve(dataDir, file);
  const raw = readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw) as JsonValue;
  const baseName = basename(file, '.json');
  const typeName = `${toPascalCase(baseName)}Data`;
  const output = [
    '/* eslint-disable */',
    `// Generated from ${file}`,
    `export type ${typeName} = ${inferType(json)};`,
    ''
  ].join('\n');

  writeFileSync(resolve(contractsDir, `${baseName}.d.ts`), output);
});

console.log(`Generated ${files.length} contract(s) in ${contractsDir}.`);
