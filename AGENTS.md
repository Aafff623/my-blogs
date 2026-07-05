# AGENTS.md

跨 Agent 工具的项目入口。**流程规范 → [`docs/agents/workflow.md`](docs/agents/workflow.md)。**

## 速览

- 开发：`pnpm dev` → http://localhost:8123
- 任务流程：[`docs/agents/workflow.md`](docs/agents/workflow.md)
- 领域上下文：[`CONTEXT.md`](CONTEXT.md)
- 文档索引：[`docs/README.md`](docs/README.md)
- 可迁移知识：[`docs/knowledge/ai-coding-asset-design.md`](docs/knowledge/ai-coding-asset-design.md)

## 任务流（硬约束）

```
Issue(Epic) → reports/{theme}/prd.md → 用户确认
  → 子 Issue + handoff/{theme}/{task}.md
  → 实施 → awaiting-review → 用户 Review 通过
  → handoff/archive/ + reports/archive/
```

| 规则 | 说明 |
|---|---|
| 一任务一 handoff | `handoff/{theme}/{task}.md` 原地迭代，**不用** 01/02 版本号 |
| Review 门禁 | 交付后 `status: awaiting-review`，**停止**；用户确认后才继续 |
| PRD 门禁 | `prd.md` 为 `approved` 前，禁止拆任务写功能代码 |
| 主题同名 | `reports/{theme}/` ↔ `handoff/{theme}/` |

## 产物归位

| 产物 | 路径 |
|---|---|
| PRD / brief | `docs/output/reports/{theme}/` |
| 任务 handoff | `docs/output/handoff/{theme}/{task}.md` |
| 已完结 | `docs/output/{reports,handoff}/archive/{theme}/` |
| README 配图 | `docs/images/readme/` |
| 原型 | `prototypes/` |

## 会话开始

1. 本文件
2. 用户给的 **theme + task** 或 **Issue 号**
3. `workflow.md` 规定的 PRD + handoff
4. 按需 `CONTEXT.md`、相关 ADR

## 会话结束

| 条件 | 动作 |
|---|---|
| 有交付待 Review | handoff → `awaiting-review`，**停止** |
| Review 已通过 | handoff → `done`，移 `archive/`，关 Issue |
| 新规范 | 追加 `CLAUDE.md` §已归档偏好 |
| 可迁移知识 | **仅用户要求**；草稿 → Review → 写入 `docs/knowledge/` |

## knowledge/ 维护

- 写入 **`docs/knowledge/` 须用户主动提出或 Review 通过**。
- Agent 不得自动追加；可先展示草稿，等用户确认。

## Agent skills

见 `CLAUDE.md` → `docs/agents/`。

详细维护协议 → [`CLAUDE.md`](CLAUDE.md) §文档维护协议。
