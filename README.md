<p align="center">
  <h1 align="center">my-blogs — threetwoa 的个人博客工作台</h1>
  <p align="center"><em>code less, architect more</em></p>
  <p align="center">一个从开源博客轮子改造成的个人内容系统。它用 GitHub 保存文章与配置，用 Vercel 承载公开访问，用浏览器完成日常写作、改文、传图和站点配置。对我来说，它不只是一个博客前台，而是一块可以持续打磨的个人数字花园。</p>
</p>

<p align="center">
  <img src="public/images/art/cat.png" alt="my-blogs banner" width="100%">
</p>

<p align="center">
  <a href="https://my-blogs-roan-seven.vercel.app"><img src="https://img.shields.io/badge/Site-Live-059669?style=for-the-badge&labelColor=0f172a" alt="Live Site"></a>
  <a href="https://github.com/Aafff623/my-blogs"><img src="https://img.shields.io/github/stars/Aafff623/my-blogs.svg?style=for-the-badge&labelColor=0f172a" alt="GitHub stars"></a>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&labelColor=0f172a" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&labelColor=0f172a" alt="React">
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&labelColor=0f172a" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/CMS-GitHub-181717?style=for-the-badge&labelColor=0f172a" alt="GitHub CMS">
  <img src="https://img.shields.io/badge/Deploy-Vercel%20%7C%20Cloudflare-ffffff?style=for-the-badge&labelColor=0f172a" alt="Vercel / Cloudflare">
</p>

<p align="center">
  <a href="#为什么做这个项目">为什么</a> ·
  <a href="#它现在能做什么">功能</a> ·
  <a href="#演示">演示</a> ·
  <a href="#日常使用方式">使用</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#架构">架构</a> ·
  <a href="#内容模型">内容模型</a> ·
  <a href="#维护边界">维护边界</a> ·
  <a href="#路线图">路线图</a> ·
  <a href="#文档">文档</a>
</p>

---

## 为什么做这个项目

