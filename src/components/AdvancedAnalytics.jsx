import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTranslation } from '../i18n';
import '../styles/Dashboard.css';

// Mock Historical & Predictive Data (10 Years)
const trendData = [
    { year: '2019', yield: 4500, price: 2100, rainfall: 850 },
    { year: '2020', yield: 4200, price: 2300, rainfall: 780 },
    { year: '2021', yield: 3800, price: 3100, rainfall: 620 }, // Low rain
    { year: '2022', yield: 4900, price: 1800, rainfall: 950 }, // High yield glut
    { year: '2023', yield: 4600, price: 2200, rainfall: 880 },
    { year: '2024', yield: 4700, price: 2250, rainfall: 890 },
    { year: '2025 (P)', yield: 4100, price: 2900, rainfall: 700, predicted: true }, // Predicted
    { year: '2026 (P)', yield: 3900, price: 3400, rainfall: 650, predicted: true }, // Predicted drought
    { year: '2027 (P)', yield: 4300, price: 2600, rainfall: 800, predicted: true },
    { year: '2028 (P)', yield: 4800, price: 2100, rainfall: 920, predicted: true },
];

export default function AdvancedAnalytics() {
    const { t } = useTranslation();

    return (
        <div className="analytics-container" style={{ padding: '2rem', height: '100%', overflowY: 'auto', background: '#0f172a', color: '#fff' }}>

            <div className="analytics-header" style={{ marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                <h2 className="cyber-font" style={{ color: '#10B981', fontSize: '1.5rem' }}>{t('advanced_analytics')} // LONG-TERM HEALTH</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Historical Trends (2019-2024) & AI Predictions (2025-2028)
                </p>
            </div>

            <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Chart 1: Price vs Quantity (Supply/Demand) */}
                <div className="chart-card" style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <h3 className="cyber-font" style={{ fontSize: '1rem', color: '#3B82F6', marginBottom: '1rem' }}>MARKET EQUILIBRIUM FORECAST</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                                <YAxis yAxisId="left" stroke="#10B981" />
                                <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid #10B981', color: '#fff' }}
                                    labelStyle={{ color: '#10B981', fontWeight: 'bold' }}
                                />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="yield" stroke="#10B981" name="Yield (Tons)" strokeWidth={2} activeDot={{ r: 8 }} />
                                <Line yAxisId="right" type="monotone" dataKey="price" stroke="#F59E0B" name="Market Price (₹/Q)" strokeWidth={2} strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Rainfall Impact Analysis */}
                <div className="chart-card" style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <h3 className="cyber-font" style={{ fontSize: '1rem', color: '#60A5FA', marginBottom: '1rem' }}>CLIMATE CORRELATION MODEL</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#3B82F6" />
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #3B82F6' }} />
                                <Area type="monotone" dataKey="rainfall" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRain)" name="Rainfall (mm)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Predictive Heatmap (Future Risk) */}
            <div className="heatmap-section" style={{ marginTop: '2rem' }}>
                <h3 className="cyber-font" style={{ fontSize: '1rem', color: '#F472B6', marginBottom: '1rem' }}>PREDICTIVE SECTOR HEALTH (NEXT 4 QUARTERS)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'].map((q, i) => (
                        <div key={q} style={{ background: '#1e293b', padding: '1rem', border: '1px solid #334155', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{q}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: i === 1 ? '#EF4444' : (i === 2 ? '#F59E0B' : '#10B981'), marginTop: '0.5rem' }}>
                                {i === 1 ? 'High Risk' : (i === 2 ? 'Moderate' : 'Stable')}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.5rem' }}>
                                {i === 1 ? 'Drought Predicted' : (i === 2 ? 'Market Volatility' : 'Optimal Conditions')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
