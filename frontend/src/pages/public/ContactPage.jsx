import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactAPI, companyAPI } from '../../api/services';

const emptyForm = {
    fullName: '', email: '', phone: '', subject: '', message: '',
};

export default function ContactPage() {
    const [company, setCompany] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        companyAPI.get().then(r => setCompany(r.data?.data || null)).catch(() => {});
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = { ...form };
            if (!payload.phone) delete payload.phone;
            await contactAPI.create(payload);
            setSuccess(true);
            setForm(emptyForm);
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                    <Link to="/portfolio">Portfolio</Link>
                    <Link to="/contact" style={{ color: 'var(--accent)' }}>Contact</Link>
                </div>
                <Link to="/login" className="nav-cta">Client Portal →</Link>
            </nav>

            {/* MAIN */}
            <section style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1.4fr', alignItems: 'start', padding: '8rem 4rem 4rem', gap: '6rem' }}>

                {/* LEFT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '8rem' }}>
                    <div>
                        <span className="section-label">Get in Touch</span>
                        <h1 className="hero-title" style={{ marginTop: '0.75rem', fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>
                            Let's Start a<br /><em>Conversation</em>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1rem' }}>
                            Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you within 24 hours.
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {company?.email && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>Email</span>
                                <a href={`mailto:${company.email}`}
                                   style={{ color: 'var(--text-primary)', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                   onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                                   onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}>
                                    {company.email}
                                </a>
                            </div>
                        )}
                        {company?.phone && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>Phone</span>
                                <a href={`tel:${company.phone}`}
                                   style={{ color: 'var(--text-primary)', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                   onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                                   onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}>
                                    {company.phone}
                                </a>
                            </div>
                        )}
                        {(company?.addressLine1 || company?.city) && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>Office</span>
                                <address style={{ fontStyle: 'normal', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {company.addressLine1 && <span>{company.addressLine1}<br /></span>}
                                    {company.addressLine2 && <span>{company.addressLine2}<br /></span>}
                                    {company.city && <span>{company.city}{company.state ? `, ${company.state}` : ''}{company.postalCode ? ` ${company.postalCode}` : ''}<br /></span>}
                                    {company.country && <span>{company.country}</span>}
                                </address>
                            </div>
                        )}
                    </div>

                    {/* Social Links */}
                    {(company?.linkedinUrl || company?.instagramUrl || company?.facebookUrl) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>Follow Us</span>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {company.linkedinUrl && (
                                    <a href={company.linkedinUrl} target="_blank" rel="noreferrer"
                                       style={{ color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                       onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                                       onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                                        LinkedIn →
                                    </a>
                                )}
                                {company.instagramUrl && (
                                    <a href={company.instagramUrl} target="_blank" rel="noreferrer"
                                       style={{ color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                       onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                                       onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                                        Instagram →
                                    </a>
                                )}
                                {company.facebookUrl && (
                                    <a href={company.facebookUrl} target="_blank" rel="noreferrer"
                                       style={{ color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                       onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                                       onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                                        Facebook →
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Consultation CTA */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
                            Prefer a call?
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                            Book a free 30-minute consultation with one of our architects.
                        </p>
                        <Link to="/consultation" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.65rem 1.5rem' }}>
                            Schedule Consultation →
                        </Link>
                    </div>
                </div>

                {/* RIGHT — FORM */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '2.5rem' }}>
                    {success ? (
                        <div className="success-page" style={{ minHeight: 'auto', padding: '3rem 1rem' }}>
                            <div className="success-icon">✓</div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300 }}>Message Sent!</h2>
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '320px' }}>
                                Thank you for reaching out. We'll get back to you within 24 hours.
                            </p>
                            <button className="btn-ghost" onClick={() => setSuccess(false)} style={{ marginTop: '1rem' }}>
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 300, marginBottom: '0.5rem' }}>
                                Send a Message
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                                We respond to all inquiries within 24 hours.
                            </p>

                            {error && (
                                <div className="form-error" style={{ marginBottom: '1.5rem' }}>⚠ {error}</div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Full Name *</label>
                                        <input name="fullName" value={form.fullName} onChange={handleChange}
                                               placeholder="John Smith" required />
                                    </div>
                                    <div className="form-field">
                                        <label>Email *</label>
                                        <input name="email" type="email" value={form.email} onChange={handleChange}
                                               placeholder="john@example.com" required />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Phone</label>
                                    <input name="phone" value={form.phone} onChange={handleChange}
                                           placeholder="+1 234 567 8900" />
                                </div>
                                <div className="form-field">
                                    <label>Subject *</label>
                                    <input name="subject" value={form.subject} onChange={handleChange}
                                           placeholder="e.g. New residential project inquiry" required />
                                </div>
                                <div className="form-field">
                                    <label>Message *</label>
                                    <textarea name="message" value={form.message} onChange={handleChange}
                                              rows={6} placeholder="Tell us about your project or inquiry..."
                                              required style={{ resize: 'vertical' }} />
                                </div>
                                <button type="submit" className="btn-primary btn-full" disabled={loading}
                                        style={{ marginTop: '0.5rem' }}>
                                    {loading ? (
                                        <span className="btn-loading">
                      <span className="spinner" />
                      Sending...
                    </span>
                                    ) : 'Send Message →'}
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    By submitting, you agree to our privacy policy. We never share your information.
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="public-footer" style={{ borderTop: '1px solid var(--border)' }}>
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