我一开始并不是想重新发明一个博客系统。原项目 [YYsuni/2025-blog-public](https://github.com/YYsuni/2025-blog-public) 已经把一个很有意思的闭环跑通了：

```text
浏览器写作 → GitHub 保存内容 → 自动部署 → 独立站点访问
```

真正吸引我的是它的方向：**博客内容不被平台锁住，配置不需要数据库，日常更新也不必每次打开 IDE**。这正好适合个人开发者的长期使用场景。

这份仓库是在那个基础上继续改造出来的个人版本。我希望它保持三件事：

| 原则 | 说明 |
|---|---|
| **内容归我所有** | 文章、图片、配置都落在自己的 GitHub 仓库里，每次变更都是一次 commit |
| **编辑足够轻** | 日常写文章、改封面、调首页配置，可以直接在站点里完成 |
| **开发仍然开放** | 真正涉及结构、交互、视觉系统的改动，继续通过本地分支迭代 |

它不是一个“后台很重”的 CMS，也不是一个一次性展示页。它更像一个个人工作台：能发布，也能被拆开继续改。

---

## 它现在能做什么

| 能力 | 说明 |
|---|---|
| **在线写文章** | 在浏览器里编辑 Markdown、设置标题、标签、分类、摘要和封面 |
| **图片随文提交** | 上传图片后随文章目录一起进入 GitHub，路径和内容天然版本化 |
| **文章管理** | 支持文章编辑、删除、批量删除、分类维护和索引更新 |
| **首页配置** | 可配置主题色、社交按钮、头像、背景、艺术图、卡片显示状态等 |
| **多内容区块** | 除 blog 外，还包含 about、projects、pictures、share、bloggers、snippets、svgs 等页面 |
| **GitHub-as-CMS** | 前端通过 GitHub App 获取 installation token，再调用 Git Data API 写入仓库 |
| **自动部署** | 写入 `main` 后由 Vercel 重新构建，正式站点刷新后展示新内容 |

**当前边界（Out of scope）：**

- 以个人使用为主，不做多用户权限系统。
- 不内置数据库，所有内容文件都在仓库中。
- 不追求“保存后毫秒级上线”；GitHub commit 后需要等待部署完成。
- 私钥只在浏览器侧使用，不放进仓库，也不放进 Vercel 环境变量。
- 不内置评论、搜索、Newsletter、移动端原生 App。

---

## 演示

### 推荐演示路径

生产站点：[https://my-blogs-roan-seven.vercel.app](https://my-blogs-roan-seven.vercel.app)

部署完成后，可以按这个顺序体验完整闭环：

1. 打开首页，查看卡片布局与主题
2. 进入 `/blog`，切换按年 / 分类视图
3. 点击一篇文章，查看 Markdown 渲染效果
4. 点击右上角「编辑」，进入编辑器修改内容
5. 导入 GitHub App Private Key 后保存，等待部署刷新

### Showcase — 界面一览

> 以下截图为占位，运行项目后可用真实界面替换 `docs/images/readme/` 下的文件。

| | | |
|:---:|:---:|:---:|
| [![首页](docs/images/readme/home.png)](docs/images/readme/home.png)<br><br>**首页**<br>模块化卡片 · 可拖拽布局 | [![博客列表](docs/images/readme/blog-list.png)](docs/images/readme/blog-list.png)<br><br>**博客列表**<br>按年 / 分类聚合 | [![文章详情](docs/images/readme/blog-detail.png)](docs/images/readme/blog-detail.png)<br><br>**文章详情**<br>代码高亮 · 公式 · 目录 |
| [![编辑器](docs/images/readme/editor.png)](docs/images/readme/editor.png)<br><br>**Markdown 编辑器**<br>实时预览 · 图片上传 | [![站点配置](docs/images/readme/config.png)](docs/images/readme/config.png)<br><br>**站点配置**<br>主题 · 社交 · 背景 | [![移动端](docs/images/readme/mobile.png)](docs/images/readme/mobile.png)<br><br>**移动端**<br>响应式卡片布局 |

---

## 日常使用方式

### 线上维护内容

日常维护可以直接走生产链接：

```text
打开站点 → 点击编辑入口 → 选择 / 粘贴 GitHub App Private Key
  → 修改文章或配置 → 保存 → GitHub 产生 commit
  → Vercel 自动部署 → 刷新查看结果
```

这不是绕过源码，而是让站点前端帮我完成一次结构化的 Git 写入。真正落地的内容仍然在 `Aafff623/my-blogs` 的 `main` 分支里。

适合在线编辑的内容：

| 类型 | 适合程度 | 说明 |
|---|:---:|---|
| 写文章 / 改文章 | ✅ | 标题、正文、摘要、标签、分类、封面 |
| 上传文章图片 | ✅ | 图片进入对应文章目录 |
| 首页基础配置 | ✅ | 主题色、头像、社交链接、卡片开关 |
| 分享 / 项目 / 关于页数据 | ✅ | 已有编辑入口的结构化内容 |
| 页面结构大改 | ❌ | 建议本地分支开发 |
| 新增复杂组件 | ❌ | 建议本地分支开发 |
| 修改认证 / GitHub 写入逻辑 | ❌ | 必须本地开发并验证 |

### 本地探索功能

实验性分支不需要专门部署到 Vercel。我的节奏是：

```text
新建本地分支 → pnpm dev 本地验证 → 合并 main → push → Vercel production 部署
```

这样生产环境保持干净，探索空间留在本地。

---

## 快速开始

### 前置环境

| 组件 | 版本建议 | 备注 |
| --- | --- | --- |
| Node.js | 20+ | 运行 Next.js 开发服务器 |
| pnpm | 8+ | 包管理器 |
| Git | 任意近期版本 | 拉取代码与同步内容 |
| 现代浏览器 | Chrome / Edge / Firefox | 访问编辑器与博客 |

### 本地开发

```bash
git clone https://github.com/Aafff623/my-blogs.git
cd my-blogs
pnpm install
pnpm dev
```

开发服务器默认端口是 `2025`：

[http://localhost:2025](http://localhost:2025)

### 常用命令

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建 Next.js 版本 |
| `pnpm start` | 启动生产构建 |
| `pnpm run build:cf` | 使用 OpenNext 构建 Cloudflare 版本 |
| `pnpm run preview` | 本地预览 Cloudflare Worker 构建 |
| `pnpm run deploy` | 部署到 Cloudflare |
| `pnpm run svg` | 重新生成 SVG 图标索引 |

### Vercel 环境变量

当前生产站点使用这些公开变量指向我的 GitHub App 与仓库：

| 变量 | 当前值 | 说明 |
|---|---|---|
| `NEXT_PUBLIC_GITHUB_OWNER` | `Aafff623` | GitHub 用户名 |
| `NEXT_PUBLIC_GITHUB_REPO` | `my-blogs` | 内容与代码所在仓库 |
| `NEXT_PUBLIC_GITHUB_BRANCH` | `main` | 线上写入分支 |
| `NEXT_PUBLIC_GITHUB_APP_ID` | `4213335` | GitHub App ID |

> `NEXT_PUBLIC_*` 会被打包进前端，不能放真正的 secret。GitHub App 的 `.pem` Private Key 只在浏览器编辑时临时使用。

<details>
<summary>首次配置 GitHub App（内容写入必需）</summary>

1. 进入 GitHub 个人设置 → Developer settings → GitHub Apps → New GitHub App。
2. 填写 App name 与 Homepage URL（内容随意）。
3. 关闭 Webhook。
4. 在 Permissions → Repository permissions 中，只勾选 **Contents: Read and write**。
5. 创建后，点击 **Generate a private key**，下载 `.pem` 文件。
6. 切换到 Install App 页面，选择 **Only select repositories**，授权你的内容仓库。
7. 复制页面上的 **App ID**，填入部署平台环境变量。
8. 重新部署，使环境变量生效。

> 更详细的图文教程见原作者引导：[https://www.yysuni.com/blog/readme](https://www.yysuni.com/blog/readme)

</details>

---

## GitHub App 写入流程

这个项目的在线编辑依赖 GitHub App，而不是个人访问令牌。核心流程如下：

```text
Private Key + App ID
  → 浏览器签发 GitHub App JWT
  → 查询仓库 installation
  → 创建 installation token
  → 写入 blob / tree / commit / ref
  → Vercel 监听 GitHub commit 并重新部署
```

关键文件：

| 文件 | 职责 |
|---|---|
| `src/lib/auth.ts` | 管理 Private Key、token 缓存与授权流程 |
| `src/lib/github-client.ts` | GitHub API 封装，包含 JWT 签名与 Git Data API |
| `src/app/write/services/push-blog.ts` | 新文章写入 |
| `src/app/blog/services/save-blog-edits.ts` | 文章编辑保存 |
| `src/app/(home)/services/push-site-content.ts` | 首页配置保存 |

私钥纪律：

- `.pem` 文件只放本地，不提交 Git。
- 不写入 Vercel 环境变量。
- 浏览器缓存只是为了减少重复输入；换浏览器、清缓存后需要重新选择私钥。

---

## 架构

```text
Next.js App Router
  → 浏览器编辑器 / 配置弹窗
    → GitHub App Auth
      → GitHub Git Data API
        → public/blogs / src/config / app data files
          → GitHub commit
            → Vercel production deployment
```

| 层 | 技术 | 说明 |
|---|---|---|
| 前端 | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 | App Router、卡片式首页、Markdown 编辑器 |
| 内容渲染 | marked · shiki · katex · html-react-parser | Markdown 解析、代码高亮、数学公式 |
| 内容存储 | GitHub 仓库文件 | 文章、图片、分类、页面数据都以文件形式存在 |
| 写入权限 | GitHub App · jsrsasign · AES-GCM | 浏览器端签发 JWT，可选加密缓存 Private Key |
| 部署 | Vercel production | `main` 分支变更后自动构建 |
| 备选部署 | Cloudflare Workers · OpenNext | 项目保留 Cloudflare 部署链路 |

**关键原则：**

- 内容即代码：每篇文章都是 Git 仓库中的文件，天然可版本化。
- 无传统后端：读写内容全部通过 GitHub API，不依赖数据库。
- 单分支直接提交：默认写入 `main`，没有 PR 流程（适合个人使用）。
- 写后需部署：提交成功后等待平台重新部署，刷新页面才能看到最新内容。
- Private Key 不离开浏览器：仅在用户浏览器内存中使用，可选加密缓存于 `sessionStorage`。

---

## 内容模型

每篇文章对应一个目录：

```text
public/blogs/{slug}/
├── index.md          # Markdown 正文
├── config.json       # 标题、日期、标签、分类、封面、摘要等元信息
└── assets...         # 文章图片或其他资源
```

全局索引：

| 文件 | 作用 |
|---|---|
| `public/blogs/index.json` | 文章列表与元数据索引 |
| `public/blogs/categories.json` | 分类列表与排序 |

其他内容区：

| 路径 | 说明 |
|---|---|
| `src/config/site-content.json` | 首页 meta、主题色、社交链接、背景与艺术图配置 |
| `src/config/card-styles.json` | 首页卡片布局与显示状态 |
| `src/app/about/list.json` | 关于页内容 |
| `src/app/projects/list.json` | 项目页内容 |
| `src/app/pictures/list.json` | 图片页内容 |
| `src/app/share/list.json` | 分享页内容 |
| `src/app/snippets/list.json` | 片段页内容 |

## 项目结构

```text
my-blogs/
├── public/
│   ├── blogs/              # 文章正文、元数据、文章图片
│   ├── images/             # 头像、艺术图、页面素材
│   ├── live2d/             # Live2D 模型资源
│   └── music/              # 音频资源
├── src/
│   ├── app/                # App Router 页面与 server/client actions
│   ├── components/         # 通用 UI 组件
│   ├── config/             # 站点内容与卡片样式配置
│   ├── hooks/              # 前端状态与数据 hooks
│   ├── layout/             # 页面骨架、Header、Footer、背景
│   ├── lib/                # Markdown、GitHub、认证、工具函数
│   ├── styles/             # 全局样式与文章样式
│   └── svgs/               # 图标资源
├── docs/
│   ├── adr/                # 架构决策记录
│   └── agents/             # Agent 协作说明
├── next.config.ts
├── open-next.config.ts
├── wrangler.toml
└── package.json
```

---

## 维护边界

这个 README 不想把项目包装成一个“人人适用的一站式平台”。它当前首先服务我的个人博客，然后再保留可复用价值。

| 方向 | 判断 |
|---|---|
| 文章、图片、站点配置 | 走线上编辑，保持轻量 |
| 视觉系统与复杂交互 | 走本地分支，确认后合并 |
| 数据所有权 | GitHub 仓库是事实源 |
| 部署目标 | production 只跟随 `main` |
| preview 分支 | 暂不部署到 Vercel，本地探索即可 |
| 密钥管理 | Private Key 不进入仓库、不进入 Vercel |

我希望这个项目保持一种“可被理解、可被拆开、可被继续改”的状态。博客不是终点，它也是我练习前端工程、内容组织和个人表达的场地。

---

## 路线图

| 阶段 | 状态 | 说明 |
|---|:---:|---|
| Fork 原博客并跑通部署 | ✅ | 从 `YYsuni/2025-blog-public` 改造为自己的仓库与 Vercel 项目 |
| GitHub App 写入链路 | ✅ | 已配置 `Aafff623/my-blogs`、App ID 与 production 环境变量 |
| 线上内容编辑 | ✅ | 可通过生产链接编辑文章与配置，提交到 GitHub 后触发部署 |
| README 个性化 | ✅ | 从安装教程转为个人项目入口 |
| 文档资产（CONTEXT.md + ADRs） | ✅ | 领域术语、架构决策与 Agent skills 配置 |
| 首页内容继续个人化 | 🔜 | 继续替换默认内容、艺术图、社交链接与卡片表达 |
| 视觉与交互实验 | 🔜 | 在本地分支探索，不直接污染 production |
| 内容整理 | 🔜 | 清理默认文章，沉淀自己的长期文章分类 |
| 搜索 / 评论 | 🔜 可选 | 未来可扩展功能 |

---

## 文档

| 文档 | 说明 |
|---|---|
| [`CONTEXT.md`](CONTEXT.md) | 领域术语、关键约束、代码约定、文件结构 |
| [`docs/adr/0001-github-as-cms.md`](docs/adr/0001-github-as-cms.md) | 为什么使用 GitHub 仓库作为 CMS |
| [`docs/adr/0002-cloudflare-opennext-deployment.md`](docs/adr/0002-cloudflare-opennext-deployment.md) | Cloudflare / OpenNext 部署决策 |
| [`docs/adr/0003-markdown-rendering-pipeline.md`](docs/adr/0003-markdown-rendering-pipeline.md) | Markdown 渲染链路 |
| [`docs/adr/0004-github-app-authentication.md`](docs/adr/0004-github-app-authentication.md) | GitHub App 认证与写入方式 |
| [`docs/adr/0005-nextjs-16-react-19.md`](docs/adr/0005-nextjs-16-react-19.md) | Next.js / React 选型 |
| [`docs/adr/0006-tailwind-css-v4.md`](docs/adr/0006-tailwind-css-v4.md) | Tailwind CSS v4 选型 |
| [`docs/agents/`](docs/agents/) | Agent 协作与 triage 文档 |
| [`CLAUDE.md`](CLAUDE.md) | 本仓库的 Agent 工作指令 |

原作者图文教程：[https://www.yysuni.com/blog/readme](https://www.yysuni.com/blog/readme)

---

## Credits

本项目 fork 自 [YYsuni/2025-blog-public](https://github.com/YYsuni/2025-blog-public)。原项目提供了 GitHub-as-CMS、前端写作、配置面板和部署教程的核心基础；本仓库在此之上继续个人化改造。

## 社区

- QQ 群：[https://qm.qq.com/q/spdpenr4k2](https://qm.qq.com/q/spdpenr4k2)
- Telegram：[https://t.me/public_blog_2025](https://t.me/public_blog_2025)
- 微信群：见原 README 中的二维码

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Aafff623/my-blogs&type=Date)](https://star-history.com/#Aafff623/my-blogs&Date)

## License

本项目继承原仓库许可证，详见 [`LICENSE`](LICENSE)。
