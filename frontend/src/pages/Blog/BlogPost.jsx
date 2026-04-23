import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import DOMPurify from 'dompurify';
import { db } from '../../firebase';
import SEO from '../../components/SEO/SEO';
import './Blog.css';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        // Try by slug first
        const q = query(collection(db, 'blog_posts'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setPost({ id: snap.docs[0].id, ...snap.docs[0].data() });
        } else {
          // Fallback: try by document ID
          const docSnap = await getDoc(doc(db, 'blog_posts', slug));
          if (docSnap.exists()) setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetch();
  }, [slug]);

  if (loading) return <div className="bl-page"><div className="bl-loading"><div className="bl-spinner" /></div></div>;
  if (!post) return (
    <div className="bl-page">
      <div className="bl-empty">
        <p>Article not found.</p>
        <Link to="/blog" style={{ color: '#e63946', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>Back to Blog</Link>
      </div>
    </div>
  );

  return (
    <div className="bl-page">
      <SEO title={`${post.title} — DynamicNFC Blog`} description={post.excerpt || ''} />
      <article className="bp-article">
        <Link to="/blog" className="bp-back">Back to Blog</Link>
        {post.category && <span className="bl-card-cat">{post.category}</span>}
        <h1 className="bp-title">{post.title}</h1>
        <div className="bp-meta">
          <span>{post.author || 'DynamicNFC'}</span>
          <span>{post.publishedAt?.toDate ? post.publishedAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
          {post.readTime && <span>{post.readTime} min read</span>}
        </div>
        {post.coverImage && <img src={post.coverImage} alt="" className="bp-cover" />}
        <div className="bp-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
      </article>
    </div>
  );
}
