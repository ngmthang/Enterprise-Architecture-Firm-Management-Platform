import { useEffect, useState } from 'react';
import { companyAPI } from '../../api/services';

const emptyForm = {
    companyName: '', tagline: '', shortDescription: '', fullDescription: '',
    email: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', postalCode: '', country: '',
    websiteUrl: '', facebookUrl: '', instagramUrl: '', linkedinUrl: '',
};

export default function CompanyProfilePage() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await companyAPI.get();
                const data = res.data?.data;
                if (data) {
                    setProfile(data);
                    setForm({
                        companyName: data.companyName || '',
                        tagline: data.tagline || '',
                        shortDescription: data.shortDescription || '',
                        fullDescription: data.fullDescription || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        addressLine1: data.addressLine1 || '',
                        addressLine2: data.addressLine2 || '',
                        city: data.city || '',
                        state: data.state || '',
                        postalCode: data.postalCode || '',
                        country: data.country || '',
                        websiteUrl: data.websiteUrl || '',
                        facebookUrl: data.facebookUrl || '',
                        instagramUrl: data.instagramUrl || '',
                        linkedinUrl: data.linkedinUrl || '',
                    });
                    setIsNew(false);
                } else {
                    setIsNew(true);
                }
            } catch (e) {
                setIsNew(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const payload = { ...form };
            Object.keys(payload).forEach(k => {
                if (!payload[k]) delete payload[k];
            });
            if (isNew) {
                await companyAPI.create(payload);
                setIsNew(false);
            } else {
                await companyAPI.update(payload);
            }
            setSuccess('Company profile saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to save company profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="page-header">
                    <h1 className="page-title">Company Profile</h1>
                </div>
                <div className="table-loading">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-row" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Company Profile</h1>
                    <p className="page-subtitle">
                        {isNew ? 'No profile yet — fill in and save to create one' : 'Manage your firm\'s public information'}
                    </p>
                </div>
                <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                    {saving ? 'Saving...' : isNew ? 'Create Profile →' : 'Save Changes →'}
                </button>
            </div>

            {error && (
                <div className="page-error" onClick={() => setError('')}>
                    ⚠ {error} <span style={{ opacity: 0.5 }}>✕</span>
                </div>
            )}

            {success && (
                <div style={{
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                    color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
                    fontSize: '0.85rem', marginBottom: '1.5rem'
                }}>
                    ✓ {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="company-form">
                <div className="company-form-grid">

                    {/* Left column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div className="form-card">
                            <div className="form-card-title">Basic Info</div>
                            <div className="form-field">
                                <label>Company Name *</label>
                                <input name="companyName" value={form.companyName} onChange={handleChange}
                                       placeholder="ArcVault Architecture" required />
                            </div>
                            <div className="form-field">
                                <label>Tagline</label>
                                <input name="tagline" value={form.tagline} onChange={handleChange}
                                       placeholder="Designing spaces that inspire" />
                            </div>
                            <div className="form-field">
                                <label>Short Description</label>
                                <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange}
                                          rows={3} placeholder="Brief company description (shown on public pages)..." maxLength={500} />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {form.shortDescription.length}/500
                </span>
                            </div>
                            <div className="form-field">
                                <label>Full Description</label>
                                <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange}
                                          rows={6} placeholder="Detailed company story and mission..." />
                            </div>
                        </div>

                        <div className="form-card">
                            <div className="form-card-title">Contact</div>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Email</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange}
                                           placeholder="hello@firm.com" />
                                </div>
                                <div className="form-field">
                                    <label>Phone</label>
                                    <input name="phone" value={form.phone} onChange={handleChange}
                                           placeholder="+1 234 567 8900" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div className="form-card">
                            <div className="form-card-title">Address</div>
                            <div className="form-field">
                                <label>Address Line 1</label>
                                <input name="addressLine1" value={form.addressLine1} onChange={handleChange}
                                       placeholder="123 Architecture Ave" />
                            </div>
                            <div className="form-field">
                                <label>Address Line 2</label>
                                <input name="addressLine2" value={form.addressLine2} onChange={handleChange}
                                       placeholder="Suite 400" />
                            </div>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>City</label>
                                    <input name="city" value={form.city} onChange={handleChange} placeholder="New York" />
                                </div>
                                <div className="form-field">
                                    <label>State</label>
                                    <input name="state" value={form.state} onChange={handleChange} placeholder="NY" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Postal Code</label>
                                    <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="10001" />
                                </div>
                                <div className="form-field">
                                    <label>Country</label>
                                    <input name="country" value={form.country} onChange={handleChange} placeholder="United States" />
                                </div>
                            </div>
                        </div>

                        <div className="form-card">
                            <div className="form-card-title">Social & Web</div>
                            <div className="form-field">
                                <label>Website URL</label>
                                <input name="websiteUrl" value={form.websiteUrl} onChange={handleChange}
                                       placeholder="https://www.yourfirm.com" />
                            </div>
                            <div className="form-field">
                                <label>LinkedIn URL</label>
                                <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange}
                                       placeholder="https://linkedin.com/company/yourfirm" />
                            </div>
                            <div className="form-field">
                                <label>Instagram URL</label>
                                <input name="instagramUrl" value={form.instagramUrl} onChange={handleChange}
                                       placeholder="https://instagram.com/yourfirm" />
                            </div>
                            <div className="form-field">
                                <label>Facebook URL</label>
                                <input name="facebookUrl" value={form.facebookUrl} onChange={handleChange}
                                       placeholder="https://facebook.com/yourfirm" />
                            </div>
                        </div>

                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : isNew ? 'Create Profile →' : 'Save Changes →'}
                    </button>
                </div>
            </form>
        </div>
    );
}