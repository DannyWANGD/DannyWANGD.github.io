import React, { useEffect, useState } from 'react';
import BlogPostCard, { BlogPost } from '../components/BlogPostCard';
import { parseMarkdownPost } from '../utils/markdownPost';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    
    const loadedPosts: BlogPost[] = Object.entries(modules).map(([path, content]) => {
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      const { metadata, excerpt } = parseMarkdownPost(content, slug);

      return {
        slug,
        title: metadata.title,
        date: metadata.date,
        excerpt,
        tags: metadata.tags
      };
    });

    loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setPosts(loadedPosts);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto px-4 md:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-600 max-w-2xl">
          Thoughts, updates, and tutorials about my research and projects.
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
