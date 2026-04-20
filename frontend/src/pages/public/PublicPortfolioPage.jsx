import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { portfolioAPI, companyAPI } from '../../api/services';

function Modal({ onClose, children }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-body" style={{ padding: 0 }}>{children}</div>
            </div>
        </div>
    );
}

const TYPE_LABELS = {
    RESIDENTIAL: 'Residential',
    COMMERCIAL: 'Commercial',
    URBAN_PLANNING: 'Urban Planning',
    INTERIOR: 'Interior',
    LANDSCAPE: 'Landscape',
    INDUSTRIAL: 'Industrial',
    OTHER: 'Architecture',
};

export default function PublicPortfolioPage() {
    const [projects, setProjects] = useState([]);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('');
    const [viewProject, setViewProject] = useState(null);

    useEffect(() => {
        Promise.allSettled([
            portfolioAPI.getAll(),
            companyAPI.get(),
        ]).then(([projRes, compRes]) => {
            const allProjects = projRes.value?.data?.data || [];
            setProjects(allProjects.filter(p => p.status === 'PUBLISHED').sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
            setCompany(compRes.value?.data?.data || null);
        }).finally(() => setLoading(false));
    }, []);

    const types = [...new Set(projects.map(p => p.projectType).filter(Boolean))];
    const filtered = projects.filter(p => !filterType || p.projectType === filterType);

    return (
        <div className="public-page">
            {/* NAV */}
            <nav className="public-nav">
                <Link to="/" className="nav-brand">
                    <span className="brand-mark">◆</span>
                    <span>{company?.companyName || 'ARCVAULT'}</span>
                </Link>
                <div className="nav-links">
                    <Link to="/services">Services</Link>
                    <Link to="/portfolio" style={{ color: 'var(--accent)' }}>Portfolio</Link>
                    <Link to="/contact">Contact</Link>
                </div>
                <Link to="/login" className="nav-cta">Client Portal →</Link>
            </nav>

            {/* HEADER */}
            <section style={{ padding: '8rem 4rem 4rem', borderBottom: '1px solid var(--border)' }}>
                <span className="section-label">Our Work</span>
                <h1 className="hero-title" style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
                    Selected<br /><em>Projects</em>
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', fontSize: '1rem', lineHeight: 1.7 }}>
                    A curated showcase of our architectural work — from intimate residences to landmark commercial developments.
                </p>
            </section>

            {/* FILTERS */}
            {types.length > 1 && (
                <div style={{ padding: '2rem 4rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setFilterType('')}
                        style={{
                            padding: '0.4rem 1rem', borderRadius: 'var(--radius)', border: '1px solid',
                            fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
                            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
                            background: !filterType ? 'var(--accent)' : 'transparent',
                            color: !filterType ? 'var(--bg-base)' : 'var(--text-muted)',
                            borderColor: !filterType ? 'var(--accent)' : 'var(--border)',
                        }}>
                        All
                    </button>
                    {types.map(t => (
                        <button key={t}
                                onClick={() => setFilterType(t)}
                                style={{
                                    padding: '0.4rem 1rem', borderRadius: 'var(--radius)', border: '1px solid',
                                    fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
                                    textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
                                    background: filterType === t ? 'var(--accent)' : 'transparent',
                                    color: filterType === t ? 'var(--bg-base)' : 'var(--text-muted)',
                                    borderColor: filterType === t ? 'var(--accent)' : 'var(--border)',
                                }}>
                            {TYPE_LABELS[t] || t}
                        </button>
                    ))}
                </div>
            )}

            {/* GRID */}
            <section style={{ padding: '4rem' }}>
                {loading ? (
                    <div className="portfolio-grid">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className={`portfolio-card ${i === 0 ? 'portfolio-card-featured' : ''}`}>
                                <div className="portfolio-placeholder" style={{ background: 'var(--bg-elevated)', animation: 'shimmer 1.5s ease-in-out infinite' }} />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>◰</div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, marginBottom: '0.5rem' }}>No projects found</h3>
                        <p>Try selecting a different category</p>
                    </div>
                ) : (
                    <div className="portfolio-grid">
                        {filtered.map((p, i) => (
                            <div
                                key={p.id}
                                className={`portfolio-card ${i === 0 && !filterType ? 'portfolio-card-featured' : ''}`}
                                onClick={() => setViewProject(p)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="portfolio-placeholder">
                                    {p.coverImageUrl ? (
                                        <img src={p.coverImageUrl} alt={p.title}
                                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                             onError={e => e.target.style.display = 'none'} />
                                    ) : (
                                        <div className="portfolio-shape" />
                                    )}
                                </div>
                                <div className="portfolio-info">
                                    <span className="portfolio-type">{TYPE_LABELS[p.projectType] || p.projectType}</span>
                                    <h3>{p.title}</h3>
                                    {p.location && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{p.location}</p>}
                                </div>
                                {p.featured && (
                                    <div style={{
                                        position: 'absolute', top: '1rem', right: '1rem',
                                        background: 'var(--accent)', color: 'var(--bg-base)',
                                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                                        letterSpacing: '0.15em', textTransform: 'uppercase',
                                        padding: '0.2rem 0.6rem', borderRadius: 'var(--radius)',
                                    }}>Featured</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="section cta-section" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="cta-content">
                    <span className="section-label">Start a Project</span>
                    <h2>Inspired by what you see?</h2>
                    <p>Let's create something remarkable together. Schedule a consultation with our team.</p>
                    <div className="cta-actions">
                        <Link to="/consultation" className="btn-primary">Book a Consultation</Link>
                        <Link to="/contact" className="btn-ghost">Get in Touch</Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="public-footer">
                <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    <span className="brand-mark">◆</span>
                    <span>{company?.companyName || 'ARCVAULT'}</span>
                </Link>
                <div className="footer-links">
                    <Link to="/services">Services</Link>
                    <Link to="/portfolio">Portfolio</Link>
                    <Link to="/consultation">Consultation</Link>
                    <Link to="/login">Client Portal</Link>
                </div>
                <p className="footer-copy">© {new Date().getFullYear()} {company?.companyName || 'ArcVault'}. All rights reserved.</p>
            </footer>

            {/* PROJECT DETAIL MODAL */}
            {viewProject && (
                <Modal onClose={() => setViewProject(null)}>
                    <div style={{ position: 'relative' }}>
                        {viewProject.coverImageUrl ? (
                            <div style={{ height: '300px', overflow: 'hidden' }}>
                                <img src={viewProject.coverImageUrl} alt={viewProject.title}
                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                     onError={e => e.target.style.display = 'none'} />
                            </div>
                        ) : (
                            <div style={{ height: '200px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="portfolio-shape" />
                            </div>
                        )}
                        <button onClick={() => setViewProject(null)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>
                            ✕
                        </button>
                    </div>
                    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
              <span className="portfolio-type" style={{ display: 'block', marginBottom: '0.5rem' }}>
                {TYPE_LABELS[viewProject.projectType] || viewProject.projectType}
              </span>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300 }}>{viewProject.title}</h2>
                            {viewProject.location && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>📍 {viewProject.location}</p>
                            )}
                        </div>
                        {viewProject.shortDescription && (
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{viewProject.shortDescription}</p>
                        )}
                        {viewProject.fullDescription && (
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>{viewProject.fullDescription}</p>
                        )}
                        {viewProject.completedAt && (
                            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                                Completed: {new Date(viewProject.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </p>
                        )}
                        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                            <Link to="/consultation" className="btn-primary" onClick={() => setViewProject(null)}>
                                Start a Similar Project →
                            </Link>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}