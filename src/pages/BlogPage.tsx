import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPost } from '../services/mockData';
import { ArrowRight } from 'lucide-react';
import '../styles/pages/blog.css';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Philosophy & Materials', 'Design Intelligence', 'Guides & Budgets'];

  useEffect(() => {
    api.getBlogs().then(setPosts);
  }, []);

  const filtered = selectedCategory === 'All'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <div className="section-header text-left" style={{ marginBottom: '1.5rem' }}>
            <span className="eyebrow">Editorial Journal</span>
            <h1>Architectural Gazette &amp; Material Notes</h1>
            <p className="body-text" style={{ maxWidth: '680px' }}>
              Reflections from our studio desks on acoustic materials, circadian light choreography, bespoke joinery, and turnkey project budgets.
            </p>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="blog-grid">
            {filtered.map((post) => (
              <article key={post.id} className="blog-post-card">
                <div className="blog-media">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3>
                    <Link to={`/journal/${post.slug}`} style={{ color: 'inherit' }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p>{post.excerpt}</p>
                  <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <span className="caption" style={{ fontWeight: 600 }}>By {post.author}</span>
                    <Link to={`/journal/${post.slug}`} className="btn-link flex-align gap-1" style={{ fontSize: '0.8125rem' }}>
                      <span>Read Article</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
