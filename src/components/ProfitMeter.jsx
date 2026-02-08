import React from 'react';
import '../styles/Dashboard.css';
import { useTranslation } from '../i18n';

export default function ProfitMeter({ profitability, isSafe, message }) {
    const { t } = useTranslation();

    // Calculate arc length for gauge fill
    const arcLength = (profitability / 100) * 251;

    // Color logic
    const color = isSafe ? '#10B981' : (profitability < 40 ? '#EF4444' : '#3B82F6');

    return (
        <div className={`card ${isSafe ? 'profit-glow' : ''}`} style={{ transition: 'all 0.5s', position: 'relative', overflow: 'hidden' }}>

            {/* Background Grid Effect */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                pointerEvents: 'none'
            }}></div>

            <div className="card-title cyber-font" style={{ zIndex: 2, position: 'relative' }}>{t('profitability')}</div>

            <div style={{ position: 'relative', height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginTop: '0.5rem', zIndex: 2 }}>
                <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {/* Track */}
                    <path d="M20,110 A80,80 0 0,1 180,110" fill="none" stroke="#0F172A" strokeWidth="15" strokeLinecap="butt" />

                    {/* Dynamic Fill */}
                    <path
                        d="M20,110 A80,80 0 0,1 180,110"
                        fill="none"
                        stroke={color}
                        strokeWidth="15"
                        strokeLinecap="butt"
                        strokeDasharray={`${arcLength}, 251`}
                        className="gauge-anim"
                    />

                    {/* Marker Lines */}
                    <line x1="20" y1="110" x2="180" y2="110" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                </svg>

                {/* Center Value */}
                <div style={{ position: 'absolute', bottom: '0', textAlign: 'center', width: '100%' }}>
                    <div className="sensor-value" style={{ fontSize: '2.5rem', color: color, lineHeight: 1 }}>
                        {profitability}%
                    </div>
                    <div className="sensor-label" style={{ marginTop: '0.2rem', color: isSafe ? '#10B981' : '#94A3B8' }}>
                        {message || t('ai_forecast')}
                    </div>
                </div>
            </div>

            <style>{`
        .gauge-anim {
          transition: stroke-dasharray 1.5s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.5s;
        }
      `}</style>
        </div>
    );
}
