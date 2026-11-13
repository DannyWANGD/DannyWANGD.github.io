const en = {
  common: {
    home: 'Home', projects: 'Research & Projects', blog: 'Blog', life: 'Life', email: 'Email',
    skip: 'Skip to content', mainNav: 'Main navigation', mobileNav: 'Mobile navigation',
    openNav: 'Open navigation', closeNav: 'Close navigation', switchLanguage: '切换到中文',
    loading: 'Loading…', imageUnavailable: 'Image unavailable', backHome: 'Back home',
    allPosts: 'All posts', allProjects: 'All projects', cv: 'CV',
  },
  home: {
    eyebrow: 'Robotics · Learning · Building', explore: 'Explore my work', contact: 'Get in touch',
    about: 'About me', aboutEyebrow: 'A little about me', interests: 'Research interests',
    practice: '01 / In practice', selectedWork: 'Selected work', browseReports: 'Browse engineering reports',
    recognition: '02 / Recognition', honors: 'Honors & awards', notes: '03 / Working things out',
    selectedPosts: 'Selected posts', background: '04 / Background', education: 'Education',
  },
  contact: {
    title: 'Let’s connect.', description: 'Research, projects, or a conversation.', wechat: 'WeChat',
    copy: 'Copy WeChat ID', copied: 'WeChat ID copied. Search for it in WeChat to connect.',
    failed: 'Could not copy. Allow clipboard access and try again.', xiaohongshu: 'Xiaohongshu',
    visit: 'Visit my profile', xiaohongshuLabel: 'Xiaohongshu profile (opens in a new tab)',
    githubLabel: 'GitHub profile (opens in a new tab)',
  },
  projects: {
    eyebrow: 'Ideas into practice', description: 'Open-source tools and engineering studies in perception, prediction, and decision-making.',
    reports: 'Engineering reports', reportsEyebrow: 'Engineering / Analysis / Modeling', reportCount: 'reports · PDF',
    reportsIntro: 'From perception and signal processing to forecasting and decision optimization, each entry outlines the problem, methods, and a representative figure. Use the index to find a project; open its title or “Read report” to view the original PDF.',
    index: 'Report index', indexLabel: 'Engineering report index', publications: 'Publications',
    read: 'Read report', pages: 'pp.', figure: 'Figure source', code: 'Explore the code',
    contribution: 'My contribution.', result: 'Result.',
  },
  blog: {
    title: 'Notes & ideas.', description: 'Derivations and experiments from research, alongside ideas worth returning to.',
    categories: 'Blog categories', all: 'All', research: 'Research', deep: 'Deep reading',
    researchTitle: 'Research & Tutorials', deepTitle: 'Deep Reading', researchNote: 'Research note',
    search: 'Search blog', placeholder: 'Search articles…', clearSearch: 'Clear search', searching: 'Searching articles…',
    oneResult: '1 article found', results: '{count} articles found', noMatch: 'No matching notes',
    limitedSearch: 'Full-text search is unavailable. Titles and summaries are still searchable.',
    trySearch: 'Try another topic or clear your search.', clear: 'Clear filters', minutes: 'min read',
    updated: 'Updated', source: 'Original source', continue: 'Continue reading', contents: 'On this page',
    articleContents: 'Article contents', mobileContents: 'Mobile article contents',
    unavailable: 'This article is unavailable or has been archived.', loadTitle: 'Unable to load this article',
    loadError: 'The article could not be loaded. Please try refreshing the page.', retry: 'Try again', opening: 'Opening the notebook…',
  },
  life: {
    eyebrow: 'Away from the desk', title: 'Life, in moments.', description: 'Photographs and observations along the way.',
    empty: 'No photographs published yet.', back: 'All moments', unpublished: 'This photograph has not been published.',
  },
  notFound: {
    eyebrow: '404 / A little off the path', title: 'Page not found.', message: 'This page could not be found.', browse: 'Browse blog',
  },
  metadata: {
    homeTitle: 'Ding Wang · Robotics & Embodied AI',
    home: 'Ding Wang — Robotics Engineering at Beijing Institute of Technology. Projects and notes on embodied AI, robot manipulation, and reinforcement learning.',
    projects: 'Open-source projects and engineering reports in robotics, signal processing, computer vision, forecasting, and decision optimization, with original PDFs.',
    blog: 'Research notes, practical tutorials, and deep reading on robotics, machine learning, and ideas worth keeping.',
  },
};

