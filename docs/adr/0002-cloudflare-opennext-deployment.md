# ADR-0002: 部署到 Cloudflare Workers（OpenNext）

## 状态

已接受

## 背景

项目需要一个部署目标。原作者熟悉 Vercel，但希望同时支持 Cloudflare 生态。考虑到博客内容以静态文件为主、访问量可控、成本敏感，需要评估不同部署平台。

## 决策

采用 **Cloudflare Workers** 作为首要部署目标，通过 **`@opennextjs/cloudflare`** 将 Next.js 应用构建为 Worker：

- `wrangler.toml` 配置 Worker 入口、assets、构建命令。
- `open-next.config.ts` 使用默认的 Cloudflare 配置。
- 构建命令：`pnpm run build:cf`。
- 预览/部署命令：`pnpm run preview` / `pnpm run deploy`。

Vercel 仍作为兼容部署选项保留（README 中有详细说明）。

## 后果

### 正面

- 成本极低：Cloudflare 免费额度对个人博客通常足够。
- 全球边缘网络：访问延迟较低。
- 与 GitHub-as-CMS 契合：Worker 只需读取静态文件并渲染页面，无需持久化状态。

### 负面

- Worker 运行时有兼容性限制：部分 Node.js API 不可用，需要 `nodejs_compat` flag。
- 构建链路更复杂：OpenNext 相比原生 Vercel 构建多了转换层，调试构建问题需要了解 Worker 运行时。
- 某些 Next.js 功能可能受限或行为不同（如动态 import、部分 Node 原生模块）。
- 本地开发通常先用 Next.js dev server（`pnpm dev`），Worker 特定行为需用 `pnpm run preview` 在 wrangler 环境中验证。

## 替代方案

- **Vercel**：与 Next.js 原生集成最好，构建简单，但函数调用量和带宽可能产生费用。
- **自托管 Node.js 服务器**：完全可控，但需要服务器资源和运维。
- **静态导出（next export）+ CDN**：最简单，但会失去 Next.js 的动态路由、ISR 等能力。

## 相关文件

- `wrangler.toml`
- `open-next.config.ts`
- `package.json` 中的 `build:cf`、`preview`、`deploy` 脚本
