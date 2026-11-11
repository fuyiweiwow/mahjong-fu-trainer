# 日麻算符练习器

单文件零依赖静态网页（`index.html`），双击即可用，或任意静态服务器打开。练习日麻符数（符）速算：随机生成「4面子+雀头 / 七对子」和牌型，答符数，答后给出符数详单（底符/刻杠/雀头/听牌形/切上）与手牌结构。

## 安装 VSCode 插件（VSIX）

1. 从 [Releases](https://github.com/fuyiweiwow/mahjong-fu-trainer/releases) 下载 `calc-drill-0.1.0.vsix`
2. VSCode 扩展面板 → 右上角 `···` → **从 VSIX 安装**（或命令行 `code --install-extension calc-drill-0.1.0.vsix`）

## VSCode 插件（摸鱼版）

见 `extension/`，已打包安装为 `local.calc-drill`（伪装名 **Calc Drill**）：

- `Ctrl+Shift+P` → `Calc Drill: Open` 打开练习面板
- **正常模式**：彩色牌面 + 中文界面（同网页版）
- **低调模式**：深色终端风 + 等宽令牌（`3m 7p 2s E C`）+ 英文缩写详单（`t3 9p h t`、`wait kc`），无任何麻将元素与中文术语，规则表/资料链接自动隐藏
- 快捷键：`H` 切换模式、`Esc` 立即低调（老板键）、`Enter` 下一题
- 设置（`calcDrill.*`）：面板标题（默认 `Calc Drill`，可改成任何工作向名字）、默认低调打开（默认开）、失焦自动低调（默认开）

重新打包：`cd extension && npx -y @vscode/vsce package --allow-missing-repository`，然后 `code --install-extension calc-drill-0.1.0.vsix`。

## VSCode 插件二（基础何切，摸鱼版）

见 `extension-kiri/`，已安装为 `local.hand-drill`（伪装名 **Hand Drill**）：

- `Ctrl+Shift+P` → `Hand Drill: Open`；14 张手牌**点选**一张切牌
- 判定链（教材标准）：向听数 → 进张**枚数** → 进张**种数** → **好形**进张枚数（一向听时）；进张清单逐张标注「好/愚」
- 场况展示：局/本场/巡目/宝牌表示牌（悬停局数徽章看四家点数），不影响判定
- **两种出题模式**：随机生成 / **题库模式**（天凤凤凰桌真实对局挖掘，答案=效率引擎判定且与实战切牌一致，分基础/进阶）
- 同样的双模式/老板键/失焦自动低调/面板标题设置（`handDrill.*`）

### 题库挖掘管线（`tools/paifu/`）

```
python extract.py      # 解析 logs/*.xml (天凤 mjlog) -> positions.json（门清自摸时点+场况）
node   adjudicate.js   # 用 webview 引擎判定 -> bank.json（唯一最佳+实战一致，基础/进阶分层）
node   inject-bank.js  # 注入 webview.html 的 BANK 数组
```

牌谱来源：天凤公开档案 `tenhou.net/sc/raw/`（scf=凤凰桌），下载命令见 `tools/paifu/`（`ids.txt` 提取 + curl 并行拉取）。

重新打包：`cd extension-kiri && npx -y @vscode/vsce package --allow-missing-repository`，然后 `code --install-extension hand-drill-0.2.0.vsix`。

## 规则口径（雀魂）

- 平和自摸 30 符；连风雀头 4 符；副露无符手（副露平和型）30 符；七对子固定 25 符
- 荣和补成的刻子按**明刻**计符；合计切上到 10（七对子除外）
- 只算符，不判定役种与番数

## 出题正确性

- 出题器内置**全分解枚举校验**：对每副生成手牌枚举所有合法面子分解，若不同分解导致符数不唯一（听牌形歧义等），该题直接重新生成，保证每题答案唯一
- 每种牌不超过 4 张；杠（明/暗）固定为杠组不参与重分解；和牌张永远在门前部分

## 验证

- 8000 题批量生成：符数分布 25–110 全覆盖，详单求和=原始小计 0 异常，生成通过率 98.4%
- 12 个规则分支（平和/自摸/连风/明暗刻杠/边嵌单双/强制30等）已知答案用例全部通过
- 浏览器实测：题面-作答-解析-翻题闭环与统计（localStorage）正常

## 资料来源

- [riichi.wiki · Fu](https://riichi.wiki/Fu)
- [维基教科书 · 点数计算规则](https://zh.wikibooks.org/wiki/日本麻雀/點數計算規則)
- [知乎 · 日麻计分法](https://zhuanlan.zhihu.com/p/686949512)
- [Wikipedia · Japanese mahjong scoring rules](https://en.wikipedia.org/wiki/Japanese_mahjong_scoring_rules)
