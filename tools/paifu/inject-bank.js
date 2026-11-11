// 把 bank.json 注入 extension-kiri/webview.html 的 const BANK=[];
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const bankPath = path.join(dir, 'bank.json');
const viewPath = path.join(dir, '../../extension-kiri/webview.html');
const bank = fs.readFileSync(bankPath, 'utf8');
let html = fs.readFileSync(viewPath, 'utf8');
const re = /const BANK=\[.*?;/s;
if (!re.test(html)) { console.error('未找到 BANK 占位'); process.exit(1); }
html = html.replace(re, 'const BANK=' + bank.trim().replace(/;$/, '') + ';');
fs.writeFileSync(viewPath, html);
const m = JSON.parse(bank);
console.log('注入完成:', m.length, '题, webview 大小', (html.length / 1024).toFixed(1), 'KB');
