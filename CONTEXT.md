# CONTEXT.md

## 项目定位

my-blogs 是 threetwoa fork 并持续改造的个人博客工作台，以 GitHub 作为内容管理后台（CMS）。它允许用户通过浏览器直接撰写、编辑、删除博客文章，并将内容以静态文件形式提交到指定的 GitHub 仓库；部署后由 Next.js 读取这些静态文件并渲染成博客页面。

原仓库：[YYsuni/2025-blog-public](https://github.com/YYsuni/2025-blog-public)。本地开发端口：`8123`（见 `package.json`）。

核心特征：

- 无传统后端：内容读写全部通过 GitHub API 完成。
- 内容即代码：每篇文章是一个目录，包含 `index.md`、`config.json` 和资源文件。
- 前端即编辑器：提供所见即所得的写博客界面、首页配置、分类管理。

## 领域术语表

| 术语         | 英文                | 定义                                                              |
| ------------ | ------------------- | ----------------------------------------------------------------- |
| 文章         | Post / Blog         | 一篇博客，对应 `public/blogs/{slug}/` 目录                        |
| Slug         | slug                | 文章的唯一标识，用于 URL 和目录名                                 |
| 文章索引     | Blog Index          | `public/blogs/index.json`，记录所有文章元数据                     |
| 分类         | Category            | 文章的分类，存储在 `public/blogs/categories.json`                 |
| 标签         | Tag                 | 文章的标签，数组形式存在 `config.json`                            |
| 内容源       | Content Source      | 实际存放博客内容的 GitHub 仓库                                    |
| GitHub App   | GitHub App          | 用于授权前端写入内容源的 GitHub 应用                              |
| Private Key  | private key         | GitHub App 的 PEM 私钥，用于签发 JWT                              |
| 安装令牌     | Installation Token  | 通过 GitHub App 获取的、具有仓库写入权限的短期 token              |
| 站点配置     | Site Content        | `src/config/site-content.json` 中的主题、社交链接、背景等配置     |
| 卡片         | Card                | 首页上的可拖拽模块（HiCard、ArtCard 等）                          |
| 内容片段     | Content Fragment    | 博客以外的其他可编辑内容类型：`about`、`bloggers`、`pictures`、`projects`、`share`、`snippets`、`svgs` |

## 关键约束

1. **Private Key 安全**：GitHub App 的 Private Key 由用户在前端导入，可选择加密缓存在 `sessionStorage` 中；决不能硬编码或提交到仓库。
2. **静态内容优先**：博客内容最终都是 `public/blogs/` 下的静态文件，不依赖数据库。
3. **部署延迟**：写入 GitHub 后需要等待部署完成，前端刷新才能看到最新内容。
4. **单分支模型**：默认向 `GITHUB_CONFIG.BRANCH`（通常为 `main`）直接提交，没有 PR 流程。
5. **加密密钥回退**：`GITHUB_CONFIG.ENCRYPT_KEY` 存在默认回退值，生产环境应通过环境变量覆盖。

## 常用代码约定

- 状态管理：全局状态使用 `zustand`，store 放在 `src/app/(home)/stores/` 或 `src/app/write/stores/`。
- API/写操作：与 GitHub 交互的函数放在 `src/lib/github-client.ts`，业务封装放在 `src/app/**/services/`。
- 类型：博客相关类型放在 `src/app/blog/types.ts` 和 `src/app/write/types.ts`。
- Markdown 渲染：`src/lib/markdown-renderer.ts` 是唯一入口，外部不要直接调用 `marked`。
- 样式：Tailwind CSS v4，配置项在 `src/config/site-content.json` 中定义 CSS 变量，组件通过 `--color-*` 变量消费。
- 动画：使用 `motion`（Framer Motion），优先用 `transform/opacity`。
- 图标：SVG 通过 `@svgr/webpack` 转为 React 组件，统一放在 `src/svgs/`。

## 文件结构

```
/
├── CLAUDE.md                 # Claude 项目指令
├── docs/
│   ├── README.md             # 资产目录索引
│   ├── agents/               # context、language、issue-tracker 等
│   ├── adr/                  # 架构决策记录
│   ├── images/readme/        # 文档用图
│   └── output/               # handoff、reports、decks
├── prototypes/               # HTML 原型（不进构建）
├── public/
│   ├── blogs/                # 博客内容（由 GitHub App 写入）
│   │   ├── index.json        # 文章索引
│   │   ├── categories.json   # 分类列表
│   │   └── {slug}/
│   │       ├── index.md
│   │       ├── config.json
│   │       └── ...
│   ├── images/
│   ├── live2d/
│   └── music/
├── scripts/
│   └── gen-svgs-index.js     # 生成 SVG 索引
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (home)/           # 首页卡片布局
│   │   ├── blog/             # 博客列表/详情
│   │   ├── write/            # 写文章编辑器
│   │   └── ...
│   ├── components/           # 共享组件
│   ├── config/               # 站点配置 JSON
│   ├── hooks/                # 共享 hooks
│   ├── layout/               # 根布局、背景、Head
│   ├── lib/                  # 核心工具（GitHub 客户端、渲染器等）
│   ├── styles/
│   └── svgs/
├── next.config.ts
├── wrangler.toml
└── open-next.config.ts
```

## 关键依赖说明

- `next` 16 + `react` 19：框架与 UI 库，启用 React Compiler。
- `@opennextjs/cloudflare`：将 Next.js 应用构建为 Cloudflare Worker。
- `marked` + `shiki` + `katex`：Markdown 解析、代码高亮、数学公式。
- `jsrsasign`：在浏览器端用 GitHub App Private Key 签发 JWT。
- `zustand`：轻量全局状态。
- `motion`：动画。
- `sonner`：Toast 通知。
