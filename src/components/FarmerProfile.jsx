import React, { useState, useEffect } from 'react';
import { AgriStackService } from '../services/AgriStack';
import { useTranslation } from '../i18n';
import '../styles/Dashboard.css';

export default function FarmerProfile({ farmerId }) {
    const { t } = useTranslation();
    const [profile, setProfile] = useState(null);
    const [intent, setIntent] = useState({ crop: 'Tomato', area: 2.5 });
    const [updating, setUpdating] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        AgriStackService.getFarmerProfile(farmerId).then(data => {
            setProfile(data);
            setIntent(data.currentIntent);
        });
    }, [farmerId]);

    const handleUpdate = () => {
        setUpdating(true);
        AgriStackService.updateSowingIntent(profile.id, intent.crop, intent.area).then(() => {
            setUpdating(false);
            setSuccessMsg("Simulation Engine Updated: Risk Assessment Recalculating...");
            setTimeout(() => setSuccessMsg(''), 5000);
        });
    };

    if (!profile) return <div className="cyber-font" style={{ padding: '2rem', color: '#94a3b8' }}>{t('loading')}</div>;

    return (
        <div style={{ padding: '2rem', color: '#fff', maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="cyber-font" style={{ color: '#10B981', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                {t('farmer_profile')} // {profile.name}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                {/* Basic Info */}
                <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div className="cyber-font" style={{ marginBottom: '1rem', color: '#60A5FA' }}>AGRI-STACK ID: {profile.id}</div>
                    <div style={{ marginBottom: '0.5rem' }}><span style={{ color: '#94a3b8' }}>Survey No:</span> {profile.surveyNo}</div>
                    <div style={{ marginBottom: '0.5rem' }}><span style={{ color: '#94a3b8' }}>Total Land:</span> {profile.totalLand} Acres</div>
                </div>

                {/* Sowing Intent Form */}
                <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', border: '1px solid #10B981' }}>
                    <div className="cyber-font" style={{ marginBottom: '1rem', color: '#10B981' }}>UPCOMING SEASON INTENT</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>{t('crop_type')}</label>
                            <select
                                value={intent.crop}
                                onChange={(e) => setIntent({ ...intent, crop: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }}
                            >
                                {['Tomato', 'Paddy', 'Turmeric', 'Sugarcane', 'Groundnut', 'Cotton'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>{t('sowing_area')}</label>
                            <input
                                type="number"
                                value={intent.area}
                                onChange={(e) => setIntent({ ...intent, area: parseFloat(e.target.value) })}
                                style={{ width: '100%', padding: '0.5rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }}
                            />
                        </div>

                        <button
                            onClick={handleUpdate}
                            disabled={updating}
                            className="cyber-btn"
                            style={{
                                marginTop: '1rem',
                                background: updating ? '#334155' : '#10B981',
                                color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            {updating ? 'SYNCING...' : 'UPDATE SIMULATION ENGINE'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {successMsg && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#10B981', borderRadius: '4px' }}>
                    ✅ {successMsg}
                </div>
            )}

            {/* Historical Data */}
            <div style={{ marginTop: '2rem' }}>
                <h3 className="cyber-font" style={{ color: '#F59E0B', marginBottom: '1rem' }}>SOWING HISTORY</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: '#334155', color: '#cbd5e1' }}>
                            <th style={{ padding: '0.8rem', textAlign: 'left' }}>Year</th>
                            <th style={{ padding: '0.8rem', textAlign: 'left' }}>Season</th>
                            <th style={{ padding: '0.8rem', textAlign: 'left' }}>Crop</th>
                            <th style={{ padding: '0.8rem', textAlign: 'left' }}>Yield</th>
                            <th style={{ padding: '0.8rem', textAlign: 'left' }}>Income</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profile.sowingHistory.map((h, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #334155', color: '#e2e8f0' }}>
                                <td style={{ padding: '0.8rem' }}>{h.year}</td>
                                <td style={{ padding: '0.8rem' }}>{h.season}</td>
                                <td style={{ padding: '0.8rem' }}>{h.crop}</td>
                                <td style={{ padding: '0.8rem' }}>{h.yield}</td>
                                <td style={{ padding: '0.8rem', color: '#10B981' }}>{h.income}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
