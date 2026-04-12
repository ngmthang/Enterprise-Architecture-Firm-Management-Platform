import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI, portfolioAPI, companyAPI } from '../../api/services';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    servicesAPI.getAll().then(r => setServices(r.data?.data || [])).catch(() => {});
    portfolioAPI.getAll().then(r => setPortfolio(r.data?.data || [])).catch(() => {});
    companyAPI.get().then(r => setCompany(r.data?.data)).catch(() => {});
  }, []);

  return (
    <div className="public-page">
      {/* NAV */}
      <nav className="public-nav">
        <div className="nav-brand">
          <span className="brand-mark">◆</span>
          <span>{company?.name || 'ARCVAULT'}</span>
        </div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <Link to="/login" className="nav-cta">Client Portal →</Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">Enterprise Architecture Firm</div>
          <h1 className="hero-title">
            We Design<br />
            <em>The Space</em><br />
            Between Vision<br />& Structure
          </h1>
          <p className="hero-desc">
            {company?.description || 'Transforming ambitious ideas into architectural masterpieces. We blend precision engineering with visionary design.'}
          </p>
          <div className="hero-actions">
            <Link to="/consultation" className="btn-primary">Request Consultation</Link>
            <a href="#portfolio" className="btn-ghost">View Portfolio ↓</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`hero-cell ${i === 4 ? 'hero-cell-accent' : ''}`} />
            ))}
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">150+</span>
              <span className="hero-stat-label">Projects Delivered</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">20+</span>
              <span className="hero-stat-label">Years Experience</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">98%</span>
              <span className="hero-stat-label">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="section-header">
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Our Services</h2>
        </div>
        <div className="services-grid">
          {services.length === 0 ? (
            [
              { title: 'Architectural Design', desc: 'From concept to blueprint — we craft spaces that inspire.' },
              { title: 'Urban Planning', desc: 'Large-scale development with community-first thinking.' },
              { title: 'Interior Architecture', desc: 'Functional beauty in every square meter.' },
              { title: 'Project Management', desc: 'On-time, on-budget delivery with full transparency.' },
            ].map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-num">0{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))
          ) : (
            services.map((s, i) => (
              <div key={s.id} className="service-card">
                <div className="service-num">0{i + 1}</div>
                <h3>{s.name || s.title}</h3>
                <p>{s.description}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="section section-dark" id="portfolio">
        <div className="section-header">
          <span className="section-label">Our Work</span>
          <h2 className="section-title">Selected Projects</h2>
        </div>
        <div className="portfolio-grid">
          {portfolio.length === 0 ? (
            ['The Meridian Tower', 'Riverside Cultural Center', 'The Pavilion', 'Urban Nexus Hub'].map((name, i) => (
              <div key={i} className={`portfolio-card ${i === 0 ? 'portfolio-card-featured' : ''}`}>
                <div className="portfolio-placeholder">
                  <div className="portfolio-shape" />
                </div>
                <div className="portfolio-info">
                  <span className="portfolio-type">Architecture</span>
                  <h3>{name}</h3>
                </div>
              </div>
            ))
          ) : (
            portfolio.slice(0, 6).map((p, i) => (
              <div key={p.id} className={`portfolio-card ${i === 0 ? 'portfolio-card-featured' : ''}`}>
                <div className="portfolio-placeholder">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} />
                  ) : (
                    <div className="portfolio-shape" />
                  )}
                </div>
                <div className="portfolio-info">
                  <span className="portfolio-type">{p.category || 'Architecture'}</span>
                  <h3>{p.title || p.name}</h3>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section" id="contact">
        <div className="cta-content">
          <span className="section-label">Start a Project</span>
          <h2>Ready to build something remarkable?</h2>
          <p>Let's discuss your vision. Our team is ready to transform your ideas into architectural reality.</p>
          <div className="cta-actions">
            <Link to="/consultation" className="btn-primary">Book a Consultation</Link>
            <Link to="/contact" className="btn-ghost">Send a Message</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="public-footer">
        <div className="footer-brand">
          <span className="brand-mark">◆</span>
          <span>{company?.name || 'ARCVAULT'}</span>
        </div>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <Link to="/consultation">Consultation</Link>
          <Link to="/login">Client Portal</Link>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} {company?.name || 'ArcVault'}. All rights reserved.</p>
      </footer>
    </div>
  );
}
