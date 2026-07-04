# 领域文档

工程技能在探索代码库时，应如何消费本仓库的领域文档。

## 探索前先读这些

- 仓库根目录下的 **`CONTEXT.md`**，或者
- 如果存在，仓库根目录下的 **`CONTEXT-MAP.md`** —— 它会指向每个上下文对应的 `CONTEXT.md`。请阅读与当前主题相关的上下文。
- **`docs/adr/`** —— 阅读与你即将工作区域相关的 ADR。在多上下文仓库中，还要检查 `src/<context>/docs/adr/` 中上下文范围的决策。

如果上述文件不存在，**静默继续**。不要指出它们的缺失，也不要主动建议创建。生产型 skill（`/grill-with-docs`）会在术语或决策真正被确定时惰性创建它们。

## 文件结构

单上下文仓库（大多数仓库）：

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

多上下文仓库（根目录存在 `CONTEXT-MAP.md`）：

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← 全系统范围决策
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← 上下文特定决策
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## 使用术语表中的词汇

当你的输出中命名领域概念时（issue 标题、重构提案、假设、测试名等），请使用 `CONTEXT.md` 中定义的术语。不要偏离术语表明确避免的同义词。

如果你需要的概念尚未出现在术语表中，这是一个信号——要么你在发明项目不使用的语言（请重新考虑），要么确实存在一个缺口（请记录到 `/grill-with-docs`）。

## 标记 ADR 冲突

如果你的输出与现有 ADR 矛盾，请明确说明，而不是静默覆盖：

> _与 ADR-0007（event-sourced orders）矛盾——但值得重新讨论，因为…_
