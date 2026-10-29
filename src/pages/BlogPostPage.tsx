import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPost } from '../services/mockData';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import '../styles/pages/blog.css';

interface BlogPostPageProps {
  onOpenConsultation: () => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ onOpenConsultation }) => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) {
      api.getBlogBySlug(slug).then((data) => setPost(data || null));
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="container" style={{ padding: '160px 0', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <Link to="/journal" className="btn btn-primary btn-md" style={{ marginTop: '1.5rem' }}>
          Return to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="blog-detail-page">
      <div className="container">
        <header className="article-header">
          <Link to="/journal" className="btn-link flex-align gap-1" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            <ArrowLeft size={16} />
            <span>Return to Journal</span>
          </Link>
          <span className="eyebrow">{post.category}</span>
          <h1 style={{ marginBottom: '1rem' }}>{post.title}</h1>
          <div className="flex-center" style={{ gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            <span className="flex-align gap-1"><User size={15} /> {post.author}</span>
            <span>·</span>
            <span className="flex-align gap-1"><Calendar size={15} /> {post.date}</span>
            <span>·</span>
            <span className="flex-align gap-1"><Clock size={15} /> {post.readTime}</span>
          </div>
        </header>

        <div style={{ maxWidth: '960px', margin: '0 auto 3rem auto', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{ width: '100%', maxHeight: '520px', objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="article-body">
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', fontStyle: 'italic', marginBottom: '2rem' }}>
            {post.excerpt}
          </p>
          <p>{post.content}</p>
          <p>
            When designing spaces for longevity, we find that the most tactile surfaces—unpolished lime plaster, wire-brushed European oak, hand-quarried travertine—absorb ambient noise and diffuse natural light in ways synthetic materials simply cannot replicate.
          </p>
          <p>
            Furthermore, understanding the biological resonance between light temperature and human melatonin secretion allows us to banish harsh 4000K commercial downlights in favor of concealed 2700K warm wash ribbons that mirror the warmth of dusk.
          </p>
          
          <div style={{ padding: '2rem', backgroundColor: 'var(--color-canvas-subtle)', borderRadius: '4px', marginTop: '3rem', border: '1px solid var(--color-border)' }}>
            <h4>Discuss Your Architectural Vision</h4>
            <p className="body-secondary" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              Have questions regarding material selection or space planning for your upcoming residence?
            </p>
            <button onClick={onOpenConsultation} className="btn btn-primary btn-md">
              Book Free Discovery Consultation
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
