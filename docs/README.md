# docs/ — 资产目录

本目录存放**文档、决策、Agent 约定与产物**，不放应用源码。

## 目录结构

```
docs/
├── README.md           ← 本文件：索引与待建清单
├── adr/                架构决策记录（ADR-0001 …）
├── agents/             Agent 规则
│   ├── workflow.md     ★ 任务流（Issue→PRD→handoff→Review→archive）
│   ├── context.md      文档地图
│   ├── language.md     共享词汇
│   └── …
├── knowledge/          可迁移知识沉淀（跨项目复习）
│   └── ai-coding-asset-design.md
├── images/readme/      README 配图
└── output/
    ├── reports/
    │   ├── archive/{theme}/
    │   └── {theme}/            prd.md、brief
    ├── handoff/
    │   ├── archive/{theme}/
    │   └── {theme}/{task}.md
    └── decks/
```

## 仓库其他分区（非 docs）

| 路径 | 用途 |
|---|---|
| `/` 根目录 | 工具链配置 + 入口文档（`README.md`、`CONTEXT.md`、`CLAUDE.md`、`AGENTS.md`） |
| `src/` | Next.js 应用源码 |
| `public/` | 站点静态内容与博客 CMS 数据 |
| `scripts/` | 一次性/维护脚本 |
| `prototypes/` | UI/交互 HTML 原型（不进构建） |

## 待建清单

| 路径 | 用途 | 状态 |
|---|---|---|
| `.cursor/` · `.claude/` | IDE 项目配置 | **不需要**（用 `AGENTS.md` + `CLAUDE.md`） |
| `.github/workflows/` | CI（lint / build） | 待确认 |
| `docs/agents/testing.md` | 测试命令与策略 | 待确认 |
| `docs/agents/typescript.md` | TS 约定补充 | 待确认 |

