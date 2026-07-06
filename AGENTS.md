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
| 改动记录（攒批） | `docs/history/{YYYY-MM-DD}/commit-history.md` |
| README 配图 | `docs/images/readme/` |
| 原型 | `prototypes/` |

## Commit 攒批（硬约束）

任务完成的**默认终点是 Review，不是 commit**。

```
Agent 完成任务
  → 在 docs/history/{YYYY-MM-DD}/commit-history.md 末尾追加条目
  → 进入 Review，停止
  → 用户明确同意（「通过 / commit / 合并」）后
  → Agent 生成 commit，并维护 history 文件
```

| 规则 | 说明 |
|---|---|
| Review 先于 commit | 任务做完**先写 history 条目**，**禁止**未经用户同意自动 `git commit` |
| 一天一文件 | 同一天多个任务追加到同一个 `commit-history.md`，用 `## N. {slug}` 编号 |
| 攒批合并 | 用户同意后，当天所有条目合并为一个 commit；模板与流程见 [`docs/history/README.md`](docs/history/README.md) |
| 历史保留 | commit 后当天文件夹保留，不入 archive |
| 只管自己改的 | Agent **只提交本轮对话自己改动的文件**；工作树里其他未跟踪/已修改文件（如用户线上 `/write` 写入）由用户自行维护，**不代提、不混合、不干预** |

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
