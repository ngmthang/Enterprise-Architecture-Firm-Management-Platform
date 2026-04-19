import { useEffect, useState } from 'react';
import { teamAPI } from '../../api/services';

function Modal({ title, onClose, children }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}

function MemberDetail({ member }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                {member.profileImageUrl ? (
                    <img src={member.profileImageUrl} alt={member.fullName}
                         style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-accent)' }}
                         onError={e => e.target.style.display = 'none'} />
                ) : (
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--accent)', fontWeight: 600 }}>
                        {member.fullName?.charAt(0)}
                    </div>
                )}
                <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400 }}>{member.fullName}</div>
                    <div style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{member.jobTitle}</div>
                </div>
            </div>
            <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{member.email || '—'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{member.phone || '—'}</span>
                </div>
                {member.linkedinUrl && (
                    <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                        <span className="detail-label">LinkedIn</span>
                        <a href={member.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>View Profile →</a>
                    </div>
                )}
            </div>
            {member.shortBio && (
                <div className="detail-item">
                    <span className="detail-label">About</span>
                    <p className="detail-text">{member.shortBio}</p>
                </div>
            )}
        </div>
    );
}

export default function ArchitectTeamPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [viewMember, setViewMember] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const res = await teamAPI.getAll();
                setMembers(res.data?.data || []);
            } catch (e) {
                setError('Failed to load team members');
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const filtered = members.filter(m =>
        !search ||
        m.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        m.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Team Members</h1>
                    <p className="page-subtitle">{members.filter(m => m.active).length} active members</p>
                </div>
            </div>

            {error && <div className="page-error" onClick={() => setError('')}>⚠ {error} <span style={{ opacity: 0.5 }}>✕</span></div>}

            <div className="page-filters">
                <input className="filter-search" placeholder="Search by name, title, or email..."
                       value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div className="team-cards-grid">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-card" style={{ height: '160px' }} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="table-empty-state">
                    <div className="empty-icon">◯</div>
                    <h3>No team members found</h3>
                    <p>{search ? 'Try adjusting your search' : 'No team members yet'}</p>
                </div>
            ) : (
                <div className="team-cards-grid">
                    {filtered.filter(m => m.active).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map(m => (
                        <div key={m.id} className="team-card" onClick={() => setViewMember(m)}>
                            <div className="team-card-avatar">
                                {m.profileImageUrl ? (
                                    <img src={m.profileImageUrl} alt={m.fullName} onError={e => e.target.style.display = 'none'} />
                                ) : (
                                    <div className="team-card-initials">{m.fullName?.charAt(0)}</div>
                                )}
                                {m.featured && <div className="team-card-featured">★</div>}
                            </div>
                            <div className="team-card-info">
                                <div className="team-card-name">{m.fullName}</div>
                                <div className="team-card-title">{m.jobTitle}</div>
                                {m.email && <div className="team-card-email">{m.email}</div>}
                            </div>
                            {m.linkedinUrl && (
                                <a href={m.linkedinUrl} target="_blank" rel="noreferrer"
                                   className="team-card-linkedin" onClick={e => e.stopPropagation()} title="LinkedIn">in</a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {viewMember && (
                <Modal title="Team Member" onClose={() => setViewMember(null)}>
                    <MemberDetail member={viewMember} />
                </Modal>
            )}
        </div>
    );
}