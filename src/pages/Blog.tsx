import React, { useEffect, useState } from 'react';
import BlogPostCard, { BlogPost } from '../components/BlogPostCard';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Dynamically import all markdown files from posts directory
    const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    
    const loadedPosts: BlogPost[] = Object.entries(modules).map(([path, content]) => {
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      
      // Simple frontmatter parser (assuming --- separators)
      const frontmatterRegex = /---\n([\s\S]*?)\n---/;
      const match = content.match(frontmatterRegex);
      
      let title = 'Untitled';
      let date = '';
      let excerpt = '';
      let tags: string[] = [];
      
      if (match) {
        const frontmatter = match[1];
        const lines = frontmatter.split('\n');
        lines.forEach(line => {
          if (line.startsWith('title:')) title = line.replace('title:', '').trim().replace(/^["']|["']$/g, '');
          if (line.startsWith('date:')) date = line.replace('date:', '').trim().replace(/^["']|["']$/g, '');
          if (line.startsWith('tags:')) {
            const tagsStr = line.replace('tags:', '').trim();
            try {
              tags = JSON.parse(tagsStr); // Handle ["tag1", "tag2"] format if possible
            } catch {
                // Fallback for simpler format like [tag1, tag2]
                tags = tagsStr.replace(/^\[|\]$/g, '').split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
            }
          }
        });
        
        // Generate excerpt from content after frontmatter
        const contentBody = content.replace(frontmatterRegex, '').trim();
        excerpt = contentBody.substring(0, 150) + '...';
      }

      return {
        slug,
        title,
        date,
        excerpt,
        tags
      };
    });

    // Sort by date desc
    loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setPosts(loadedPosts);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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