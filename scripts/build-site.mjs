import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderGantt() {
 const config=JSON.parse(read('content/projects-config.json'));
 if(!/^\d{4}-\d{2}-\d{2}$/.test(config.asOf)||!Number.isFinite(Date.parse(config.asOf))) throw Error('asOf must be YYYY-MM-DD');
 const month=s=>{const m=s.match(/^(\d{4})[/-](\d{1,2})$/); if(!m||+m[2]<1||+m[2]>12)throw Error('Invalid month: '+s);return +m[1]*12 + +m[2]-1;};
 const asOf=month(config.asOf.slice(0,7));
 const lines=read('content/projects.psv').trim().split(/\r?\n/);
 if(lines.shift()!=='期間|案件|技術|担当') throw Error('Invalid project headers');
 const rows=lines.map(line=>{const a=line.split('|');if(a.length!==4)throw Error('Invalid project row');const [period,title,tech,role]=a;const [start,end]=period.split('–');const first=month(start), last=end==='現在'?asOf:month(end);if(last<first||last>asOf)throw Error('Invalid project range: '+period);return {period,title,tech,role,first,last,ongoing:end==='現在'};}).sort((a,b)=>a.first-b.first);
 const first=Math.floor(Math.min(...rows.map(r=>r.first))/12)*12;
 const end=Math.floor(asOf/12)*12+11, count=end-first+1;
 const years=Array.from({length:count/12},(_,i)=>`<span style="grid-column:${i*12+1} / span 12">${first/12+i}</span>`).join('');
 const chart=rows.map(r=>`<div class="gantt-row"><div class="gantt-label"><strong>${esc(r.title)}</strong><small>${esc(r.role)} · ${esc(r.tech)}</small></div><div class="gantt-track"><span class="gantt-bar ${r.ongoing?'ongoing':''}" style="grid-column:${r.first-first+1} / span ${r.last-r.first+1}" title="${esc(r.period+' / '+r.title+' / '+r.role)}"><span class="sr-only">${esc(r.period)}</span></span></div><span class="gantt-period">${esc(r.period)}</span></div>`).join('');
 return `<p class="note">${esc(config.asOf)}時点。各バーは開始月・終了月を含む担当期間です。継続案件は基準月まで表示し、稼働量・進捗率は表しません。</p><p class="gantt-legend"><span>青：終了した担当期間</span><span>斜線：継続中</span></p><div class="gantt-scroll" tabindex="0" role="region" aria-label="案件期間のガントチャート。横にスクロールできます"><div class="gantt" style="--months:${count};--years:${count/12}"><div class="gantt-row gantt-header"><span>案件 / 担当・技術</span><div class="gantt-years">${years}</div><span>担当期間</span></div>${chart}</div></div>`;
}
export function build() {
 const template=read('templates/index.html');
 const html=template.replace(/\{\{([a-z-]+)\}\}/g,(_,id)=>{
  const md=read(`content/${id}.md`);
  return marked.parse(md)+(id==='projects'?renderGantt():'');
 });
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)throw Error('Duplicate HTML IDs');
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g)) if(!ids.includes(id))throw Error('Missing anchor '+id);
 fs.writeFileSync(path.join(root,'site/index.html'),html);
 console.log('Markdownと案件期間から site/index.html を生成しました。');
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build();
