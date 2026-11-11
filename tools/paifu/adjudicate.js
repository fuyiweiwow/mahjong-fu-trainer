// 用 Hand Drill 引擎判定真实局面 -> bank.json（题库）
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const html = fs.readFileSync(path.join(dir, '../../extension-kiri/webview.html'), 'utf8');
eval(html.match(/<script>([\s\S]*)<\/script>/)[1]);

const positions = JSON.parse(fs.readFileSync(path.join(dir, 'positions.json'), 'utf8'));
const stats = { total: 0, unique: 0, sh: { 0: 0, 1: 0, 2: 0 }, agree: 0, bank: 0 };
const seen = new Set();
const bank = [];

for (const p of positions) {
  const counts = new Array(34).fill(0);
  let total = 0;
  for (const t in p.hand) { counts[+t] += p.hand[t]; total += p.hand[t]; }
  // extract.py 的 hand 已含摸牌（14张），draw 只是标记哪张是摸的
  if (total !== 14) continue;
  const key = counts.join(',');
  if (seen.has(key)) continue;
  seen.add(key);
  stats.total++;
  const r = analyzeDiscards(counts);
  if (!r.unique) continue;
  if (r.minSh < 0 || r.minSh > 2) continue;
  stats.unique++;
  stats.sh[r.minSh]++;
  if (p.act !== r.best.t) continue; // 只要与职业/高手实战一致的题
  stats.agree++;
  const honors = counts.slice(27).reduce((a, b) => a + b, 0);
  const basic = r.minSh <= 1 && honors <= 3;
  const tiles = [];
  counts.forEach((c, t) => { for (let k = 0; k < c; k++) tiles.push(t); });
  bank.push({
    h: tiles, a: r.best.t, sh: r.minSh, d: basic ? 0 : 1,
    k: p.ctx.kyoku, hb: p.ctx.honba, dr: p.ctx.dora, j: p.junme,
    sc: p.ctx.scores, p: (p.player || '').startsWith('\u24c5') ? p.player : '',
    g: p.game,
  });
}

// 分层均衡抽样: 基础140 进阶140
function pick(arr, n) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, n);
}
const basic = pick(bank.filter(b => b.d === 0), 140);
const adv = pick(bank.filter(b => b.d === 1), 140);
const final = shuffleAll(basic.concat(adv));
function shuffleAll(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

fs.writeFileSync(path.join(dir, 'bank.json'), JSON.stringify(final));
stats.bank = final.length;
stats.basic = basic.length; stats.adv = adv.length;
console.log(JSON.stringify(stats, null, 1));
