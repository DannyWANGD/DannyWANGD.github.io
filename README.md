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

在 `src/data/projects.json` 增加条目，填写唯一的 `id`、`title`、`description`、`tags`，并为每个项目选择插图，配置 `image` 和 `imageAlt`。可选字段：

- `link`：代码或项目地址。
- `links`：同一项目的多个入口，格式为 `[{ "label": "Python pipeline", "url": "https://github.com/..." }]`；有此配置时替代默认的 Explore the code 链接。
- `imageScale`：插图显示比例，默认 `1`；例如 `0.6666666667` 表示宽高缩至原来的 2/3。插图靠左，电脑端文字随图片列一起向左收紧，图文间距为 24px；手机端保持左对齐并上下排列。
- `contribution`、`result`：个人贡献与可验证结果。
- `slug`、`subtitle`、`language`：项目的稳定锚点、副标题与正文语言；报告条目使用短标题配副标题。
- `report`：工程报告，包含 `file`（`/pdf/原文件名.pdf`）、`pages`（PDF 实际页数）、`startPage`（阅读起始页）、`figurePage`（代表图所在 PDF 页码）。配置后，标题直接打开原文，并自动显示阅读与图表出处链接。
- `imageCaption`：封面图注，说明原文图号或“方法示意”。

图片放入 `public/images/projects/`，使用 `/images/projects/文件名.png`、`.jpg` 或 `.webp` 引用；`imageAlt` 填写图片内容说明。图片在约 16:10 的展示区域完整显示，不裁切架构图。首项 QECNN 已配置为 `/images/projects/QECNN.png`。暂未配置图片时保留文字版回退布局。

第二项 PaperBrain 将 Python 后端与 Obsidian 插件合并展示，并保留各自的仓库链接；封面 `/images/projects/PaperBrain.png` 采用 [PaperBrain 仓库自带的项目品牌图](https://github.com/DannyWANGD/PaperBrain/blob/main/paperbrain_arch.png)。两项插图均使用 `imageScale: 0.6666666667`，保持尺寸与左对齐一致。

第三项 ROBOCON 2026 排球机器人对应 [volleyball_1](https://github.com/DannyWANGD/volleyball_1)，介绍前车板的嵌入式控制功能；封面 `/images/projects/ROBOCON-2026.jpg` 为本人提供的赛事图片，完整保留原图，沿用 2/3 图片比例与左对齐。

第四项 Focus Lamp 对应 [Focus_Lamp](https://github.com/DannyWANGD/Focus_Lamp)，展示基于 Human Computer Lab 的 LeLamp 平台扩展的专注辅助交互原型。封面 `/images/projects/Focus-Lamp.png` 完整采用[仓库中的 LeLamp 模型图](https://github.com/DannyWANGD/Focus_Lamp/blob/main/assets/images/1_lamp_3d.png)，保留原图内容，并提供 LeLamp 平台入口；原项目许可副本保存在 `public/images/projects/LeLamp-LICENSE.txt`。项目展示于 Research & Projects 第四项，首页继续按前三项精选展示。

例如，在数组中添加下面的对象，并将示例文字和路径替换为真实信息：

```json
{
  "id": 13,
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

保存 `projects.json` 后，首页 Selected work 展示数组前三项，Research & Projects 展示全部条目；无需修改页面代码。

### 工程报告与 PDF

PDF 保留在 `public/pdf/`，封面放入 `public/images/projects/reports/`。目前已整理 8 份报告、共 250 页，分别涵盖视觉与惯性信号同步、活动轮廓分割、体育运营优化、光伏功率预测、大气边界层预测、NIPT 风险建模、Airbnb 空间分析和可持续旅游。

- 报告入口：`/publications/#engineering-reports`。索引按配置顺序定位到各自 `slug`，每份 PDF 对应一个独立项目。
- 点击报告标题或“阅读报告”会在新标签打开 PDF；点击封面或“图表出处”会打开 `figurePage`。页码按 PDF 实际页序计数，包含封面、目录、承诺书；`startPage` 可跳过承诺书直达摘要。
- 7 张 WebP 封面取自报告原图，仅裁去页面正文并等比例留白；同步课件使用原创 SVG 方法示意，波形不代表实验数据。原图出处已写入各条目的图注和 `figurePage`。
- 构建时同时生成页面索引和包含报告 PDF 的站点地图；内容检查会验证 PDF 与项目一一对应、封面存在以及跳转页码合法。

新增报告时，先放入 PDF 与封面，再在 `projects.json` 添加以下格式的条目，替换文件名、页数及文字：

```json
{
  "id": 13,
  "slug": "my-engineering-report",
  "title": "简洁的项目标题",
  "subtitle": "要解决的工程问题与主要方法",
  "description": "依据报告摘要、方法与结论撰写，不将模型实验结果表述为实际部署效果。",
  "language": "zh-CN",
  "tags": ["Signal Processing", "Modeling"],
  "image": "/images/projects/reports/my-engineering-report.webp",
  "imageScale": 0.6666666667,
  "imageAlt": "图表内容说明",
  "imageCaption": "原文图 1 · 方法流程",
  "report": {
    "file": "/pdf/我的工程报告.pdf",
    "pages": 20,
    "startPage": 1,
    "figurePage": 3
  }
}
```

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
