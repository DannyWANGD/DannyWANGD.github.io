# 技术架构说明

## 技术栈

- React 18、TypeScript、React Router 7。
- Vite 6、Tailwind CSS 3，全局版式与阅读样式位于 `src/index.css`。
- react-markdown、remark-gfm、remark-math、rehype-raw、rehype-slug、KaTeX 和代码高亮。
- Node.js 22，静态部署至 GitHub Pages，无数据库或登录后台。

## 内容流

1. 资料、项目、荣誉、动态和生活记录存储于 `src/data/`，文章存储于 `src/posts/`。
2. `src/utils/post-content.mjs` 统一解析元数据、换行与 Obsidian 语法，并保护代码内容。
3. `scripts/content.mjs` 过滤草稿和归档文章，生成摘要索引与公开文章的动态加载清单。
4. 列表页只加载摘要；文章正文、Markdown 渲染、数学排版与代码高亮按需加载。
5. 开发时监听 Markdown 更新；构建前重新生成内容索引。

## 构建与静态页面

`npm run build` 先生成索引、执行 TypeScript 检查，再运行 `scripts/build.mjs`：

1. Vite 生成浏览器代码与资源清单。
2. Vite SSR 加载 `src/entry-server.tsx`，通过 React `renderToString` 输出首页、项目、写作、公开文章及生活页面。
3. `src/utils/pageMetadata.ts` 提供每个路由的标题、描述、canonical、分享图片、文章日期与索引状态，供静态构建和浏览器路由切换共同使用。
4. 每条公开路由生成对应目录的 `index.html`；文章页引用公式与代码所需样式，禁用 JavaScript 时也能阅读正文。
5. 额外生成 `404.html`、`sitemap.xml`、`rss.xml`、`robots.txt` 和 `.nojekyll`。

浏览器按路由加载 React 页面；GitHub Pages 直接提供对应静态 HTML，未知地址使用 `404.html`。导航、搜索与目录交互由 React 提供。

## 目录与阅读

`MarkdownBody.tsx` 先处理内嵌 HTML，再为标题分配 ID。`TableOfContents.tsx` 读取正文实际渲染的 H2–H4 和 ID，避免独立正则生成不同锚点；代码块不会成为目录项。支持中文、重复标题、标点和内嵌 HTML。

目录追踪当前章节；桌面使用侧栏，窄屏使用可展开区块。宽公式、表格和代码使用局部滚动，图片采用本地资源、替代文本、延迟加载和失败回退。

## 关键文件

- `src/App.tsx`：懒加载路由与浏览器元数据更新。
- `src/components/SiteLayout.tsx`：统一导航、主区域和页脚。
- `src/components/ProjectCard.tsx`：有图或纯文字项目展示。
- `src/components/Article.tsx`：文章标题、阅读进度和目录布局。
- `src/data/profile.json`、`site.json`：个人资料与站点配置。
- `.github/workflows/deploy.yml`：安装、构建、Lint 与 GitHub Pages 发布。

## 维护约束

正文支持受信任的仓库内 HTML；新增不受信任的投稿或在线编辑入口前，需要增加 HTML 清洗。不得将私密草稿提交到公开仓库。

提交前执行 `npm run check`、`npm run lint` 和 `npm run build`，并用 `npm run preview` 复查最终产物。具体内容维护流程见 README。
