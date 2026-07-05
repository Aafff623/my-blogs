# output/ — 文档产物

任务流详见 [`docs/agents/workflow.md`](../agents/workflow.md)。

## 目录结构

```
output/
├── reports/
│   ├── archive/{theme}/       已完结主题（含 prd.md）
│   └── {theme}/               进行中：prd.md、brief 等
├── handoff/
│   ├── archive/{theme}/       Review 通过的任务 handoff
│   └── {theme}/{task}.md      一任务一文件，持续更新
└── decks/                     幻灯片
```

`reports/{theme}/` 与 `handoff/{theme}/` **同名**。

## 归位速查

| 类型 | 路径 |
|---|---|
| PRD | `reports/{theme}/prd.md` |
| brief / 调研 | `reports/{theme}/` |
| 任务 handoff | `handoff/{theme}/{task}.md` |
| README 配图 | `docs/images/readme/` |
| 已确认完结 | `*/archive/{theme}/` |

**禁止** `docs/artifacts/`、根目录堆产物。
