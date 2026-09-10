import { execFileSync } from 'node:child_process';
const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0');
const forbidden = tracked.filter(p => p.startsWith('.private/') || (/(^|\/)\.env($|\.)/.test(p) && !p.endsWith('.env.example')) || /\.(pem|key)$/i.test(p));
if (forbidden.length) { console.error('非公開対象がGit登録されています:\n' + forbidden.join('\n')); process.exit(1); }
execFileSync('git', ['check-ignore', '--quiet', '.private/intake.md']);
console.log('非公開パスの除外・追跡対象を確認しました。内容の機密判定は別途必要です。');
