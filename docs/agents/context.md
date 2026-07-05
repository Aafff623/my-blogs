# Context 消费指南

单上下文仓库。探索代码或写输出前先读下列文件。

## 阅读顺序

| 顺序 | 文件 | 内容 |
|---|---|---|
| 1 | `CONTEXT.md` | 定位、约束、代码约定、目录 |
| 2 | `docs/agents/language.md` | 命名词汇 |
| 3 | `docs/adr/` | 与任务相关的 ADR |
| 4 | `CLAUDE.md` | Agent 工作纪律 |

## 文档地图

| 路径 | 职责 |
|---|---|
| `CONTEXT.md` | 领域事实与约束（source of truth） |
| `docs/agents/language.md` | 共享语言速查 |
| `docs/agents/domain.md` | 领域文档消费规则（Matt Pocock 模板） |
| `docs/agents/issue-tracker.md` | GitHub issue 操作约定 |
| `docs/agents/triage-labels.md` | Triage 标签映射 |
| `docs/adr/` | 已接受的架构决策 |
| `docs/output/` | 报告、handoff、幻灯片等产物 |

## 规则

- 命名用 `language.md` 词汇，不用同义词替代。
- 输出与 ADR 冲突时显式标注，不静默覆盖。
- 新 `.md` 资产保持精炼；扩展性内容创建前需用户确认。
