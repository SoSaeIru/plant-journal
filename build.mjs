// 사용법: npm install (처음 한 번) → npm run build
// 1) index.html에 쓰인 Tailwind 클래스로 styles.css를 만든다.
// 2) 파일 내용으로 버전 번호를 만들어 index.html의 ?v=… 와 sw.js의 VERSION을 바꾼다.
//    → 고친 파일이 옛 캐시에 막히지 않고 폰에 바로 반영된다.
// index.html에서 클래스를 바꾸면 반드시 다시 실행해야 한다.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

execFileSync('npx', ['tailwindcss', '-i', 'src/tailwind.css', '-o', 'styles.css', '--minify'], { stdio: 'inherit' });

const hash = (...files) => createHash('sha256').update(files.map(f => readFileSync(f)).join('\n')).digest('hex').slice(0, 8);
const assets = { 'styles.css': hash('styles.css'), 'vendor/confetti.browser.js': hash('vendor/confetti.browser.js'), 'fonts/Jua-Regular.woff2': hash('fonts/Jua-Regular.woff2') };

let html = readFileSync('index.html', 'utf8');
for (const [file, v] of Object.entries(assets)) {
  const re = new RegExp(file.replace(/[.\/]/g, '\\$&') + '(\\?v=[0-9a-f]*)?', 'g');
  html = html.replace(re, `${file}?v=${v}`);
}
writeFileSync('index.html', html);

const version = hash('index.html', 'styles.css', 'vendor/confetti.browser.js', 'fonts/Jua-Regular.woff2');
let sw = readFileSync('sw.js', 'utf8');
sw = sw.replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`);
sw = sw.replace(/const ASSETS = \[[^\]]*\];/, `const ASSETS = [${['./', ...Object.entries(assets).map(([f, v]) => `./${f}?v=${v}`)].map(a => `'${a}'`).join(', ')}];`);
writeFileSync('sw.js', sw);
console.log('build ok:', version, assets);
