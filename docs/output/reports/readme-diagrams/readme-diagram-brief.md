# my-blogs — README 配图生成说明

> **用途**：将本文档整份拖拽给 GPT Image / DALL·E 等模型，按下方规格分别生成架构图、技术栈图、流程图、目录结构图。  
> **本文档路径**：`docs/output/reports/readme-diagrams/readme-diagram-brief.md`  
> **配图输出目录**：生成后保存到 `docs/images/readme/`，文件名必须与下表一致，README 会自动引用。

---

## 1. 项目一句话

**my-blogs** 是 threetwoa 的个人博客：浏览器写作，GitHub 存内容，Vercel 发布。无传统后端，前端即编辑器。

- 仓库：`Aafff623/my-blogs`
- 线上：https://my-blogs-roan-seven.vercel.app
- 本地：http://localhost:8123
- Slogan：*code less, architect more*

---

## 2. 视觉风格（四张图统一）

| 项 | 值 |
|---|---|
| 风格 | 扁平信息图 / 轻量技术插画，干净、可读，非照片写实 |
| 主色 | 珊瑚红 `#de4331` |
| 辅色 | 暖黄 `#FCC841`、浅天蓝 `#d4e8f3` |
| 文字色 | 深灰 `#4E3F42`、次要 `#8b7667` |
| 背景 | 浅蓝或白底，模块用圆角卡片 + 轻阴影 |
| 语言 | **图中文字用中文**（节点标签、箭头说明） |
| 比例 | 横版 **16:9**，建议宽度 1600px 以上 |
| 禁止 | 不要加虚假 Logo、不要拥挤、不要 3D 炫光 |

---

## 3. 图 A — 系统架构图

**保存文件名**：`architecture.png`

### 要表达什么

从「用户浏览器」到「线上站点」的完整链路：读内容走静态文件，写内容走 GitHub API。

### 节点（必须出现）

| 节点 ID | 显示名称 | 说明 |
|---|---|---|
| `browser` | 浏览器 | 用户访问站点、在线编辑 |
| `nextjs` | Next.js 16 前端 | App Router，页面 + 编辑器 |
| `static` | public/blogs/ 静态内容 | index.json、文章目录、图片 |
| `editor` | /write 编辑器 | 写作、改配置、上传图片 |
| `jwt` | jsrsasign JWT | 浏览器用 Private Key 签发 |
| `gh-app` | GitHub App | Installation Token |
| `gh-api` | GitHub Git Data API | commit 写入 main |
| `vercel` | Vercel 部署 | main 更新后自动构建发布 |

### 连线逻辑

```text
【读路径 — 实线，从左到右】
浏览器 → Next.js 前端 → 读取 public/blogs/ 静态文件 → 渲染页面（首页 /blog /blog/[slug]）

【写路径 — 虚线或另一颜色，从编辑器向下再向右】
浏览器 /write 编辑器 → 导入 .pem → jsrsasign 签发 JWT → GitHub App → Installation Token
  → GitHub Git Data API → commit 到 main 分支 → Vercel 检测到更新 → 重新部署 → 浏览器看到新内容
```

### 布局建议

- 上半区：读路径（水平流水线）
- 下半区：写路径（U 形或折线，强调「无后端服务器」）
- 角标注明：**无传统后端 · 内容即代码**

---

## 4. 图 B — 技术栈分层图

**保存文件名**：`tech-stack.png`

### 分层（从上到下 5 层）

| 层级 | 名称 | 包含技术 | 职责 |
|---|---|---|---|
| L1 | 体验层 | Next.js 16 · React 19 · Tailwind CSS v4 · motion · lucide-react | 页面、动画、响应式 UI |
| L2 | 状态与数据 | zustand · SWR · dayjs | 全局状态、博客索引缓存、日期处理 |
| L3 | 内容渲染 | marked · shiki · katex · html-react-parser | Markdown、代码高亮、数学公式 |
| L4 | 写入与认证 | jsrsasign · GitHub App API · AES-GCM（可选密钥缓存） | 浏览器侧 JWT、Git 提交 |
| L5 | 内容与部署 | public/blogs/ · JSON 配置 · Vercel · OpenNext Cloudflare（备选） | 静态 CMS 数据、生产部署 |

### 绘图逻辑

- 用 **5 个水平色带** 或 **5 个堆叠卡片** 表示分层
- 每层左侧写层级名，右侧列 2–4 个技术标签（圆角 pill）
- 层与层之间用细箭头表示「上层调用下层」
- 侧边备注：React Compiler 已启用 · TypeScript · pnpm

### 核心页面标注（可放在 L1 角落）

`/ · /blog · /blog/[slug] · /write · /about · /projects`

---

## 5. 图 C — 内容写入流程图

**保存文件名**：`workflow.png`

### 流程步骤（按顺序，9 步）

| 步骤 | 动作 | 角色/组件 |
|---|---|---|
| 1 | 打开生产站点或本地 `localhost:8123` | 用户 |
| 2 | 进入 `/write` 或点击「编辑」 | 浏览器 |
| 3 | 导入 GitHub App Private Key（.pem） | useAuthStore |
| 4 | 编辑文章 / 封面 / 站点配置 | write-store · 各 Section 组件 |
| 5 | 点击保存 | push-blog / save-blog-edits 等服务 |
| 6 | jsrsasign 签发 JWT → 换取 Installation Token | github-client.ts |
| 7 | Git Data API 创建 commit 到 `main` | GitHub |
| 8 | Vercel 监听仓库更新，触发构建部署 | Vercel |
| 9 | 用户刷新站点，看到新内容 | Next.js 读最新静态文件 |

