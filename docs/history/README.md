# Commit History

按日期记录 Agent 改动，攒批后再统一提交。

## 结构

```
docs/history/
├── README.md                  # 本文件
├── 2026-07-06/
│   └── commit-history.md      # 当天所有任务汇总
└── 2026-07-07/
    └── commit-history.md
```

- **一个日期 = 一个文件夹 = 一个 `commit-history.md`**
- 同一天多个 Agent / 多个任务 → 追加到同一个文件末尾

## 流程

1. Agent 任务完成 → 在 `docs/history/{YYYY-MM-DD}/commit-history.md` 末尾追加任务条目（文件不存在则新建）
2. 用户 review 通过 → Agent 把当天所有条目对应的改动合并为一个 commit
3. 合并后 → 当天文件夹保留作为历史记录

## 模板

新文件用以下结构起头：

```markdown
# {YYYY-MM-DD} Commit History

## 1. {task-slug}

### 做了什么
- 要点列表

### 改了哪些文件
- `path/to/file`

### commit 信息
{type}({scope}): {summary}

---
```

后续任务按 `## 2. {slug}`、`## 3. {slug}` 顺序追加，任务之间用 `---` 分隔。
