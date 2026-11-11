# Hand Drill

Hand pattern discard drills（基础何切练习的 VSCode 伪装版）。

## 使用

1. `Ctrl+Shift+P` → `Hand Drill: Open`
2. 14 张手牌中**点击一张**作为切牌，答后展示最佳切法与进张对比
3. 快捷键：`H` 切换 正常 ⇄ 低调，`Esc` 立即低调（老板键），`Enter` 下一题

## 判定口径（基础牌效）

- 先比**向听数**（少者优），再比**进张枚数**（多者优）；进张枚数 = 4 − 手内可见张数
- 不考虑打点/役种/防守/宝牌；出题时排除七对型局面
- 向听范围：听牌 / 一向听 / 二向听；最佳切牌不唯一的局面自动重新生成，答案保证唯一

## 设置

| 设置 | 默认 | 说明 |
|---|---|---|
| `handDrill.panelTitle` | `Hand Drill` | 面板标签标题，建议改成工作相关的名字 |
| `handDrill.startDisguised` | `true` | 打开时默认低调显示 |
| `handDrill.autoDisguiseOnBlur` | `true` | 失焦自动切回低调模式 |

## 低调模式记号

- 牌：`3m 7p 2s`（数字+花色缩写）；风 `E/S/W/N`；字牌 `B`白 `F`发 `C`中
- `sh`=向听数（`tenpai`=听牌，`1-sh`=一向听）；`acc`=进张（`k`=种数）；`best`=最佳切牌；`yours`=你的切牌

## 实现

内置标准型向听数计算（递归全分解，公式 8 − 2×面子 − 搭子，五搭子无雀头 +1）与进张枚举；模板法生成 4面子+雀头后随机破坏 1~3 张产出题目，全选项分析保证唯一最佳。已通过 14 组已知答案用例（听牌各形态/一、二向听/七对/进张枚数）与 300 题批量一致性校验。

资料：[riichi.wiki](https://riichi.wiki) · [Wikipedia · Japanese mahjong](https://en.wikipedia.org/wiki/Japanese_mahjong)
