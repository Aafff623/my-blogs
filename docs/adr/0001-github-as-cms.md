# ADR-0001: 使用 GitHub 仓库作为博客 CMS

## 状态

已接受

## 背景

2025-blog 需要一个既能存储内容、又能让前端直接写入的后台。项目面向个人博主，尤其包括非程序员用户，因此方案需要满足：

- 免费或低成本
- 无需维护独立服务器
- 内建版本控制与历史回溯
- 用户真正“拥有”自己的内容和数据

## 决策

将博客内容存储在 GitHub 仓库的 `public/blogs/` 目录下：

- 每篇文章对应一个目录 `public/blogs/{slug}/`。
- 目录内包含：
  - `index.md`：文章正文（Markdown）。
  - `config.json`：标题、标签、日期、摘要、封面、分类、是否隐藏等元数据。
  - 资源文件：文章内引用的图片等。
- 全局索引 `public/blogs/index.json` 保存所有文章元数据，用于列表页。
- 全局 `public/blogs/categories.json` 保存分类列表。
- 前端通过 GitHub API（Contents API 与 Git Data API）读取和写入这些文件。

## 后果

### 正面

- 零成本：GitHub 免费私有/公开仓库即可满足个人博客需求。
- 版本控制：每次编辑都是一次 Git commit，天然支持回滚与审计。
- 数据所有权：仓库属于用户，内容不绑定任何商业平台。
- 静态化友好：Next.js 可以直接把 `public/blogs/` 下的文件当作静态资源读取。

### 负面

- 写入延迟：提交后需要等待部署完成，用户刷新才能看到更新。
- 并发风险：单分支直接提交，多用户同时编辑可能出现冲突（当前以个人使用为主）。
- API 限制：GitHub API 有 rate limit，大量图片或频繁操作可能受限。
- 内容仓库与代码仓库可配置为同一仓库或分离仓库；若放在同一仓库，内容增多会拖慢 clone/构建。README 示例推荐将内容放在独立的公开仓库。

## 替代方案

- **Headless CMS（如 Sanity、Strapi、Contentful）**：功能更强，但需要额外服务、可能有费用、数据不完全由用户控制。
- **数据库（如 PostgreSQL + 自研 API）**：需要维护后端和数据库，违背“无服务器”目标。
- **纯本地 Markdown + 构建时导入**：更安全、更简单，但无法通过浏览器在线编辑。

## 相关文件

- `src/lib/github-client.ts`
- `src/lib/load-blog.ts`
- `src/lib/blog-index.ts`
- `src/app/write/services/push-blog.ts`
- `src/app/blog/services/save-blog-edits.ts`
- `public/blogs/`
