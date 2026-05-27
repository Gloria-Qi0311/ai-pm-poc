# ai-pm-poc

PM 每日跟进助手 PoC —— 把 VOC / 研发任务 / 群聊三类数据合在一起，自动生成今日待回复、风险、待人工确认的清单，每条结论带依据。

v1 目标：纯规则、本地 mock 数据、无 LLM、无后端、无数据库，先把主链路跑通。

详细规格见 [SPEC.md](./SPEC.md)。

## Status

- [x] SPEC v1
- [ ] mock 数据 + 规则层 + verify.js
- [ ] UI（四块展示 + 人工确认）
- [ ] 导出 + demo 脚本
