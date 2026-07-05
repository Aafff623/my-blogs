# docs/ — 资产目录

本目录存放**文档、决策、Agent 约定与产物**，不放应用源码。

## 目录结构

```
docs/
├── README.md           ← 本文件：索引与待建清单
├── adr/                架构决策记录（ADR-0001 …）
├── agents/             Agent 消费规则与共享语言
│   ├── context.md      读什么、在哪
│   ├── language.md     命名时必须用的词汇
│   ├── domain.md       领域文档消费规则（Matt Pocock 模板）
│   ├── issue-tracker.md
│   └── triage-labels.md
├── images/             文档用静态资源
│   └── readme/         README 横幅与截图
└── output/             非代码产物（报告、交接、幻灯片导出）
    ├── handoff/        会话/迭代交接摘要
    ├── reports/        分析、审计、调研报告
    └── decks/          PPT / slide 导出（pdf、pptx、html）
```

## 仓库其他分区（非 docs）

| 路径 | 用途 |
|---|---|
| `/` 根目录 | 工具链配置（`package.json`、`next.config.ts` 等）+ 入口文档（`README.md`、`CONTEXT.md`、`CLAUDE.md`、`AGENTS.md`） |
| `src/` | Next.js 应用源码 |
| `public/` | 站点静态内容与博客 CMS 数据 |
| `scripts/` | 一次性/维护脚本 |
| `prototypes/` | UI/交互 HTML 原型（不进构建） |

## 待建清单

以下为**建议**项；创建前需与维护者确认。

| 路径 | 用途 | 状态 |
|---|---|---|
| `.cursor/rules/` | Cursor 项目规则（`.mdc`） | 待确认 |
| `.claude/settings.json` | Claude Code 项目设置 | 待确认 |
| `.github/workflows/` | CI（lint / build） | 待确认 |
| `docs/agents/testing.md` | 测试命令与策略 | 待确认 |
| `docs/agents/typescript.md` | TS 约定补充 | 待确认 |
