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
| 3 | `docs/agents/context.md` | 文档地图与消费顺序 |
| 4 | `docs/agents/language.md` | 共享命名词汇 |
| 5 | `CLAUDE.md` | Agent 工作纪律（本文件） |
| 6 | `src/app/blog/` · `src/app/write/` | 文章列表与编辑器 |
| 7 | `docs/adr/` | 架构决策记录 |

## 目录分工

| 路径 | 职责 |
|---|---|
| `docs/adr/` | 架构决策（ADR） |
| `docs/agents/` | Agent 规则：context、language、issue-tracker、triage-labels、domain |
| `docs/images/` | 文档用图（如 README 横幅） |
| `docs/output/` | 产物：handoff、reports、decks |
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

1. **精炼**：新 `.md` 只写必要内容；可选扩展先与用户确认。
2. **归位**：文档与产物进 `docs/` 对应子目录；原型进 `prototypes/`；不进根目录。
3. **追加**：用户在本仓库对话中确立的规范、偏好、分工，浓缩后追加到 `CLAUDE.md` 或 `AGENTS.md`（不重复 `CONTEXT.md` 已有事实）。
4. **术语**：新领域词先更新 `CONTEXT.md` §术语表，再同步 `docs/agents/language.md`。

### 已归档偏好（2026-07-05）

- 代码洁癖：资产文件集中 `docs/`，分工明确，根目录只留工具链与入口文档。
- Matt Pocock 基础集：`CONTEXT.md` + `docs/agents/{context,language,domain,issue-tracker,triage-labels}.md` + `docs/adr/`。
- 产物（PPT、handoff、report）→ `docs/output/{decks,handoff,reports}/`。

