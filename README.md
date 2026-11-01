# Ding Wang · Personal Homepage

个人研究主页，采用 React 18、TypeScript、Tailwind CSS 和 Vite。内容由 JSON 和 Markdown 管理，构建时生成可直接阅读的静态 HTML，部署到 GitHub Pages。

## 本地使用

需要 Node.js 22 和 npm。

```sh
npm ci
npm run dev
```

提交前执行：

```sh
npm run check
npm run lint
npm test
npm run build
npm run preview
```

`build` 会生成文章索引、检查 TypeScript、打包并预渲染所有公开页面，同时生成 `dist/sitemap.xml`、`dist/rss.xml`、`dist/robots.txt` 和 `dist/404.html`。`preview` 用于检查最终产物。

## 更新个人资料

- `src/data/profile.json`：姓名、简介、头像、首页照片、联系信息、研究兴趣和教育经历。`heroImage` 控制首页大照片，`avatar` 控制导航标识。
- `src/data/site.json`：正式域名、分享图片和站点描述；首页已移除 Latest updates 栏目。
- `src/data/awards.json`：奖项。日期统一为 `YYYY-MM`；`level` 使用 `national` 或 `international`；首页按时间倒序、统一样式完整展示，`description` 中的 `/` 分隔同一赛事的多项荣誉。
- `src/data/publications.json`：论文。为空时自动隐藏论文区块。
- CV 放入 `public/files/`，将 `profile.json` 的 `cv` 设为 `/files/文件名.pdf`；为空时隐藏按钮。

## 新增项目

在 `src/data/projects.json` 增加条目，至少填写 `id`、`title`、`description`、`tags`。可选字段：

- `link`：代码或项目地址。
- `image`、`imageAlt`：本地项目图片路径与说明。
- `contribution`、`result`：个人贡献与可验证结果。

图片放入 `public/images/projects/`，使用 `/images/projects/文件名.webp` 引用；推荐约 16:10 的宽高比。没有项目图时展示文字版布局，不自动生成示意成果。

例如，在数组中添加下面的对象，并将示例文字和路径替换为真实信息：

```json
{
  "id": 2,
  "title": "项目名称",
  "description": "项目要解决的问题与方法。",
  "tags": ["Robotics", "Learning"],
  "link": "https://github.com/你的账号/项目仓库",
  "image": "/images/projects/项目图片.webp",
  "imageAlt": "图片内容说明",
  "contribution": "你具体完成的工作。",
  "result": "可以公开验证的结果。"
}
```

保存 `projects.json` 后，首页 Selected work 与 Research & Projects 页面都会自动更新；无需修改页面代码。

## 发布文章

在 `src/posts/` 新增 `.md`；文件名即 URL，请避免修改已公开的文件名。

```markdown
---
title: "文章标题"
date: "2026-10-31"
updated: "2026-10-31"
description: "简洁说明文章的内容与价值。"
category: "Robotics"
collection: "research"
tags: ["Robotics", "Learning"]
draft: false
archived: false
---

## 第一个章节

正文……
```

- `collection` 使用 `research` 或 `deep-reading`。
- 页面已展示文章标题，正文从 H2（`##`）开始；目录自动读取实际渲染的 H2–H4，无需手写目录。
- `draft: true` 或 `archived: true` 的文章不进入公开列表、文章加载清单、RSS、站点地图及预渲染页面。不要在仓库中提交不能公开的材料。
- 发布日期未知时可暂留空，页面不会显示虚构日期；`updated` 未填写时沿用发布日期。
- 深度阅读可增加 `sourceName`、`sourceUrl` 和 `sourceType`。
- 支持 GFM 表格、数学公式、代码高亮，以及 Obsidian 图片、提示块与高亮语法。图片放入 `public/pictures/`。
- 开发服务器与构建会自动更新 `src/data/post-index.json` 和 `src/data/post-loaders.ts`；这两个文件无需手工编辑。

## 更新头像和生活记录

- 网站头像：`public/images/avatar.webp`；原始 JPEG 保存在 `public/images/avatar.jpg`。
- 首页大照片：`public/images/home-portrait.webp`，通过 `profile.json` 的 `heroImage` 单独配置。
- 标签页图标：`public/favicon.png`；Apple 图标：`public/apple-touch-icon.png`；分享图片：`public/images/social.jpg`。更换头像时同步更新这些资源。
- 生活照片放入 `public/images/life/`；在 `src/data/life.json` 填写 `id`、`title`、`image`、`date`、`description`，可选 `location`。列表为空时导航自动隐藏 Life，已有 `/life` 路由仍可访问。

## 联系入口与字体

- 首页联系栏通过 `profile.json` 的 `email`、`details.wechat`、`social.xiaohongshu`、`social.github` 配置。邮箱打开邮件客户端，小红书和 GitHub 打开对应主页。
- 微信号只保存在配置中，不直接展示；点击微信按钮后复制。优先使用 Clipboard API，兼容模式使用临时隐藏选区；失败时给出重试提示。
- 联系图标位于 `public/icons/`，来源和许可记录见该目录的 `README.md`。
- 全站中文使用本机宋体（SimSun）；macOS 使用宋体风格的 Songti SC 回退。博客正文英文使用 Times New Roman，行内代码与代码块使用 Cascadia Code / Consolas 等宽字体。字体规则位于 `src/index.css` 与 `tailwind.config.js`，未分发商业字体文件。

## 部署与维护

推送到 `main` 后，GitHub Actions 使用 Node.js 22 安装依赖、构建、检查代码并发布 `dist/` 到 `gh-pages`。本地修改和预览不会发布网站。

后续更新线上网页：

1. 修改相应内容：个人资料编辑 `src/data/profile.json`，项目编辑 `src/data/projects.json`，奖项编辑 `src/data/awards.json`，文章添加到 `src/posts/`。
2. 用 `npm run dev` 预览；发布前运行 `npm run check`、`npm run lint`、`npm test` 和 `npm run build`。
3. 在仓库目录提交并推送：

   ```sh
   git add -A
   git commit -m "Update homepage content"
   git push origin main
   ```

4. 在 [GitHub Actions](https://github.com/DannyWANGD/DannyWANGD.github.io/actions) 等待 `Deploy to GitHub Pages` 和后续 Pages 部署成功，再打开 [正式网站](https://dannywangd.github.io/)。若看到旧内容，使用 Ctrl+F5 刷新。

不必手动上传 `dist/`，也不必每次创建 GitHub Release。构建或检查失败时，网站不会发布这次更新；修复后再次提交推送即可。

发布后检查首页、文章直链及刷新、图片、CV、分享预览和 404。换域名时更新 `src/data/site.json` 的 `url` 和 `package.json` 的 `homepage`。具体待办见 `WEBSITE_IMPROVEMENT_CHECKLIST.md`。
