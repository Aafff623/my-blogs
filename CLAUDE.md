# CLAUDE.md

本文件包含 Claude Code 在本仓库中工作时的项目级指令。Cursor 等工具见 [`AGENTS.md`](AGENTS.md)。

## 项目速览

- **仓库**：`Aafff623/my-blogs` — threetwoa 的个人内容工作台
- **Fork 自**：[YYsuni/2025-blog-public](https://github.com/YYsuni/2025-blog-public)
- **本地开发**：`pnpm dev` → [http://localhost:8123](http://localhost:8123)
- **线上站点**：[https://my-blogs-roan-seven.vercel.app](https://my-blogs-roan-seven.vercel.app)

## 新队友阅读顺序

| 顺序 | 路径 | 目的 |
|---|---|---|
| 1 | `README.md` / `README.en.md` | 项目定位、Demo、环境变量（中/英） |
| 2 | `CONTEXT.md` | 领域事实、约束、代码约定 |
| 3 | `docs/agents/language.md` | 共享命名词汇 |
| 4 | `docs/agents/workflow.md` | 任务流（做功能时） |
| 5 | `docs/agents/context.md` | 文档地图 |
| 6 | `CLAUDE.md` | Agent 工作纪律（本文件） |
| 7 | `src/app/blog/` · `src/app/write/` | 文章列表与编辑器 |
| 8 | `docs/adr/` | 架构决策记录 |

## 目录分工

| 路径 | 职责 |
|---|---|
| `docs/adr/` | 架构决策（ADR） |
| `docs/agents/` | Agent 规则；**任务流 → `workflow.md`** |
| `docs/output/reports/{theme}/` | PRD、brief；完结 → `reports/archive/` |
| `docs/output/handoff/{theme}/` | 任务 handoff；完结 → `handoff/archive/` |
| `docs/knowledge/` | 可迁移知识沉淀 |
| `docs/images/readme/` | README 直接引用的终稿配图 |
| `docs/output/decks/` | 幻灯片 |
| `prototypes/` | HTML 原型，不进构建 |
| `src/` | 应用源码 |
| `public/` | 站点静态内容与博客 CMS 数据 |
| 根目录 | 工具链配置 + `README` / `CONTEXT` / `CLAUDE` / `AGENTS` |

完整索引与待建清单 → [`docs/README.md`](docs/README.md)。

## Agent skills

### Issue tracker

Issues 以 GitHub issue 的形式跟踪。详见 `docs/agents/issue-tracker.md`。

### Triage labels

使用 canonical 标签词汇。详见 `docs/agents/triage-labels.md`。

### Domain docs

单上下文布局：根目录 `CONTEXT.md` + `docs/adr/`。消费规则见 `docs/agents/domain.md`、`docs/agents/context.md`；命名见 `docs/agents/language.md`。

## 工作纪律

- 内容写入走 `src/lib/github-client.ts` 与各 `services/`，不绕过 GitHub App 流程
- Private Key 不硬编码、不提交仓库
- Markdown 渲染统一走 `src/lib/markdown-renderer.ts`
- 开发端口 `8123`，不用原仓库的 `2025`

## 文档维护协议

> 任务流见 [`docs/agents/workflow.md`](docs/agents/workflow.md)。速查见 [`AGENTS.md`](AGENTS.md)。

### 原则

1. **精炼**：新 `.md` 只写必要内容；可选扩展先与用户确认。
2. **归位**：PRD/brief → `reports/{theme}/`；handoff → `handoff/{theme}/{task}.md`；完结 → `*/archive/{theme}/`。
3. **单一来源**：任务状态以 Issue + handoff 为准；PRD 以 `reports/{theme}/prd.md` 为准。
4. **Review 门禁**：交付后停止，等用户确认；详见 `workflow.md` §7。
5. **术语**：新词 → `CONTEXT.md` → `docs/agents/language.md`。

### 三层加载

| 层 | 文件 | 加载时机 |
|---|---|---|
| L0 | `AGENTS.md` | 每次 |
| L1 | `workflow.md` + PRD + handoff | 做任务时 |
| L2 | `CONTEXT.md`、`docs/adr/` | 改领域 / 架构 |

### 更新节奏

| 节奏 | 触发 | 更新目标 |
|---|---|---|
| **即时** | 实施任务 | 改代码 + 更新 `handoff/{theme}/{task}.md` |
| **交付** | 任务可 Review | handoff → `awaiting-review`，停止 |
| **确认后** | 用户 Review 通过 | handoff → `archive/`；关 Issue |
| **知识** | 用户要求 + Review | `docs/knowledge/`（可迁移摘要） |
| **惰性** | 架构决策 | 新 ADR |

Handoff 格式与模板 → `workflow.md` §4。

### 跨对话防遗漏

1. 新对话：用户给 **theme + task** 或 **Issue 号** → 读 `workflow.md` 规定的文件。
2. **禁止**只读「最新 handoff」而不带主题/任务指针。
3. 本协议随实践迭代；变更记入 §已归档偏好。

### 已归档偏好（2026-07-05）

- 代码洁癖：资产集中 `docs/`，根目录只留工具链与入口文档。
- Matt Pocock 基础集：`CONTEXT.md` + `docs/agents/` + `docs/adr/`。
- 产物 → `docs/output/`；README 配图 → `docs/images/readme/`。
- 不建 `.cursor/`、`.claude/`。
- **维护策略**：L0 常新；Review 门禁；禁止多文件重复同一事实。
- **任务流（2026-07-05）**：Issue → PRD → 确认 → handoff → Review → archive。详见 `workflow.md`。
- **knowledge/**：可迁移知识；**仅用户提出或 Review 后**写入 `docs/knowledge/`；规范细节仍在 operational 文档。

