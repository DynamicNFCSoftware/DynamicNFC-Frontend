import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import SEO from '../../components/SEO/SEO';
import { useLanguage } from '../../i18n';
import { BLOG_TR as TR } from './blogTranslations';
import './Blog.css';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { lang } = useLanguage();
  const t = (k) => TR[lang]?.[k] ?? TR.en[k] ?? k;

  useEffect(() => {
    getDocs(query(collection(db, 'blog_posts'), orderBy('publishedAt', 'desc')))
      .then(snap => {
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.status === 'published'));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(posts.map(p => p.category).filter(Boolean))];
  const filtered = filter === 'all' ? posts : posts.filter(p => p.category === filter);

  return (
    <div className="bl-page">
      <SEO
        title={t('seoTitle')}
        description={t('seoDesc')}
      />

      <section className="bl-hero">
        <h1 className="bl-title">{t('title')}</h1>
        <p className="bl-subtitle">{t('subtitle')}</p>
      </section>

      {categories.length > 1 && (
        <div className="bl-filters">
          {categories.map(c => (
            <button key={c} className={`bl-filter${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>
              {c === 'all' ? t('all') : c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="bl-loading"><div className="bl-spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="bl-empty">
          <p>{t('empty')}</p>
        </div>
      ) : (
        <div className="bl-grid">
          {filtered.map(post => (
            <Link to={`/blog/${post.slug || post.id}`} key={post.id} className="bl-card">
              {post.coverImage && (
                <div className="bl-card-img" style={{ backgroundImage: `url(${post.coverImage})` }} />
              )}
              <div className="bl-card-body">
                {post.category && <span className="bl-card-cat">{post.category}</span>}
                <h2 className="bl-card-title">{post.title}</h2>
                <p className="bl-card-excerpt">{post.excerpt}</p>
                <div className="bl-card-meta">
                  <span>{post.author || 'DynamicNFC'}</span>
                  <span>{post.publishedAt?.toDate ? post.publishedAt.toDate().toLocaleDateString(t('dateLocale'), { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
