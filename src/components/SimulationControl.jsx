import React from 'react';
import { calculateRisk } from '../services/simulation';
import { useTranslation } from '../i18n';

export default function SimulationControl({ selectedBlock, cropType, setCropType, sowingArea, setSowingArea, onSimulate }) {
    const { t } = useTranslation();

    const crops = [
        { value: 'paddy', label: 'Paddy (IR-20)' },
        { value: 'groundnut', label: 'Groundnut (TMV-7)' },
        { value: 'sugarcane', label: 'Sugarcane' },
        { value: 'cotton', label: 'Cotton' },
        { value: 'maize', label: 'Maize' },
        { value: 'tomato', label: 'Tomato (Hybrid)' },
        { value: 'turmeric', label: 'Turmeric (High Curcumin)' }
    ];

    // Real-time Risk Assessment
    const risk = calculateRisk(cropType, sowingArea);

    return (
        <div className="card" style={{ borderColor: risk.alertType === 'critical' ? 'var(--color-alert-red)' : 'var(--color-primary-emerald)' }}>
            <div className="card-title cyber-font">{t('simulation_controls')}</div>
            <h3 style={{ margin: '0.5rem 0', color: 'var(--color-primary-emerald)', fontSize: '1rem' }}>
                {selectedBlock
                    ? `${t('node')}: ${selectedBlock.toUpperCase()}`
                    : t('select_district') || "Select Block"}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div>
                    <label className="cyber-font" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t('crop_type')}</label>
                    <select
                        value={cropType}
                        onChange={(e) => setCropType(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-dark)',
                            color: 'var(--color-text-main)'
                        }}
                    >
                        {crops.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                </div>

                <div>
                    <label className="cyber-font" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t('sowing_area')}</label>
                    <input
                        type="number"
                        value={sowingArea}
                        onChange={(e) => setSowingArea(e.target.value)}
                        placeholder="e.g. 50"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-dark)',
                            color: 'var(--color-text-main)'
                        }}
                    />
                </div>

                {/* Instant Risk Feedback */}
                {risk.alertType === 'critical' && (
                    <div style={{
                        padding: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid var(--color-alert-red)',
                        borderRadius: '4px',
                        color: 'var(--color-alert-red)',
                        fontSize: '0.85rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        animation: 'pulse 2s infinite'
                    }}>
                        ⚠️ {t('alert_critical')}: {risk.message}
                    </div>
                )}
            </div>
        </div>
    );
}
