import { useState } from 'react';
import { Link } from 'react-router-dom';
import { consultationsAPI } from '../../api/services';

export default function ConsultationPage() {
  const [form, setForm] = useState({
    clientName: '', email: '', phone: '', projectType: '',
    budget: '', preferredDate: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await consultationsAPI.create(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="public-page">
        <nav className="public-nav">
          <Link to="/" className="nav-brand"><span className="brand-mark">◆</span><span>ARCVAULT</span></Link>
        </nav>
        <div className="success-page">
          <div className="success-icon">◆</div>
          <h1>Request Received</h1>
          <p>Thank you for reaching out. Our team will contact you within 24 hours to confirm your consultation.</p>
          <Link to="/" className="btn-primary">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="public-page">
      <nav className="public-nav">
        <Link to="/" className="nav-brand"><span className="brand-mark">◆</span><span>ARCVAULT</span></Link>
        <Link to="/login" className="nav-cta">Client Portal →</Link>
      </nav>

      <section className="consultation-section">
        <div className="consultation-left">
          <span className="section-label">Get Started</span>
          <h1>Book a<br />Consultation</h1>
          <p>Tell us about your project and we'll match you with the right team. All consultations begin with a complimentary discovery session.</p>
          <div className="consultation-steps">
            <div className="step"><span className="step-num">01</span><span>Submit your request</span></div>
            <div className="step"><span className="step-num">02</span><span>We review & confirm</span></div>
            <div className="step"><span className="step-num">03</span><span>Discovery session</span></div>
            <div className="step"><span className="step-num">04</span><span>Proposal & timeline</span></div>
          </div>
        </div>

        <div className="consultation-right">
          <form onSubmit={handleSubmit} className="consultation-form">
            {error && <div className="form-error">⚠ {error}</div>}

            <div className="form-row">
              <div className="form-field">
                <label>Full Name *</label>
                <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="John Smith" required />
              </div>
              <div className="form-field">
                <label>Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
              </div>
              <div className="form-field">
                <label>Project Type *</label>
                <select name="projectType" value={form.projectType} onChange={handleChange} required>
                  <option value="">Select type...</option>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="URBAN_PLANNING">Urban Planning</option>
                  <option value="INTERIOR">Interior Architecture</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Budget Range</label>
                <select name="budget" value={form.budget} onChange={handleChange}>
                  <option value="">Select range...</option>
                  <option value="UNDER_50K">Under $50K</option>
                  <option value="50K_200K">$50K – $200K</option>
                  <option value="200K_1M">$200K – $1M</option>
                  <option value="OVER_1M">Over $1M</option>
                </select>
              </div>
              <div className="form-field">
                <label>Preferred Date</label>
                <input name="preferredDate" type="date" value={form.preferredDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div className="form-field">
              <label>Project Description *</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your project, goals, and any specific requirements..." rows={5} required />
            </div>

            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Consultation Request →'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
