const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

test('driver update uses PUT for JSON payloads', () => {
  const apiFile = fs.readFileSync(path.join(repoRoot, 'src/services/api.ts'), 'utf8');
  const driverBlock = apiFile.match(
    /driverService\s*=\s*\{[\s\S]*?update: \(id: number, data: any\) => \{[\s\S]*?\},/,
  );
  assert.ok(driverBlock, 'driverService block should exist');
  assert.match(
    driverBlock[0],
    /return client\.put\(`\/drivers\/\${id\}`, data\);/,
    'driverService.update should use PUT',
  );
});
