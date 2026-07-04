# ADR-0006: 选用 Tailwind CSS v4

## 状态

已接受

## 背景

项目需要一个 utility-first 的 CSS 方案，能够快速实现高度定制化的博客 UI（主题色、卡片、动画、响应式）。

## 决策

选用 **Tailwind CSS v4**：

- 使用 `@tailwindcss/postcss` 与 PostCSS 集成。
- 配置方式从 `tailwind.config.js` 迁移到 CSS-based 配置（v4 默认方式）。
- 全局样式入口：`src/styles/globals.css`。
- 主题色通过 CSS 变量在运行时注入（见 `src/app/layout.tsx` 的 `htmlStyle` 与 `src/config/site-content.json`）。
- 使用 `tailwind-merge` + `clsx` / `cn` 工具合并类名。

## 后果

### 正面

- 主题切换简单：通过修改变量即可换肤，无需重新编译 Tailwind 配置。
- v4 引擎更快，构建性能更好。
- utility-first 与项目大量小卡片的 UI 风格契合。

### 负面

- v4 是重大版本升级，部分插件和工具链可能尚未完全兼容。
- 配置方式变化需要团队成员重新学习。
- 动态运行时变量与 Tailwind 的 JIT 编译存在张力：需确保使用的任意值类名确实被扫描到。

## 替代方案

- **Tailwind CSS v3**：生态成熟，配置熟悉，但缺少 v4 的性能改进。
- **CSS Modules**：更原生，但主题切换和类名管理更繁琐。
- **Styled Components / Emotion**：运行时开销更大，与 React 19 / 服务端渲染的兼容性需要关注。
- **Panda CSS**：类型安全、设计令牌友好，但学习成本更高。

## 相关文件

- `package.json`
- `postcss.config.mjs`
- `src/styles/globals.css`
- `src/app/layout.tsx`
- `src/lib/utils.ts`
