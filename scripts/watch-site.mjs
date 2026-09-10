import fs from 'node:fs';
import { build } from './build-site.mjs';
build();
let timer;
for (const dir of ['content','templates']) fs.watch(new URL('../'+dir+'/',import.meta.url),()=>{clearTimeout(timer);timer=setTimeout(()=>{try{build();}catch(e){console.error(e.message);}},150);});
console.log('content/ と templates/ の変更を監視中。保存後、ブラウザを再読み込みしてください。');
