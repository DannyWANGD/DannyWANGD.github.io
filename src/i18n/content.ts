import postTranslations from '../data/post-translations.json';
import type { Language } from './messages';
import type { PostSummary } from '../utils/markdownPost';
import type { Project } from '../components/ProjectCard';

const chineseTerms: Record<string, string> = {
  'Deep Learning': '深度学习', 'Generative Models': '生成模型', 'Deep Reading': '深度阅读',
  Attention: '注意力', 'Behavior Design': '行为设计', 'AI Memory': 'AI 记忆', Learning: '学习',
  'Technology Strategy': '技术战略', Agents: '智能体', 'Token Economics': 'Token 经济',
  Skills: '技能', 'Local Models': '本地模型', 'Loss Function': '损失函数', Mathematics: '数学',
  'Best Practices': '最佳实践', Diffusion: '扩散模型', 'Score Matching': '分数匹配',
  'Flow Matching': '流匹配',
};

export function translateTerm(term: string, language: Language) {
  return language === 'zh-CN' ? chineseTerms[term] || term : term === '梁文锋' ? 'Liang Wenfeng' : term;
}

export function localizePost(post: PostSummary, language: Language): PostSummary {
  const translation = (postTranslations as Record<string, Partial<PostSummary>>)[post.slug];
  return {
    ...post, ...(language === 'en' ? translation : {}),
    category: translateTerm(post.category, language),
    tags: post.tags.map(tag => translateTerm(tag, language)),
  };
}

export function localizeProject(project: Project, language: Language): Project {
  const translation = project.translations?.[language];
  return {
    ...project, ...translation, language,
    links: project.links?.map((link, index) => ({ ...link, label: translation?.linkLabels?.[index] || link.label })),
  };
}
