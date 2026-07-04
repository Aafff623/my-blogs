# ADR-0005: 选用 Next.js 16 + React 19

## 状态

已接受

## 背景

项目启动时（约 2025 年）需要选择一个现代化的 React 全栈框架。目标包括：

- 支持 App Router、服务端组件、ISR 等现代 Next.js 特性。
- 良好的 TypeScript 支持。
- 与 Cloudflare / Vercel 部署目标兼容。
- 能够利用 React 19 的新特性（如 React Compiler）。

## 决策

选用 **Next.js 16** 与 **React 19**：

- Next.js App Router 作为路由与渲染模型。
- 启用 React Compiler（`reactCompiler: true`）。
- `reactStrictMode: false`（当前项目配置，需记录）。
- 页面扩展包含 `.md` 和 `.mdx`（`pageExtensions`）。

## 后果

### 正面

- 可以使用最新的 React 特性（如 use 钩子、Server Actions、React Compiler 自动记忆化）。
- App Router 与 Server Components 有利于减少客户端 bundle。
- Next.js 16 在构建性能和运行时特性上持续改进。

### 负面

- 版本较新，部分第三方库可能尚未完全兼容 React 19。
- React Compiler 仍在演进，可能引入难以调试的问题。
- 关闭 `reactStrictMode` 可能隐藏一些 React 的潜在问题（如 effect 重复执行）。
- Cloudflare Worker 运行时对新版 Next.js 某些特性的支持可能滞后于 Vercel。

## 替代方案

- **Next.js 14/15 + React 18**：更稳定，生态兼容更好，但缺少 React 19 特性。
- **Astro**：对内容站更轻量，但动态编辑界面需要更多客户端逻辑。
- **Remix / React Router v7**：数据加载模型清晰，但与 GitHub-as-CMS 的静态内容读取需要额外适配。

## 相关文件

- `package.json`
- `next.config.ts`
- `src/app/layout.tsx`
