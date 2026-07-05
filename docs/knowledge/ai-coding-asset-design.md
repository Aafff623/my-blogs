# AI Coding 资产文件设计 — 精炼总结

> 在 my-blogs 项目中迭代成型的目录与流程设计。可迁移到其他 AI Coding 项目；落地时复制结构、替换领域内容即可。
>
> **本项目实操规范**（最新）→ [`docs/agents/workflow.md`](../agents/workflow.md) · [`AGENTS.md`](../../AGENTS.md)

---

## 1. 设计目标

| 目标 | 做法 |
|---|---|
| 根目录不凌乱 | 工具链 + 4 个入口文档；其余进 `docs/` |
| Agent 跨对话不丢上下文 | Issue + PRD + handoff 三层，Review 门禁 |
| 文件不重复维护 | 每个事实单一来源 |
| 可控、不过度设计 | PRD 确认前不写代码；交付必停等 Review |
| 知识可带走 | 本文件 + `docs/knowledge/` 沉淀可迁移经验 |

---

## 2. 总体分层

```
根目录（L0 入口，每次加载）
├── AGENTS.md          硬约束速查：路径、任务流、Review 门禁
├── CLAUDE.md          工作纪律 + 偏好归档（迭代日志）
├── CONTEXT.md         领域事实：术语、约束、代码约定
└── README.md          给人看：项目是什么、怎么跑

docs/（资产库）
├── agents/            Agent 消费规则 + 任务流
├── adr/               架构决策（Matt Pocock）
├── knowledge/         ★ 可迁移知识（本文件夹）
├── images/readme/     README 终稿配图
└── output/            任务产物（PRD、handoff、archive、decks）

仓库外
└── GitHub Issues      任务真相：Epic + 子 Issue
```

**不建** `.cursor/`、`.claude/`：约束写在 `AGENTS.md` + `CLAUDE.md`，跨工具可读。

---

## 3. Matt Pocock 方法论层

| 资产 | 路径 | 职责 |
|---|---|---|
| 领域事实 | `CONTEXT.md` | 术语表、约束、目录（source of truth） |
| 共享语言 | `docs/agents/language.md` | 命名词汇速查 |
| 文档地图 | `docs/agents/context.md` | 读什么、放哪 |
| 领域消费规则 | `docs/agents/domain.md` | Matt Pocock 模板 |
| Issue 约定 | `docs/agents/issue-tracker.md` | GitHub + `gh` CLI |
| Triage 标签 | `docs/agents/triage-labels.md` | 五种 canonical 角色 |
| 架构决策 | `docs/adr/000N-*.md` | 已接受的技术决策 |

**原则**：Agent 输出用 `language.md` 词汇；与 ADR 冲突须显式标注。

---

## 4. AGENTS.md vs CLAUDE.md

| | AGENTS.md | CLAUDE.md |
|---|---|---|
| **读者** | 所有 Agent 工具 | Claude Code + 维护者 |
| **长度** | 短（速查表） | 中（协议 + 归档） |
| **放什么** | 硬约束、路径、任务流摘要 | 维护协议、三层加载、偏好迭代 |
| **何时改** | 约束变了 | 有新约定 / 流程演进 |

**不放 `.cursorrules`**：避免 Cursor 专用重复；`AGENTS.md` 跨工具加载。

---

## 5. 任务流与 output/ 设计

### 5.1 目录

```
docs/output/
├── reports/
│   ├── archive/{theme}/
│   └── {theme}/prd.md          # PRD + brief
├── handoff/
│   ├── archive/{theme}/{task}.md
│   └── {theme}/{task}.md       # 一任务一文件，原地迭代
└── decks/
```

- `{theme}`：`reports` 与 `handoff` **同名**
- `{task}`：kebab-case，对应一个子 Issue
- **不用** 01/02 版本号；同一任务持续改同一文件

### 5.2 流程

```
Issue(Epic) → 沟通 → reports/{theme}/prd.md (draft)
  → 用户确认 (approved)
  → 拆子 Issue + handoff/{theme}/{task}.md
  → 实施 → awaiting-review → 【停，等用户 Review】
  → 通过 → handoff/archive/ → 主题完 → reports/archive/
```

### 5.3 三层职责

| 层 | 位置 | 管什么 |
|---|---|---|
| 规划 | GitHub Issues + PRD | 做什么、验收标准 |
| 产物 | `reports/{theme}/` | PRD 正文、brief |
| 接力 | `handoff/{theme}/{task}.md` | 做到哪、待 Review 什么 |

Handoff ≠ 任务定义；是**执行记忆**，通过 Issue 号与 PRD 关联。

### 5.4 Review 门禁

- PRD 未 `approved` → 禁止写功能代码
- 交付 → `awaiting-review` → Agent **必须停止**
- 用户「通过 / LGTM」→ 才可归档或下一任务
- 新对话需用户给 **theme + task** 或 **Issue 号**（不自动扫全库）

---

## 6. 其他分区

| 路径 | 用途 |
|---|---|
| `docs/images/readme/` | README 引用的终稿图（banner、架构图） |
| `prototypes/` | HTML 探索原型，不进构建 |
| `src/` | 应用源码 |
| `public/` | 站点 CMS 静态内容 |

Brief 类小产物（如配图说明）可只建 `reports/{theme}/`，不走完整 PRD/handoff。

---

## 7. 维护策略（三层加载）

| 层 | 何时读 | 代表文件 |
|---|---|---|
| L0 | 每次会话 | `AGENTS.md` |
| L1 | 做任务 | `workflow.md`、PRD、handoff、Issue |
| L2 | 改领域/架构 | `CONTEXT.md`、`docs/adr/` |

| 更新节奏 | 触发 | 动作 |
|---|---|---|
| 即时 | 实施任务 | 代码 + handoff |
| 交付 | 可 Review | `awaiting-review`，停止 |
| 确认后 | Review 通过 | archive + 关 Issue |
| 偏好 | 用户定规范 | 追加 `CLAUDE.md` §已归档偏好 |
| 知识 | 用户要求 | 更新 `docs/knowledge/`（经 Review） |

**禁止**同一事实在 README、CONTEXT、CLAUDE 多处重复。

---

## 8. knowledge/ 自身规则

| 规则 | 说明 |
|---|---|
| 写入时机 | **仅用户主动提出** |
| Agent 自动总结 | 先出草稿 → **用户 Review** → 才写入 |
| 与 operational 文档关系 | 规范细节在 `workflow.md`；knowledge 写**可迁移原则** |
| 跨项目用法 | 新仓库复制本文件 + 结构骨架，替换 `CONTEXT.md` 领域内容 |

---

## 9. 迁移到新项目的最小清单

```
□ AGENTS.md（硬约束）
□ CLAUDE.md（维护协议）
□ CONTEXT.md（领域事实）
□ docs/agents/{workflow,context,language,domain,issue-tracker,triage-labels}.md
□ docs/adr/
□ docs/output/{reports,handoff}/archive/
□ docs/knowledge/ai-coding-asset-design.md（本文件）
□ GitHub Issues 作为 Issue tracker
```

按需省略：无任务流的小项目可只保留 L0 + CONTEXT + adr。

---

## 10. 演进记录

| 日期 | 要点 |
|---|---|
| 2026-07-05 | 初版：`output/` 取代 `artifacts/`；主题 handoff + archive；Review 门禁 |
| 2026-07-05 | 新增 `docs/knowledge/`；本文件作为跨项目复习入口 |

*后续变更：用户 Review 通过后，在此表追加一行摘要。*
