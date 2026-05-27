# AI_LOG

记录 ai-pm-poc 项目中 AI 协作的关键节点、给 AI 的输入、AI 的输出，以及人工把关的地方。

- **工具**：Claude Code（Opus 4.7）
- **协作模式**：AI 负责草稿和实现，人负责拍板、范围裁剪和验收
- **仓库**：https://github.com/Gloria-Qi0311/ai-pm-poc

---

## 1. SPEC 起草

**给 AI 的输入**：
- 题目原文（VOC 8 条、DEV 6 条、群聊 11 行）
- 要求：先比较实现形式（dashboard / CLI / 表格 / LLM）→ 推荐一个 → 再写 SPEC.md
- 约束：不要太正式、不要直接写代码、依据要保留、HITL 要体现

**AI 输出**：形式对比 + 推荐"本地网页 dashboard" + SPEC v0（含 LLM、文件上传、后端）

**人工把关**：
- 觉得 v0 做大了，要求缩到 v1（纯规则、无 LLM、无上传、前端 state）
- 提出三处具体修正：
  1. DEV-101 / DEV-106 不是"延期风险"，是"上线承诺风险 / 联调依赖风险"
  2. DEV-104 已上线未确认要看备注 + 群聊，**不是**看关联 VOC 的"已确认"状态
  3. 待人工确认要补上 VOC-006 ↔ DEV-105（群聊 10:03）

→ 产出最终 SPEC.md

---

## 2. 任务拆解

**输入**：自己的拆法（mock → 规则 → console → UI → 按钮 → 导出 → README）+ 要求 AI 给出建议

**AI 输出**：
- 5 条 review，关键 3 条：
  - state 形状要先定，规则函数签名都改 `(data, state)`，否则做到第 5 步要回头改
  - 抽出 `resolveEvidence()` 早做，所有卡片复用
  - README 别留到最后随便写，评审 3 分钟内要能复现验收
- 11 步任务表 + 砍刀顺序

**人工把关**：选了 "C"——先开 issue 再实现 1–6

---

## 3. 主链路实现（PR #12）

**输入**：执行步骤 1–6（脚手架 + mock + evidence resolver + parseChat + 规则 + state）

**AI 输出**：19 个文件、`verify.js` 12/12 通过

**self-review（AI 自检）**：5 个 findings
- 高优先级 2 个当场修：
  - `traceDependencies` 只抓首个依赖 → 改 `matchAll`
  - `chat@HH:MM` 全局不唯一 → 改 `chat@YYYY-MM-DD HH:MM`
- 其余 3 个留作下次清

---

## 4. UI 渲染（PR #13）

**输入**：执行步骤 7（四块组件 + EvidenceChips 静态显示）

**AI 输出**：`src/components/{Summary,Todos,Risks,Pending,EvidenceChips}.jsx` + 抽出 `compose.js`（UI 和 verify.js 共用）

**验证**：headless Chrome 截图 + DOM 19/19 内容点齐全

---

## 5. 交互（PR #14）

**输入**：合并 #8 + #9 一个 PR（评估为同一个交互层改动，不划算分两次）

**AI 输出**：
- EvidenceChips → EvidenceTag（点击展开看原文）
- useReducer 管 state
- 全部确认按钮（[已回复] / [推迟] / [确认] / [否] / [已确认] / [重置]）

**self-review**：3 个 findings 留作下次清（action shape 不一致 / `<code>` a11y / ActionButton 重复）

---

## 6. 导出 + README（PR #15）

**输入**：合并 #10 + #11 一个 PR（v1 收尾）

**AI 输出**：`exportMd.js` + `ExportModal` + 完整 README（含 3 分钟演示脚本 + 验收映射表）+ 截图

**self-review**：2 个新 findings + 上次留的 3 个 = 5 个 → 人工选 "C: 全修了再 merge" → AI 当场清完

---

## 7. 手动 demo 验收

**人工**：按 8 项验收对照表手动走一遍（页面四块 → 展开依据 → 三次确认 → 一次已回复 → 导出 → 跑 verify/build）

**AI**：旁边提供每步预期值；特别提醒"已回复 todo 后风险不变是设计如此（promise risk 源自群聊追问信号，不是 todo 状态）"，避免被误判为 bug

**结果**：8 项全过

---

## 人工把关的关键点（按价值排序）

1. **v1 范围裁剪**：SPEC v0 砍掉 LLM / 上传 / 数据库 / 真实 IM
2. **业务判断口径修正**：DEV-104 不用 VOC 状态判断、补 VOC-006↔DEV-105
3. **每个 PR self-review 后再 merge**：5 + 3 + 2 = 10 个 findings 全部当场清掉
4. **手动 demo 收尾**：跑通 8 项对照表才停 server

## AI 留下的痕迹

- 全部代码、SPEC、README、本日志由 AI 生成
- commit / PR 消息按本人偏好**不带** "Generated with Claude" 之类标记
- 每个 PR 至少跑过：`npm run verify` + `npm run build` + headless Chrome 截图
