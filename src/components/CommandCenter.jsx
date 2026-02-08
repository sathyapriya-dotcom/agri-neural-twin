import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import '../styles/StateView.css';
import { useTranslation } from '../i18n';

export default function CommandCenter({ onDistrictSelect }) {
    const [districts, setDistricts] = useState([]);
    const [stats, setStats] = useState({ yield: 0, density: 0, gdp: 0 });
    const { t } = useTranslation();

    useEffect(() => {
        dataService.getDistrictsList().then(data => {
            setDistricts(data);

            // Calculate Aggregate Stats
            const totalYield = data.length * 12500; // Mock tonnage
            const density = data.reduce((acc, d) => acc + (d.irrigation || 50), 0) / data.length;
            const riskCount = data.filter(d => d.risk !== 'Low').length;
            const gdpShielded = (riskCount * 450) + 1200; // Cr INR

            setStats({
                yield: totalYield.toLocaleString(),
                density: density.toFixed(1),
                gdp: gdpShielded.toLocaleString()
            });
        });
    }, []);

    const getRiskLevel = (risk) => {
        if (risk === 'Low') return 'low';
        if (risk === 'Drought' || risk === 'Water Scarcity') return 'medium';
        return 'high';
    };

    return (
        <div className="state-view-container">
            <div className="scan-overlay"></div>

            {/* Header / Branding */}
            <div className="branding-header">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="itnt-logo">TN UNIFIED COMMAND CENTER</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', letterSpacing: '1px' }}>
                        POWERED BY iTNT HUB & EDII-TN • ECONOMIC SHIELD v2.0
                    </span>
                </div>
                <div className="partner-logos">
                    <span>AGRI-STACK INTEGRATED</span>
                    <span>•</span>
                    <span>BHARAT-VISTAAR LINKED</span>
                </div>
            </div>

            {/* State-Wide Stats */}
            <div className="state-stats-bar">
                <div className="stat-box">
                    <div className="stat-value">{stats.yield} T</div>
                    <div className="stat-label">{t('state_yield')}</div>
                </div>
                <div className="stat-box" style={{ borderColor: '#F59E0B' }}>
                    <div className="stat-value" style={{ color: '#F59E0B' }}>{stats.density}%</div>
                    <div className="stat-label">{t('active_density')}</div>
                </div>
                <div className="stat-box" style={{ borderColor: '#3B82F6' }}>
                    <div className="stat-value" style={{ color: '#3B82F6' }}>₹ {stats.gdp} Cr</div>
                    <div className="stat-label">{t('gdp_shielded')}</div>
                </div>
            </div>

            {/* Economic Health Map (Grid) */}
            <h2 className="cyber-font" style={{ color: '#10B981', marginBottom: '1rem' }}>
                {t('health_map')}
            </h2>

            <div className="tn-map-grid">
                {districts.map(d => {
                    const riskLevel = getRiskLevel(d.risk);
                    const isHighRisk = riskLevel === 'high';

                    return (
                        <div
                            key={d.id}
                            className={`district-hex ${isHighRisk ? 'risk-high' : ''}`}
                            onClick={() => onDistrictSelect(d.id)}
                            title={`Click to analyze ${d.name}`}
                        >
                            <div className="hex-name">{d.name}</div>
                            <div className="hex-risk" style={{ color: isHighRisk ? '#EF4444' : '#10B981' }}>
                                {d.risk}
                            </div>
                            {isHighRisk && <div style={{ fontSize: '0.6rem', color: '#EF4444', marginTop: '4px' }}>{t('alert_critical')}</div>}
                        </div>
                    );
                })}
            </div>

            {/* Equality Banner */}
            <div className="equality-banner">
                {t('equality_banner')}
            </div>
        </div>
    );
}
