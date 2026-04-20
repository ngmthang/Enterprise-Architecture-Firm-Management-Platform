import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI, companyAPI } from '../../api/services';

const FALLBACK_SERVICES = [
    { id: 1, name: 'Architectural Design', icon: '◈', shortDescription: 'From concept to blueprint — we craft spaces that inspire and endure. Our design process blends aesthetics with structural integrity.' },
    { id: 2, name: 'Urban Planning', icon: '◎', shortDescription: 'Large-scale development with community-first thinking. We create master plans that shape cities for generations.' },
    { id: 3, name: 'Interior Architecture', icon: '◱', shortDescription: 'Functional beauty in every square meter. We design interiors that elevate the human experience within a space.' },
    { id: 4, name: 'Project Management', icon: '◐', shortDescription: 'On-time, on-budget delivery with full transparency. We manage every phase from groundbreaking to handover.' },
    { id: 5, name: 'Landscape Design', icon: '◇', shortDescription: 'Outdoor spaces that complement and extend the architectural vision, creating seamless indoor-outdoor flow.' },
    { id: 6, name: 'Sustainability Consulting', icon: '◉', shortDescription: 'Building for the future with energy-efficient design, sustainable materials, and environmental responsibility.' },
];

export default function PublicServicesPage() {
    const [services, setServices] = useState([]);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeService, setActiveService] = useState(null);

    useEffect(() => {
        Promise.allSettled([
            servicesAPI.getAll(),
            companyAPI.get(),
        ]).then(([svcRes, compRes]) => {
            const allServices = svcRes.value?.data?.data || [];
            const active = allServices.filter(s => s.active).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
            setServices(active.length > 0 ? active : FALLBACK_SERVICES);
            setCompany(compRes.value?.data?.data || null);
        }).finally(() => setLoading(false));
    }, []);

    const displayServices = loading ? FALLBACK_SERVICES : services;

    return (
        <div className="public-page">
            {/* NAV */}
            <nav className="public-nav">
                <Link to="/" className="nav-brand">
                    <span className="brand-mark">◆</span>
                    <span>{company?.companyName || 'ARCVAULT'}</span>
                </Link>
                <div className="nav-links">
                    <Link to="/services" style={{ color: 'var(--accent)' }}>Services</Link>
                    <Link to="/portfolio">Portfolio</Link>
                    <Link to="/contact">Contact</Link>
                </div>
                <Link to="/login" className="nav-cta">Client Portal →</Link>
            </nav>

            {/* HEADER */}
            <section style={{ padding: '8rem 4rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'end', borderBottom: '1px solid var(--border)' }}>
                <div>
                    <span className="section-label">What We Do</span>
                    <h1 className="hero-title" style={{ marginTop: '0.75rem' }}>
                        Our<br /><em>Services</em>
                    </h1>
                </div>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                        From initial concept through to completion, we offer a comprehensive range of architectural and design services tailored to your vision.
                    </p>
                    <Link to="/consultation" className="btn-primary">Book a Consultation →</Link>
                </div>
            </section>

            {/* SERVICES LIST */}
            <section style={{ padding: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5px', background: 'var(--border)' }}>
                    {displayServices.map((s, i) => (
                        <div
                            key={s.id}
                            className="service-card"
                            style={{
                                cursor: 'pointer',
                                background: activeService?.id === s.id ? 'var(--accent-dim)' : 'var(--bg-base)',
                                borderLeft: activeService?.id === s.id ? '3px solid var(--accent)' : '3px solid transparent',
                                transition: 'all 0.2s',
                            }}
                            onClick={() => setActiveService(activeService?.id === s.id ? null : s)}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div className="service-num">0{i + 1}</div>
                                {s.icon && <div style={{ fontSize: '1.5rem', color: 'var(--accent)', opacity: 0.6 }}>{s.icon}</div>}
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.75rem' }}>
                                {s.name}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                {s.shortDescription}
                            </p>
                            {activeService?.id === s.id && s.fullDescription && (
                                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-accent)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                    {s.fullDescription}
                                </div>
                            )}
                            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                                {activeService?.id === s.id ? '− Less' : '+ Learn more'}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROCESS */}
            <section className="section section-dark" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="section-header">
                    <span className="section-label">How We Work</span>
                    <h2 className="section-title">Our Process</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                    {[
                        { num: '01', title: 'Discovery', desc: 'We begin with deep listening — understanding your vision, constraints, and aspirations.' },
                        { num: '02', title: 'Concept', desc: 'Our architects develop creative concepts that balance beauty, function, and budget.' },
                        { num: '03', title: 'Design', desc: 'Detailed drawings, 3D models, and specifications bring the concept to life.' },
                        { num: '04', title: 'Delivery', desc: 'We oversee construction, ensuring quality and fidelity to the design vision.' },
                    ].map(step => (
                        <div key={step.num} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.2em' }}>{step.num}</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400 }}>{step.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="cta-content">
                    <span className="section-label">Get Started</span>
                    <h2>Ready to begin your project?</h2>
                    <p>Schedule a free consultation and let's explore what's possible together.</p>
                    <div className="cta-actions">
                        <Link to="/consultation" className="btn-primary">Book a Consultation</Link>
                        <Link to="/portfolio" className="btn-ghost">View Our Work</Link>
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
        </div>
    );
}