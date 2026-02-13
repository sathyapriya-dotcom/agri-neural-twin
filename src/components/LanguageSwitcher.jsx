import React from 'react';
import { useTranslation } from '../i18n';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation();

    const options = [
        { code: 'en', label: 'English' },
        { code: 'ta', label: 'தமிழ் (Tamil)' },
        { code: 'te', label: 'తెలుగు (Telugu)' },
        { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
        { code: 'ml', label: 'മലയാളം (Malayalam)' },
        { code: 'ur', label: 'اردو (Urdu)' }
    ];

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🌐</span>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="cyber-font"
                style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid var(--color-primary-emerald)',
                    color: 'var(--color-primary-emerald)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    outline: 'none',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}
            >
                {options.map(opt => (
                    <option key={opt.code} value={opt.code} style={{ background: '#1E293B' }}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
