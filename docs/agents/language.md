# 共享语言

Agent 输出（issue 标题、重构名、测试名、注释）必须使用下表词汇。完整定义见根目录 `CONTEXT.md` §领域术语表。

## Issue tracker

| 术语 | 定义 | 避免 |
|---|---|---|
| **Issue tracker** | 本仓库的 GitHub Issues | backlog manager、ticket 系统 |
| **Issue** | tracker 中的单条工作单元 | ticket（除非引用外部系统原文） |
| **Triage role** | issue 上的 canonical 状态角色 | 自定义状态名 |

Triage 角色与标签字符串映射见 `triage-labels.md`。

## 任务流

| 术语 | 定义 |
|---|---|
| **主题** | theme；一个 Epic / 倡议，`reports/{theme}/` 与 `handoff/{theme}/` 同名 |
| **任务** | task；PRD 拆分后的工作单元，对应子 Issue + `handoff/{theme}/{task}.md` |
| **PRD** | 需求文档；`reports/{theme}/prd.md`，用户确认前 `draft` |
| **Handoff** | 任务接力文件；一任务一文件，持续更新 |
| **Review** | 用户确认交付；通过前 Agent 停止 |
| **Archive** | `reports/archive/`、`handoff/archive/`；已确认完结 |
| **Knowledge** | `docs/knowledge/`；跨项目可迁移经验；写入须用户 Review |

流程详见 `workflow.md`。Knowledge 详见 `docs/knowledge/README.md`。

## 领域（博客 CMS）

| 术语 | 英文 | 简述 |
|---|---|---|
| 文章 | Post / Blog | `public/blogs/{slug}/` |
| Slug | slug | URL 与目录名 |
| 文章索引 | Blog Index | `public/blogs/index.json` |
| 分类 | Category | `public/blogs/categories.json` |
| 标签 | Tag | `config.json` 内数组 |
| 内容源 | Content Source | 存放内容的 GitHub 仓库 |
| GitHub App | GitHub App | 浏览器写入授权 |
| Private Key | private key | App PEM，用户导入 |
| 安装令牌 | Installation Token | 短期写入 token |
| 站点配置 | Site Content | `src/config/site-content.json` |
| 卡片 | Card | 首页可拖拽模块 |
| 内容片段 | Content Fragment | about / projects / pictures 等 |

术语缺口：先查 `CONTEXT.md`；确需新词时与用户确认后再写入 `CONTEXT.md` 与本文件。