### 绘图逻辑

- **标准流程图**：圆角矩形 = 步骤，菱形 = 判断（可选：是否已导入密钥）
- 主路径用珊瑚红箭头
- 分支（可选）：未导入密钥 → 提示导入 .pem → 回到步骤 3
- 底部注释：部署约 60 秒 · Private Key 不提交仓库

---

## 6. 图 D — 项目目录结构图

**保存文件名**：`structure.png`

### 要画的目录树（精简版，只保留关键路径）

```text
my-blogs/
├── README.md · README.en.md · CONTEXT.md
├── package.json                    # dev 端口 8123
├── .env.example
├── docs/
│   ├── adr/                        # 架构决策
│   ├── agents/                     # Agent 规则
│   ├── images/readme/              # README 配图 ← 生成图放这里
│   └── output/                     # 本文档所在
│       └── reports/readme-diagrams/
├── public/
│   └── blogs/                      # ★ CMS 内容根
│       ├── index.json              # 文章索引
│       ├── categories.json
│       └── {slug}/
│           ├── index.md
│           ├── config.json
│           └── 图片...
└── src/
    ├── app/
    │   ├── (home)/                 # 卡片首页
    │   ├── blog/                   # 列表 + 详情
    │   ├── write/                  # 编辑器
    │   └── about/ projects/ ...    # 内容片段
    ├── components/                 # blog-preview · blog-sidebar · image-carousel
    ├── config/site-content.json    # 主题与文案
    ├── hooks/
    └── lib/
        ├── github-client.ts        # ★ GitHub 写入
        └── markdown-renderer.ts    # ★ Markdown 渲染
```

### 绘图逻辑

- 树状图，左侧根节点 `my-blogs`
- 用 **★** 或高亮框标出 `public/blogs/`、`github-client.ts`、`markdown-renderer.ts`
- `docs/images/readme/` 用不同颜色提示「配图目录」
- 不要画 node_modules

---

## 7. 术语表（图中可能出现）

| 中文 | 英文 | 含义 |
|---|---|---|
| 文章 | Post | `public/blogs/{slug}/` 一篇博客 |
| 文章索引 | Blog Index | `public/blogs/index.json` |
| 站点配置 | Site Content | `src/config/site-content.json` |
| 内容片段 | Content Fragment | about / projects / pictures 等 |
| 安装令牌 | Installation Token | GitHub App 短期写入凭证 |
| 卡片 | Card | 首页可拖拽模块 HiCard、ArtCard |

---

## 8. 已有配图（无需重新生成）

| 文件 | 内容 |
|---|---|
| `banner.png` | README 顶部横幅（二次元风，已就位） |
| `home.jpg` | 首页截图 |
| `blog.jpg` | 文章时间线截图 |
| `article.jpg` | 文章阅读页截图 |

---

## 9. 生成清单（Checklist）

生成后请确认：

- [x] `docs/images/readme/architecture.png` — 系统架构图
- [x] `docs/images/readme/tech-stack.png` — 技术栈分层图
- [x] `docs/images/readme/workflow.png` — 内容写入流程图
- [x] `docs/images/readme/structure.png` — 目录结构图

全部就位后，README 中「架构与结构」「技术栈」章节会自动显示对应配图。

---

## 10. 给 GPT 的逐图 Prompt 模板（可直接复制）

### Prompt A — architecture.png

```
绘制一张 16:9 横版中文技术架构信息图。项目名 my-blogs，个人博客，GitHub 作 CMS，Vercel 部署。
上半部分「读路径」：浏览器 → Next.js 16 前端 → public/blogs 静态文件 → 渲染页面。
下半部分「写路径」：/write 编辑器 → 导入 pem → jsrsasign JWT → GitHub App → Git Data API → commit main → Vercel 部署。
主色 #de4331，背景浅蓝 #d4e8f3，扁平圆角卡片风格，标注「无传统后端」。
```

### Prompt B — tech-stack.png

```
绘制 16:9 中文技术栈分层图，5 层从上到下：
体验层 Next.js16 React19 Tailwind4 motion；
状态层 zustand SWR；
渲染层 marked shiki katex；
写入层 jsrsasign GitHub App；
部署层 public/blogs Vercel。
主色 #de4331 与 #FCC841，扁平 pill 标签，清晰可读。
```

### Prompt C — workflow.png

```
绘制 16:9 中文流程图：用户打开站点 → 进入 write → 导入 pem 密钥 → 编辑文章 → 保存
→ JWT → GitHub commit → Vercel 部署 → 刷新看到新内容。珊瑚红箭头，圆角步骤框，底部注明部署约60秒。
```

### Prompt D — structure.png

```
绘制 16:9 中文项目目录树状图：my-blogs 根下 docs public src。
高亮 public/blogs（CMS）、src/lib/github-client.ts、markdown-renderer.ts。
标注 docs/images/readme 为配图目录。扁平技术插画，主色 #de4331。
```