type Messages = { [Section in keyof typeof en]: { [Key in keyof typeof en[Section]]: string } };

const zh: Messages = {
  common: {
    home: '首页', projects: '研究与项目', blog: '博客', life: '生活', email: '邮箱',
    skip: '跳转到正文', mainNav: '主导航', mobileNav: '移动端导航',
    openNav: '打开导航', closeNav: '关闭导航', switchLanguage: 'Switch to English',
    loading: '加载中…', imageUnavailable: '图片暂不可用', backHome: '返回首页',
    allPosts: '全部文章', allProjects: '全部项目', cv: '简历',
  },
  home: {
    eyebrow: '机器人 · 学习 · 创造', explore: '浏览我的项目', contact: '与我联系',
    about: '关于我', aboutEyebrow: '关于我', interests: '研究兴趣',
    practice: '01 / 探索与实践', selectedWork: '精选项目', browseReports: '浏览工程报告',
    recognition: '02 / 荣誉与认可', honors: '荣誉与奖项', notes: '03 / 研究与思考',
    selectedPosts: '精选文章', background: '04 / 求学经历', education: '教育背景',
  },
  contact: {
    title: '保持联系', description: '交流研究、项目与想法。', wechat: '微信', copy: '点击复制微信号',
    copied: '微信号已复制，请在微信中搜索添加。', failed: '复制失败，请允许浏览器访问剪贴板后重试。',
    xiaohongshu: '小红书', visit: '访问我的主页', xiaohongshuLabel: '小红书主页（新窗口）', githubLabel: 'GitHub 主页（新窗口）',
  },
  projects: {
    eyebrow: '让想法成为实践', description: '围绕感知、预测与决策，记录开源工具与工程研究。',
    reports: '工程报告', reportsEyebrow: '工程 / 分析 / 建模', reportCount: '份报告 · PDF',
    reportsIntro: '从感知与信号处理到预测与决策优化，以下条目整理了各报告的问题、方法与代表图。选择索引可定位项目，点击标题或“阅读报告”可直接打开 PDF 原文。',
    index: '报告索引', indexLabel: '工程报告索引', publications: '学术论文',
    read: '阅读报告', pages: '页', figure: '图表出处', code: '查看代码', contribution: '个人贡献：', result: '项目结果：',
  },
  blog: {
    title: '笔记与思考', description: '研究中的推导与实践，以及值得反复阅读的思考。',
    categories: '博客分类', all: '全部', research: '研究笔记', deep: '深度阅读',
    researchTitle: '研究与教程', deepTitle: '深度阅读', researchNote: '研究笔记',
    search: '搜索博客', placeholder: '搜索文章…', clearSearch: '清空搜索', searching: '正在搜索文章…',
    oneResult: '找到 1 篇文章', results: '找到 {count} 篇文章', noMatch: '未找到相关笔记',
    limitedSearch: '正文搜索暂不可用，仍可搜索标题和摘要。',
    trySearch: '试试其他关键词，或清除筛选条件。', clear: '清除筛选', minutes: '分钟阅读',
    updated: '更新于', source: '原始来源', continue: '继续阅读', contents: '文章目录',
    articleContents: '文章目录', mobileContents: '移动端文章目录',
    unavailable: '这篇文章暂不可用或已归档。', loadTitle: '文章加载失败',
    loadError: '暂时无法加载文章，请刷新页面后重试。', retry: '重试', opening: '正在打开笔记…',
  },
  life: {
    eyebrow: '书桌之外', title: '生活的片刻', description: '沿途的照片与观察。',
    empty: '暂未发布生活照片。', back: '全部生活记录', unpublished: '这张照片尚未发布。',
  },
  notFound: {
    eyebrow: '404 / 暂时偏离了路线', title: '页面未找到', message: '暂时无法找到这个页面。', browse: '浏览博客',
  },
  metadata: {
    homeTitle: '王玎 · 机器人与具身智能',
    home: '王玎，北京理工大学机器人工程本科生。记录具身智能、机器人操作与强化学习领域的项目、研究和思考。',
    projects: '机器人、信号处理、计算机视觉、预测与决策优化领域的开源项目及工程报告，附原始 PDF。',
    blog: '关于机器人、机器学习的研究笔记、实践教程，以及值得记录的深度阅读。',
  },
};

export const messages = { en, 'zh-CN': zh };
export type Language = keyof typeof messages;
