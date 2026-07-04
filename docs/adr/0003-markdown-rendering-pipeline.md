# ADR-0003: Markdown 渲染链路

## 状态

已接受

## 背景

博客文章使用 Markdown 编写，需要支持：

- 标准 Markdown 语法（标题、列表、链接、图片等）。
- 代码块高亮。
- 数学公式（行内 `$...$` 与块级 `$$...$$`）。
- 目录（TOC）生成。
- 在 Cloudflare Worker 运行时也能正常工作。

## 决策

采用 **`marked` + `shiki` + `katex` + `html-react-parser`** 的渲染链路：

- `marked`：核心 Markdown 解析与渲染。
- 自定义 `marked.Renderer`：
  - 为 heading 生成 `id`，用于锚点跳转。
  - 自定义 listitem，支持 task list。
- 自定义 marked 扩展：
  - `mathBlock`：块级 `$$...$$`。
  - `mathInline`：行内 `$...$`。
- `shiki`：代码高亮，懒加载（因为 Worker 运行时可能无法直接加载 wasm）。
- `katex`：数学公式渲染，懒加载。
- `html-react-parser`：在 `useMarkdownRender` hook 中将 HTML 字符串转为 React 元素，并替换 `<img>` 和代码块为自定义组件。

渲染流程：

1. `useMarkdownRender` 调用 `renderMarkdown(markdown)`。
2. `renderMarkdown` 注册自定义 renderer 与 math 扩展。
3. 使用 `marked.lexer` 得到 token 列表。
4. 从 token 中提取 heading 生成 TOC。
5. 预处理 code token，用 shiki 生成高亮 HTML 并替换为占位符。
6. 使用 `marked.parser` 生成最终 HTML。
7. `useMarkdownRender` 用 `html-react-parser` 将 HTML 转为 React 元素：
   - `<img>` 替换为 `<MarkdownImage>`。
   - 代码块占位符替换为 `<CodeBlock>`。

## 后果

### 正面

- 灵活性高：自定义扩展可以精确控制 heading、math、task list 的渲染。
- 性能可接受：shiki / katex 懒加载，避免首屏阻塞。
- 浏览器与 Worker 兼容：懒加载机制让 Worker 运行时不会强制要求这些模块存在。

### 负面

- 渲染逻辑集中且复杂：`src/lib/markdown-renderer.ts` 承担了较多职责。
- 安全问题：将 HTML 直接注入页面需要确保 Markdown 内容可信，或增加 XSS 过滤。
- shiki 与 katex 的懒加载在 Worker 运行时可能降级为无高亮/无公式渲染。

## 替代方案

- **MDX**：更强大，可以把 React 组件嵌入 Markdown，但需要更复杂的构建配置和运行时支持。
- **react-markdown + remark/rehype 插件**：生态丰富，但灵活度和体积需要权衡。
- **服务端预渲染 HTML**：把 Markdown 在构建时转为 HTML，减少运行时负担，但失去在线编辑的即时预览优势。

## 相关文件

- `src/lib/markdown-renderer.ts`
- `src/hooks/use-markdown-render.tsx`
- `src/components/blog-preview.tsx`
- `src/components/code-block.tsx`
- `src/components/markdown-image.tsx`
- `src/components/blog-toc.tsx`
