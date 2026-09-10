import assert from 'node:assert/strict';
import {renderGantt} from './build-site.mjs';
const chart=renderGantt();
assert.equal((chart.match(/class="gantt-label"/g)||[]).length,27);
// Jan 2021 origin: October 2021 through February 2022 is 5 inclusive months.
assert.match(chart,/grid-column:10 \/ span 5/);
// January 2026 through the September 2026 reference month is 9 months.
assert.match(chart,/grid-column:61 \/ span 9/);
assert.match(chart,/2021/);assert.match(chart,/2026/);
console.log('ガント27項目・年跨ぎ・継続期間の月計算を確認しました。');
