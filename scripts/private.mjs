import { mkdirSync, copyFileSync, constants } from 'node:fs';
const target = new URL('../.private/', import.meta.url);
mkdirSync(target, { recursive: true });
try {
  copyFileSync(new URL('../docs/intake-template.md', import.meta.url), new URL('intake.md', target), constants.COPYFILE_EXCL);
} catch (error) { if (error.code !== 'EEXIST') throw error; }
console.log('.private/intake.md を用意しました。既存の回答は保持します。');
