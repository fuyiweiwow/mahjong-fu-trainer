# Calc Drill — Riichi Fu Trainer

日麻算符（符数）速算练习器，带一键切换的**低调模式**（dark terminal style, monospace tokens — 看起来像普通开发工具输出面板）。

题目为随机生成的和牌型（4面子+雀头 / 七对子，随机场风/自风/门清/副露/自摸/荣和），作答符数后给出符数详单（底符、刻/杠、雀头、听牌形、切上）与手牌结构。

## 使用

1. `Ctrl+Shift+P` → `Calc Drill: Open`
2. 从 25~110 符按钮中选择作答
3. 面板内快捷键：
   - `H` 切换 正常模式（彩色牌面+中文）⇄ 低调模式（深色终端风）
   - `Esc` 立即切低调模式（boss key）
   - `Enter` 下一题

## 规则口径（雀魂）

- 平和自摸 30 符；连风雀头 4 符；副露无符手（副露平和型）30 符；七对子固定 25 符
- 荣和补成的刻子按**明刻**计符；合计切上到 10（七对子除外）
- 仅练习符数，不判定役种与番数

出题器对每副手牌做全分解枚举校验：不同分解导致符数不唯一（听牌形歧义等）的题目直接重新生成，保证每题答案唯一。

## 设置

| 设置 | 默认 | 说明 |
|---|---|---|
| `calcDrill.panelTitle` | `Calc Drill` | 面板标签标题，可改成任何工作相关的名字 |
| `calcDrill.startDisguised` | `true` | 打开时默认低调显示 |
| `calcDrill.autoDisguiseOnBlur` | `true` | 失焦自动切回低调模式 |

## 低调模式记号

- 牌：`3m 7p 2s`（数字+花色缩写）；风 `E/S/W/N`；字牌 `B`白 `F`发 `C`中
- 详单：`t3`=刻 `t4`=杠 `h`=暗 `c`=明（`c*`=荣和）`t`=幺九 `s`=中张；`wait: kc`嵌张 `pc`边张 `tk`单骑 `rm`两面 `sp`双碰

同仓库还有姊妹插件 **Hand Drill**（基础何切练习）与单文件网页版 `index.html`。

规则资料：[riichi.wiki · Fu](https://riichi.wiki/Fu) · [维基教科书 · 点数计算](https://zh.wikibooks.org/wiki/日本麻雀/點數計算規則)
